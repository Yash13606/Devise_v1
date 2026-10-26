from datetime import datetime, timedelta, timezone
import secrets
from uuid import uuid4, UUID
from fastapi import APIRouter, Request, HTTPException, Query
from jose import jwt
from psycopg.types.json import Jsonb
from api.auth import guard_local, require_human, require_member, require_device, token_hash
from api.db import connection, set_org
from api.models import LocalSession, Enrollment, Exchange, Batch, Heartbeat

router = APIRouter()
DEFAULT_CONFIG = {"poll_interval_seconds": 30, "heartbeat_interval_seconds": 30, "monitoring_enabled": True, "batch_size": 100,
                  "observation_only": True, "terminate_processes": False, "clipboard_enabled": False}


def organization_config(conn,org_id):
    row=conn.execute("SELECT settings FROM organizations WHERE id=%s",(org_id,)).fetchone()
    settings=row["settings"] if row else {}
    return {**DEFAULT_CONFIG,**{key:settings[key] for key in ("poll_interval_seconds","heartbeat_interval_seconds","monitoring_enabled") if key in settings}}


@router.get("/api/local/accounts")
def local_accounts(request: Request):
    guard_local(request)
    return {"accounts": [{"email": "admin@local.devise.test", "name": "Local Administrator"},
                         {"email": "viewer@local.devise.test", "name": "Local Viewer"},
                         {"email": "other@local.devise.test", "name": "Other Organization Admin"}]}


@router.post("/api/local/session")
def local_session(body: LocalSession, request: Request):
    guard_local(request)
    if body.email.lower() not in {"admin@local.devise.test", "viewer@local.devise.test", "other@local.devise.test"}:
        raise HTTPException(401, "Unknown seeded local account")
    settings = request.app.state.settings
    with connection(settings, local_email=body.email.lower()) as conn:
        user = conn.execute("SELECT subject FROM users WHERE email=%s", (body.email.lower(),)).fetchone()
    if not user:
        raise HTTPException(401, "Unknown seeded local account")
    now = datetime.now(timezone.utc)
    token = jwt.encode({"sub": user["subject"], "iat": now, "exp": now + timedelta(seconds=settings.session_seconds),
                        "aud": "devise-local-human", "iss": "devise-local", "jti": secrets.token_urlsafe(24)}, settings.local_auth_secret, algorithm="HS256")
    return {"access_token": token, "token_type": "bearer", "expires_in": settings.session_seconds}


@router.get("/api/me")
def me(request: Request):
    user = require_human(request)
    with connection(request.app.state.settings, subject=user.subject) as conn:
        rows = conn.execute("SELECT m.org_id,o.name AS org_name,m.role FROM memberships m JOIN organizations o ON m.org_id=o.id WHERE m.subject=%s ORDER BY o.name", (user.subject,)).fetchall()
    return {"subject": user.subject, "email": user.email, "name": user.name, "memberships": rows}


@router.post("/api/enrollments")
def enrollment(body: Enrollment, request: Request):
    member = require_member(request, admin=True)
    token = "en_" + secrets.token_urlsafe(48)
    expires = datetime.now(timezone.utc) + timedelta(seconds=body.expires_in_seconds)
    with connection(request.app.state.settings, member.org_id) as conn:
        conn.execute("INSERT INTO enrollments(id,org_id,name,token_hash,expires_at) VALUES(%s,%s,%s,%s,%s)", (uuid4(), member.org_id,body.name,token_hash(token),expires))
    return {"enrollment_token": token, "expires_at": expires}


@router.post("/api/devices/enroll")
def exchange(body: Exchange, request: Request):
    digest = token_hash(body.enrollment_token)
    device_token = "dv_" + secrets.token_urlsafe(48)
    device_id = uuid4()
    with connection(request.app.state.settings, enrollment_hash=digest) as conn:
        row = conn.execute("SELECT * FROM enrollments WHERE token_hash=%s FOR UPDATE", (digest,)).fetchone()
        if not row or row["used_at"] or row["expires_at"] <= datetime.now(timezone.utc):
            raise HTTPException(401, "Enrollment is expired, invalid or already used")
        set_org(conn, row["org_id"])
        conn.execute("UPDATE enrollments SET used_at=now() WHERE id=%s", (row["id"],))
        conn.execute("INSERT INTO devices(id,org_id,name,token_hash,hostname,os_version,agent_version) VALUES(%s,%s,%s,%s,%s,%s,%s)", (device_id,row["org_id"],row["name"],token_hash(device_token),body.hostname,body.os_version,body.agent_version))
    return {"device_token": device_token, "device_id": device_id, "org_id": row["org_id"]}


@router.get("/api/devices")
def devices(request: Request):
    member = require_member(request)
    with connection(request.app.state.settings, member.org_id) as conn:
        rows = conn.execute("SELECT id,org_id,name,hostname,os_version,agent_version,last_seen,queue_depth,revoked_at,monitoring_enabled FROM devices ORDER BY name,id").fetchall()
    return {"devices": rows}


@router.post("/api/devices/{device_id}/revoke")
def revoke(device_id: UUID, request: Request):
    member = require_member(request, admin=True)
    with connection(request.app.state.settings, member.org_id) as conn:
        row = conn.execute("UPDATE devices SET revoked_at=COALESCE(revoked_at,now()) WHERE id=%s RETURNING id", (device_id,)).fetchone()
        if not row:
            raise HTTPException(404, "Device not found")
    return {"revoked": True}


@router.post("/api/events/batch")
def batch(body: Batch, request: Request):
    device = require_device(request)
    accepted = duplicates = 0
    with connection(request.app.state.settings, device.org_id) as conn:
        valid = conn.execute("SELECT id FROM devices WHERE id=%s AND revoked_at IS NULL FOR UPDATE", (device.device_id,)).fetchone()
        if not valid:
            raise HTTPException(401, "Device revoked")
        for event in body.events:
            payload = event.model_dump(mode="json")
            result = conn.execute("INSERT INTO events(org_id,event_id,device_id,payload) VALUES(%s,%s,%s,%s) ON CONFLICT DO NOTHING RETURNING event_id", (device.org_id,event.event_id,device.device_id,Jsonb(payload))).fetchone()
            if result:
                accepted += 1
            else:
                existing = conn.execute("SELECT device_id,payload FROM events WHERE event_id=%s", (event.event_id,)).fetchone()
                if str(existing["device_id"]) != device.device_id or existing["payload"] != payload:
                    raise HTTPException(409, "Conflicting reuse of event ID; batch rolled back")
                duplicates += 1
    return {"accepted": accepted, "duplicates": duplicates}


@router.get("/api/events")
def events(request: Request, limit: int = Query(200, ge=1, le=1000), offset: int = Query(0, ge=0, le=1000000)):
    member = require_member(request)
    with connection(request.app.state.settings, member.org_id) as conn:
        total = conn.execute("SELECT count(*) AS total FROM events").fetchone()["total"]
        rows = conn.execute("SELECT payload,org_id,device_id FROM events ORDER BY received_at DESC,event_id LIMIT %s OFFSET %s", (limit,offset)).fetchall()
    return {"total": total, "events": [{**row["payload"], "org_id": row["org_id"], "device_id": row["device_id"]} for row in rows]}


@router.get("/api/stats")
def stats(request: Request):
    member = require_member(request)
    with connection(request.app.state.settings, member.org_id) as conn:
        counts = conn.execute("SELECT count(*) AS events,count(DISTINCT payload->>'tool_name') AS tools,count(*) FILTER(WHERE payload->>'risk_level'='high') AS high_risk_events FROM events").fetchone()
        freshness_seconds = max(120, 2 * organization_config(conn, member.org_id)["heartbeat_interval_seconds"])
        counts.update(conn.execute("SELECT count(*) AS devices_total,count(*) FILTER(WHERE revoked_at IS NULL AND last_seen>now()-(%s * interval '1 second')) AS devices_online FROM devices", (freshness_seconds,)).fetchone())
    return counts


@router.post("/api/heartbeat")
def heartbeat(body: Heartbeat, request: Request):
    device = require_device(request)
    with connection(request.app.state.settings, device.org_id) as conn:
        row = conn.execute("UPDATE devices SET last_seen=now(),agent_version=%s,os_version=%s,queue_depth=%s,monitoring_enabled=%s,consent_version=%s,registry_version=%s WHERE id=%s AND revoked_at IS NULL RETURNING config_version", (body.agent_version,body.os_version,body.queue_depth,body.monitoring_enabled,body.consent_version,body.registry_version,device.device_id)).fetchone()
        if not row:
            raise HTTPException(401, "Device revoked")
        config=organization_config(conn,device.org_id)
    return {"config_version": row["config_version"], "config": config}


@router.get("/api/device/config")
def device_config(request: Request):
    device = require_device(request)
    with connection(request.app.state.settings, device.org_id) as conn:
        row = conn.execute("SELECT config_version FROM devices WHERE id=%s AND revoked_at IS NULL", (device.device_id,)).fetchone()
        if not row:
            raise HTTPException(401, "Device revoked")
        config=organization_config(conn,device.org_id)
    return {"config_version": row["config_version"], "config": config}
