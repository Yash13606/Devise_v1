"""Short, transaction-scoped connections; tenant settings cannot leak across requests."""
from contextlib import contextmanager
import psycopg
from psycopg.rows import dict_row
from fastapi import HTTPException


@contextmanager
def connection(settings, org_id=None, subject=None, device_token_hash=None, enrollment_hash=None, local_email=None):
    if not settings.database_url:
        raise HTTPException(503, "Database is not configured")
    try:
        with psycopg.connect(settings.database_url, row_factory=dict_row, connect_timeout=3) as conn:
            role = conn.execute("SELECT rolsuper,rolbypassrls FROM pg_roles WHERE rolname=current_user").fetchone()
            if role["rolsuper"] or role["rolbypassrls"]:
                raise HTTPException(503, "Runtime database role must not bypass tenant security")
            for key, value in {"org_id": org_id, "subject": subject, "device_hash": device_token_hash,
                               "enrollment_hash": enrollment_hash, "local_email": local_email}.items():
                conn.execute("SELECT set_config(%s, %s, true)", ("app." + key, str(value) if value is not None else ""))
            conn.execute("SET LOCAL statement_timeout = '5000ms'")
            yield conn
    except (psycopg.OperationalError, psycopg.InterfaceError, psycopg.errors.UndefinedTable):
        raise HTTPException(503, "Database is unavailable") from None


def set_org(conn, org_id):
    conn.execute("SELECT set_config('app.org_id', %s, true)", (str(org_id),))
