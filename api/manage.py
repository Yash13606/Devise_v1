"""Operator-only migrations and explicit development seed."""
import argparse
from dataclasses import replace
import json
from pathlib import Path
from uuid import UUID
import psycopg
from api.config import Settings

ALPHA = UUID("10000000-0000-0000-0000-000000000001")
BETA = UUID("20000000-0000-0000-0000-000000000002")


def migrate(settings):
    if not settings.database_admin_url:
        raise RuntimeError("DATABASE_ADMIN_URL is required for migration")
    with psycopg.connect(settings.database_admin_url, connect_timeout=5) as conn:
        conn.execute("SELECT pg_advisory_xact_lock(47110801)")
        conn.execute("CREATE TABLE IF NOT EXISTS schema_migrations(version text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())")
        conn.execute("REVOKE ALL ON schema_migrations FROM PUBLIC")
        for path in sorted((Path(__file__).parent / "migrations").glob("*.sql")):
            if not conn.execute("SELECT 1 FROM schema_migrations WHERE version=%s", (path.name,)).fetchone():
                conn.execute(path.read_text(encoding="utf-8"))
                conn.execute("INSERT INTO schema_migrations(version) VALUES(%s)", (path.name,))


def seed_local(settings):
    if not settings.local_enabled:
        raise RuntimeError("Seed requires explicit development local authentication and generated secret")
    with psycopg.connect(settings.database_admin_url, connect_timeout=5) as conn:
        for org, name in [(ALPHA, "Local Alpha"), (BETA, "Local Beta")]:
            conn.execute("INSERT INTO organizations(id,name) VALUES(%s,%s) ON CONFLICT DO NOTHING", (org, name))
        for subject, email, name, org, role in [
            ("local|admin", "admin@local.devise.test", "Local Administrator", ALPHA, "admin"),
            ("local|viewer", "viewer@local.devise.test", "Local Viewer", ALPHA, "viewer"),
            ("local|other", "other@local.devise.test", "Other Organization Admin", BETA, "admin")]:
            conn.execute("INSERT INTO users(subject,email,name) VALUES(%s,%s,%s) ON CONFLICT DO NOTHING", (subject,email,name))
            conn.execute("INSERT INTO memberships(org_id,subject,role) VALUES(%s,%s,%s) ON CONFLICT DO NOTHING", (org,subject,role))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("command", choices=["migrate", "seed-local", "expire-pending"])
    parser.add_argument("--config", type=Path)
    args = parser.parse_args()
    settings = Settings.from_env()
    if args.config:
        values = json.loads(args.config.read_text())
        settings = replace(settings, database_url=values["runtime_dsn"], database_admin_url=values["admin_dsn"])
    {"migrate": migrate, "seed-local": seed_local, "expire-pending": expire_pending}[args.command](settings)
    print(args.command + " completed")


def expire_pending(settings):
    """Operator maintenance physically clears expired encrypted content for idle tenants."""
    from api.execution import EXPIRE_REQUEST_PAYLOAD_SQL
    if not settings.database_admin_url:
        raise RuntimeError("DATABASE_ADMIN_URL is required for expiration maintenance")
    with psycopg.connect(settings.database_admin_url,connect_timeout=5) as conn:
        conn.execute(EXPIRE_REQUEST_PAYLOAD_SQL)


if __name__ == "__main__":
    main()
