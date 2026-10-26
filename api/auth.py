"""Human and device principals are deliberately distinct credential classes."""
from dataclasses import dataclass
from datetime import datetime, timezone
import hashlib
import ipaddress
import time
from urllib.parse import urlsplit
import httpx
from fastapi import HTTPException, Request
from jose import jwt, JWTError
from api.db import connection


@dataclass(frozen=True)
class Identity:
    subject: str
    email: str = ""
    name: str = ""


@dataclass(frozen=True)
class Membership:
    org_id: str
    role: str
    subject: str


@dataclass(frozen=True)
class DeviceIdentity:
    device_id: str
    org_id: str


def token_hash(token):
    return hashlib.sha256(token.encode()).hexdigest()


def bearer(request):
    raw = request.headers.get("Authorization", "")
    if not raw.startswith("Bearer ") or len(raw) > 8192:
        raise HTTPException(401, "Bearer credential required")
    return raw[7:]


def loopback(value):
    if value == "localhost":
        return True
    try:
        return ipaddress.ip_address(value).is_loopback
    except ValueError:
        return False


def guard_local(request):
    settings = request.app.state.settings
    host = urlsplit("//" + request.headers.get("host", "")).hostname
    origin = request.headers.get("origin")
    origin_host=urlsplit(origin).hostname if origin else None
    if not settings.local_enabled or not request.client or not loopback(request.client.host) or not host or not loopback(host) or (origin and (origin not in settings.allowed_origins or not origin_host or not loopback(origin_host))):
        raise HTTPException(403, "Local authentication requires explicit development configuration and trusted loopback access")


def verify_auth0(token, settings, jwks=None):
    """Only RS256 with exact issuer/audience. Role and organization claims confer no authority."""
    try:
        header = jwt.get_unverified_header(token)
        if header.get("alg") != "RS256" or not header.get("kid"):
            raise ValueError("Unsupported signing key")
        keys = jwks if jwks is not None else settings.jwks
        if keys is None:
            now = time.monotonic()
            cached = _jwks_cache.get(settings.auth0_domain)
            if cached and cached[0] > now:
                keys = cached[1]
            else:
                response = httpx.get("https://" + settings.auth0_domain.rstrip("/") + "/.well-known/jwks.json", timeout=5, follow_redirects=False)
                response.raise_for_status()
                keys = response.json()
                _jwks_cache[settings.auth0_domain] = (now + 300, keys)
        key = next(k for k in keys["keys"] if k.get("kid") == header["kid"])
        claims = jwt.decode(token, key, algorithms=["RS256"], audience=settings.auth0_audience,
                            issuer="https://" + settings.auth0_domain.rstrip("/") + "/", options={"require_exp": True, "require_sub": True, "require_aud": True, "require_iss": True})
        if not isinstance(claims.get("sub"), str) or not claims["sub"]:
            raise ValueError("Missing subject")
        return Identity(claims["sub"], claims.get("email", ""), claims.get("name", ""))
    except (JWTError, ValueError, KeyError, TypeError, StopIteration, httpx.HTTPError):
        raise HTTPException(401, "Invalid human access token") from None


_jwks_cache = {}


def require_human(request):
    settings = request.app.state.settings
    token = bearer(request)
    if settings.auth_mode == "local":
        guard_local(request)
        try:
            claims = jwt.decode(token, settings.local_auth_secret, algorithms=["HS256"], audience="devise-local-human", issuer="devise-local", options={"require_exp": True, "require_sub": True})
            subject = claims["sub"]
        except (JWTError, KeyError):
            raise HTTPException(401, "Invalid or expired local session") from None
        with connection(settings, subject=subject) as conn:
            row = conn.execute("SELECT * FROM users WHERE subject=%s", (subject,)).fetchone()
        if not row:
            raise HTTPException(401, "Unknown account")
        return Identity(**row)
    if not settings.configured:
        raise HTTPException(503, "Authentication is not configured")
    return verify_auth0(token, settings)


def require_member(request, admin=False):
    principal = require_human(request)
    from uuid import UUID
    try:
        org = str(UUID(request.headers.get("X-Organization-ID", "")))
    except ValueError:
        raise HTTPException(400, "X-Organization-ID must be an organization UUID") from None
    with connection(request.app.state.settings, subject=principal.subject) as conn:
        row = conn.execute("SELECT role FROM memberships WHERE org_id=%s AND subject=%s", (org, principal.subject)).fetchone()
    if not row or (admin and row["role"] != "admin"):
        raise HTTPException(403, "Organization membership or administrator role required")
    return Membership(org, row["role"], principal.subject)


def require_device(request):
    token = bearer(request)
    if not token.startswith("dv_"):
        raise HTTPException(401, "Device credential required")
    with connection(request.app.state.settings, device_token_hash=token_hash(token)) as conn:
        row = conn.execute("SELECT id,org_id FROM devices WHERE token_hash=%s AND revoked_at IS NULL", (token_hash(token),)).fetchone()
    if not row:
        raise HTTPException(401, "Invalid or revoked device credential")
    return DeviceIdentity(str(row["id"]), str(row["org_id"]))
