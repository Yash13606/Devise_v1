"""M1 integration proof. Real PostgreSQL; no in-memory persistence substitute."""
import json
from pathlib import Path
from uuid import uuid4

import pytest
from fastapi.testclient import TestClient


def test_factory_and_unconfigured_health_fail_closed():
    from api import index
    assert hasattr(index, "create_app"), "M1 requires an application factory"
    with TestClient(index.create_app()) as client:
        assert client.get("/health").status_code == 503
        assert client.post("/api/local/session", json={"email": "admin@local.devise.test"}).status_code == 403


@pytest.fixture
def settings():
    from api.config import Settings
    import os
    from psycopg.conninfo import conninfo_to_dict
    path = Path(".local/database.json")
    if not path.exists() and not os.getenv("DATABASE_TEST_URL"):
        pytest.skip("isolated PostgreSQL has not been provisioned")
    config = json.loads(path.read_text()) if path.exists() else {}
    runtime=os.getenv("DATABASE_TEST_URL",config.get("test_runtime_dsn",""))
    admin=os.getenv("DATABASE_ADMIN_TEST_URL",config.get("test_admin_dsn",""))
    if not runtime or not admin:
        pytest.skip("isolated devise_test PostgreSQL credentials have not been provisioned")
    assert conninfo_to_dict(runtime).get("dbname")=="devise_test", "Integration tests must use only the dedicated devise_test database"
    assert conninfo_to_dict(admin).get("dbname")=="devise_test", "Admin test DSN must target devise_test"
    return Settings(database_url=runtime, database_admin_url=admin,
                    app_env="development", auth_mode="local", local_auth_secret="test-only-secret-" + "x" * 48)


@pytest.fixture
def client(settings):
    from api.manage import migrate, seed_local
    from api.index import create_app
    migrate(settings)
    seed_local(settings)
    with TestClient(create_app(settings), base_url="http://127.0.0.1", client=("127.0.0.1", 50500)) as value:
        yield value


def human(client, email="admin@local.devise.test", org_index=0):
    result = client.post("/api/local/session", json={"email": email})
    assert result.status_code == 200, result.text
    headers = {"Authorization": "Bearer " + result.json()["access_token"]}
    me = client.get("/api/me", headers=headers).json()
    headers["X-Organization-ID"] = me["memberships"][org_index]["org_id"]
    return headers


def enroll(client, headers):
    token = client.post("/api/enrollments", headers=headers, json={"name": "Test PC"}).json()["enrollment_token"]
    payload = {"enrollment_token": token, "hostname": "test-pc", "os_version": "Windows", "agent_version": "1"}
    result = client.post("/api/devices/enroll", json=payload)
    assert result.status_code == 200, result.text
    return result.json(), payload


def detection():
    return {"event_id": str(uuid4()), "timestamp": "2026-10-25T13:00:00Z", "tool_name": "ChatGPT", "domain": "chatgpt.com", "category": "assistant", "vendor": "OpenAI", "risk_level": "low", "source": "network", "process_name": "browser.exe", "evidence_method": "domain", "confidence": 0.95}


def test_online_freshness_honors_long_heartbeat_and_excludes_revoked(client, settings):
    import psycopg
    from psycopg.types.json import Jsonb
    headers = human(client)
    device, _ = enroll(client, headers)
    with psycopg.connect(settings.database_admin_url) as conn:
        original = conn.execute("SELECT settings FROM organizations WHERE id=%s", (device["org_id"],)).fetchone()[0]
        conn.execute("UPDATE organizations SET settings=%s WHERE id=%s", (Jsonb({**original, "heartbeat_interval_seconds": 3600}), device["org_id"]))
    try:
        baseline = client.get("/api/stats", headers=headers).json()["devices_online"]
        with psycopg.connect(settings.database_admin_url) as conn:
            conn.execute("UPDATE devices SET last_seen=now()-interval '1800 seconds' WHERE id=%s", (device["device_id"],))
        online = client.get("/api/stats", headers=headers).json()["devices_online"]
        assert online == baseline + 1
        with psycopg.connect(settings.database_admin_url) as conn:
            conn.execute("UPDATE devices SET last_seen=now()-interval '7201 seconds' WHERE id=%s", (device["device_id"],))
        assert client.get("/api/stats", headers=headers).json()["devices_online"] == online - 1
        with psycopg.connect(settings.database_admin_url) as conn:
            conn.execute("UPDATE devices SET last_seen=now(),revoked_at=now() WHERE id=%s", (device["device_id"],))
        assert client.get("/api/stats", headers=headers).json()["devices_online"] == online - 1
    finally:
        with psycopg.connect(settings.database_admin_url) as conn:
            conn.execute("UPDATE organizations SET settings=%s WHERE id=%s", (Jsonb(original), device["org_id"]))


def test_local_login_rejects_host_origin_remote_and_unknown_account(client):
    body = {"email": "admin@local.devise.test"}
    assert client.post("/api/local/session", json=body, headers={"Host": "evil.example"}).status_code == 403
    assert client.post("/api/local/session", json=body, headers={"Origin": "https://evil.example"}).status_code == 403
    assert client.post("/api/local/session", json={"email": "unknown@alpha.local"}).status_code == 401
    assert client.post("/api/local/session", json={**body, "role": "admin"}).status_code == 422
    from api.index import create_app
    with TestClient(create_app(client.app.state.settings), base_url="http://127.0.0.1", client=("192.0.2.1", 50)) as remote:
        assert remote.post("/api/local/session", json=body).status_code == 403


def test_membership_roles_and_foreign_tenant_are_server_resolved(client):
    admin = human(client)
    beta = human(client, "other@local.devise.test")
    member = human(client, "viewer@local.devise.test")
    assert client.get("/api/events").status_code == 401
    assert client.get("/api/events", headers={**admin, "X-Organization-ID": beta["X-Organization-ID"]}).status_code == 403
    assert client.post("/api/enrollments", headers={**member, "X-Role": "admin"}, json={"name": "bad"}).status_code == 403


def test_enrollment_exchange_is_single_use_and_revoked_devices_cannot_ingest(client):
    headers = human(client)
    device, exchange = enroll(client, headers)
    assert client.post("/api/devices/enroll", json=exchange).status_code == 401
    auth = {"Authorization": "Bearer " + device["device_token"]}
    assert client.post("/api/heartbeat", headers=auth, json={"agent_version": "1", "os_version": "Windows", "queue_depth": 2, "monitoring_enabled": True, "consent_version": "v1", "registry_version": "204", "config_version": 1}).status_code == 200
    assert client.post("/api/devices/" + device["device_id"] + "/revoke", headers=headers).status_code == 200
    assert client.get("/api/device/config", headers=auth).status_code == 401
    assert client.post("/api/events/batch", headers=auth, json={"schema_version": 1, "events": [detection()]}).status_code == 401


def test_batch_idempotency_conflicts_atomicity_validation_and_restart(client):
    from api.index import create_app
    headers = human(client)
    device, _ = enroll(client, headers)
    auth = {"Authorization": "Bearer " + device["device_token"]}
    event = detection()
    batch = {"schema_version": 1, "events": [event]}
    assert client.post("/api/events/batch", headers=auth, json=batch).json() == {"accepted": 1, "duplicates": 0}
    assert client.post("/api/events/batch", headers=auth, json=batch).json() == {"accepted": 0, "duplicates": 1}
    new = detection()
    assert client.post("/api/events/batch", headers=auth, json={"schema_version": 1, "events": [new, {**event, "tool_name": "changed"}]}).status_code == 409
    rows = client.get("/api/events", headers=headers).json()["events"]
    assert str(new["event_id"]) not in [r["event_id"] for r in rows]
    assert client.post("/api/events/batch", headers=auth, json={"schema_version": 1, "events": [{**detection(), "org_id": str(uuid4())}]}).status_code == 422
    assert client.post("/api/events/batch", headers=auth, json={"schema_version": 1, "events": [{**detection(), "timestamp": "2026-01-01T00:00:00"}]}).status_code == 422
    with TestClient(create_app(client.app.state.settings), base_url="http://127.0.0.1", client=("127.0.0.1", 5)) as restarted:
        assert event["event_id"] in [r["event_id"] for r in restarted.get("/api/events", headers=headers).json()["events"]]
    beta = human(client, "other@local.devise.test")
    assert event["event_id"] not in [r["event_id"] for r in client.get("/api/events", headers=beta).json()["events"]]


def test_scanner_is_explicitly_unavailable(client):
    assert client.post("/api/understand/scan", json={"directory": "C:/"}).status_code == 501
    assert client.get("/api/understand/graph").status_code == 501


def test_expired_enrollment_and_concurrent_exchange(client, settings):
    import psycopg
    from api.auth import token_hash
    from concurrent.futures import ThreadPoolExecutor
    headers = human(client)
    token = client.post("/api/enrollments", headers=headers, json={"name": "expired"}).json()["enrollment_token"]
    with psycopg.connect(settings.database_admin_url) as conn:
        conn.execute("UPDATE enrollments SET expires_at=now()-interval '1 second' WHERE token_hash=%s", (token_hash(token),))
    payload = {"enrollment_token": token, "hostname": "test", "agent_version": "1", "os_version": "Windows"}
    assert client.post("/api/devices/enroll", json=payload).status_code == 401
    payload["enrollment_token"] = client.post("/api/enrollments", headers=headers, json={"name": "race"}).json()["enrollment_token"]
    with ThreadPoolExecutor(max_workers=2) as pool:
        statuses = sorted(pool.map(lambda _: client.post("/api/devices/enroll", json=payload).status_code, range(2)))
    assert statuses == [200, 401]


def test_rls_and_grants_enforce_tenant_reads_writes_and_public_denial(client, settings):
    import psycopg
    from api.db import connection
    headers = human(client)
    device, _ = enroll(client, headers)
    with connection(settings) as conn:
        assert conn.execute("SELECT count(*) AS n FROM devices").fetchone()["n"] == 0
        role = conn.execute("SELECT rolsuper,rolbypassrls FROM pg_roles WHERE rolname=current_user").fetchone()
        assert role == {"rolsuper": False, "rolbypassrls": False}
    with connection(settings, org_id="20000000-0000-0000-0000-000000000002") as conn:
        assert conn.execute("SELECT id FROM devices WHERE id=%s", (device["device_id"],)).fetchone() is None
    with pytest.raises(psycopg.errors.InsufficientPrivilege):
        with connection(settings, org_id="20000000-0000-0000-0000-000000000002") as conn:
            conn.execute("INSERT INTO events(org_id,event_id,device_id,payload) VALUES(%s,%s,%s,'{}')", (device["org_id"], uuid4(),device["device_id"]))
    with pytest.raises(psycopg.errors.InsufficientPrivilege):
        with connection(settings) as conn:
            conn.execute("UPDATE memberships SET role='admin'")
    with psycopg.connect(settings.database_admin_url) as conn:
        assert conn.execute("SELECT has_table_privilege('public','events','SELECT')").fetchone()[0] is False


def test_local_production_guard_forgery_expiry_and_request_bounds(client, settings):
    from dataclasses import replace
    from api.index import create_app
    from jose import jwt
    headers = human(client)
    assert client.get("/api/me", headers={"Authorization": headers["Authorization"] + "x"}).status_code == 401
    expired = jwt.encode({"sub": "local|admin", "exp": 1, "aud": "devise-local-human", "iss": "devise-local"}, settings.local_auth_secret, algorithm="HS256")
    assert client.get("/api/me", headers={"Authorization": "Bearer " + expired}).status_code == 401
    assert client.post("/api/local/session", content=b"x" * (512 * 1024 + 1)).status_code == 413
    with TestClient(create_app(replace(settings, app_env="production")), base_url="http://127.0.0.1", client=("127.0.0.1",5)) as prod:
        assert prod.post("/api/local/session", json={"email": "admin@local.devise.test"}).status_code == 403
        assert prod.get("/health").status_code == 503
    with TestClient(create_app(replace(settings, allowed_origins=("https://dashboard.example.com",))), base_url="http://127.0.0.1", client=("127.0.0.1",5)) as configured_remote_origin:
        assert configured_remote_origin.post("/api/local/session",headers={"Origin":"https://dashboard.example.com"},json={"email":"admin@local.devise.test"}).status_code==403


def test_auth0_rs256_offline_verifies_signature_issuer_audience_expiry():
    from api.auth import verify_auth0
    from api.config import Settings
    from cryptography.hazmat.primitives.asymmetric import rsa
    from cryptography.hazmat.primitives import serialization
    from jose import jwt, jwk
    from fastapi import HTTPException
    import time
    key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    private = key.private_bytes(serialization.Encoding.PEM, serialization.PrivateFormat.PKCS8, serialization.NoEncryption())
    public = key.public_key().public_bytes(serialization.Encoding.PEM, serialization.PublicFormat.SubjectPublicKeyInfo)
    j = jwk.construct(public, algorithm="RS256").to_dict()
    j["kid"] = "offline-test"
    config = Settings(auth0_domain="tenant.auth0.test", auth0_audience="devise-api")
    claims = {"sub": "auth0|123", "iss": "https://tenant.auth0.test/", "aud": "devise-api", "exp": int(time.time())+600, "role": "admin"}
    def encode(values):
        return jwt.encode(values, private, algorithm="RS256", headers={"kid": "offline-test"})
    assert verify_auth0(encode(claims), config, {"keys": [j]}).subject == "auth0|123"
    for override in [{"iss": "https://evil.test/"}, {"aud": "elsewhere"}, {"exp": 1}, {"sub": ""}]:
        with pytest.raises(HTTPException) as error:
            verify_auth0(encode({**claims, **override}), config, {"keys": [j]})
        assert error.value.status_code == 401
    with pytest.raises(HTTPException):
        verify_auth0(encode(claims)[:-4]+"evil",config,{"keys":[j]})
    with pytest.raises(HTTPException):
        verify_auth0(jwt.encode(claims,"fake-secret",algorithm="HS256",headers={"kid":"offline-test"}),config,{"keys":[j]})


def test_privileged_runtime_and_missing_schema_fail_closed(settings):
    from dataclasses import replace
    from api.index import create_app
    from api.db import connection
    from fastapi import HTTPException
    with pytest.raises(HTTPException) as error:
        with connection(replace(settings, database_url=settings.database_admin_url)) as conn:
            conn.execute("SELECT count(*) FROM users")
    assert error.value.status_code == 503


def test_cors_origin_configuration_is_explicit_and_secrets_not_represented(monkeypatch):
    from api.config import Settings
    monkeypatch.setenv("CORS_ORIGINS", "https://dashboard.example.com")
    assert Settings.from_env().allowed_origins == ("https://dashboard.example.com",)
    for value in ["*", "https://example.com/path", "http://example.com", "https://name:secret@example.com", "https://example.com?x=1"]:
        monkeypatch.setenv("CORS_ORIGINS", value)
        with pytest.raises(ValueError):
            Settings.from_env()
    assert "private-dsn" not in repr(Settings(database_url="private-dsn",local_auth_secret="private-secret"))


def test_device_configuration_uses_persisted_organization_settings(client, settings):
    import psycopg
    headers=human(client)
    device,_=enroll(client,headers)
    with psycopg.connect(settings.database_admin_url) as conn:
        old=conn.execute("SELECT settings FROM organizations WHERE id=%s",(device["org_id"],)).fetchone()[0]
        conn.execute("UPDATE organizations SET settings='{\"poll_interval_seconds\":12,\"heartbeat_interval_seconds\":45,\"monitoring_enabled\":false}' WHERE id=%s",(device["org_id"],))
    try:
        config=client.get("/api/device/config",headers={"Authorization":"Bearer "+device["device_token"]}).json()["config"]
        assert config["poll_interval_seconds"]==12
        assert config["heartbeat_interval_seconds"]==45
        assert config["monitoring_enabled"] is False
        assert config["terminate_processes"] is False
    finally:
        from psycopg.types.json import Jsonb
        with psycopg.connect(settings.database_admin_url) as conn:
            conn.execute("UPDATE organizations SET settings=%s WHERE id=%s",(Jsonb(old),device["org_id"]))
