"""Explicit backend configuration. Local identity is never an automatic fallback."""
from dataclasses import dataclass, field
import os
from urllib.parse import urlsplit
import ipaddress


@dataclass(frozen=True)
class Settings:
    database_url: str = field(default="", repr=False)
    database_admin_url: str = field(default="", repr=False)
    app_env: str = "production"
    auth_mode: str = "auth0"
    local_auth_secret: str = field(default="", repr=False)
    auth0_domain: str = ""
    auth0_audience: str = ""
    allowed_origins: tuple[str, ...] = ("http://127.0.0.1:8081", "http://localhost:8081")
    session_seconds: int = 1800
    jwks: dict | None = field(default=None, repr=False)
    mcp_upstream_url: str = ""
    pending_secret: str = field(default="", repr=False)

    def __post_init__(self):
        for origin in self.allowed_origins:
            parsed = urlsplit(origin)
            try:
                is_loopback = parsed.hostname == "localhost" or ipaddress.ip_address(parsed.hostname or "").is_loopback
            except ValueError:
                is_loopback = False
            if not parsed.hostname or parsed.scheme not in {"https", "http"} or parsed.path or parsed.query or parsed.fragment or parsed.username or parsed.password or "*" in origin or (parsed.scheme == "http" and not is_loopback):
                raise ValueError("CORS_ORIGINS must contain exact HTTPS origins or HTTP loopback origins")

    @classmethod
    def from_env(cls):
        return cls(database_url=os.getenv("DATABASE_URL", ""), database_admin_url=os.getenv("DATABASE_ADMIN_URL", ""),
                   app_env=os.getenv("APP_ENV", "production"), auth_mode=os.getenv("DEVISE_AUTH_MODE", "auth0"),
                   local_auth_secret=os.getenv("DEVISE_LOCAL_AUTH_SECRET", ""),
                   auth0_domain=os.getenv("AUTH0_DOMAIN", ""), auth0_audience=os.getenv("AUTH0_AUDIENCE", ""),
                   allowed_origins=tuple(x.strip() for x in os.getenv("CORS_ORIGINS", "http://127.0.0.1:8081,http://localhost:8081").split(",") if x.strip()),
                   mcp_upstream_url=os.getenv("DEVISE_MCP_UPSTREAM_URL", ""), pending_secret=os.getenv("DEVISE_PENDING_SECRET", ""))

    @property
    def local_enabled(self):
        return self.app_env == "development" and self.auth_mode == "local" and len(self.local_auth_secret) >= 32

    @property
    def configured(self):
        auth_ready = self.local_enabled if self.auth_mode == "local" else bool(self.auth_mode == "auth0" and self.auth0_domain and self.auth0_audience)
        return bool(self.database_url and auth_ready)
