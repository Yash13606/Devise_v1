"""Prepare a disposable CI test role. Refuses application/production databases."""
import os
import psycopg
from psycopg.conninfo import conninfo_to_dict
from psycopg import sql


def main():
    admin = os.environ["DATABASE_ADMIN_TEST_URL"]
    runtime = os.environ["DATABASE_TEST_URL"]
    admin_parts, runtime_parts = conninfo_to_dict(admin), conninfo_to_dict(runtime)
    for parts in [admin_parts, runtime_parts]:
        if parts.get("dbname") != "devise_test" or parts.get("host") not in {"127.0.0.1", "localhost"}:
            raise ValueError("CI provisioning requires a loopback devise_test database")
    if runtime_parts.get("user") != "devise_app" or not runtime_parts.get("password"):
        raise ValueError("CI requires an explicit restricted runtime credential")
    with psycopg.connect(admin) as conn:
        if not conn.execute("SELECT 1 FROM pg_roles WHERE rolname='devise_app'").fetchone():
            conn.execute(sql.SQL("CREATE ROLE devise_app LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOBYPASSRLS PASSWORD {}")
                         .format(sql.Literal(runtime_parts["password"])))
        conn.execute("REVOKE ALL ON DATABASE devise_test FROM PUBLIC")
        conn.execute("GRANT CONNECT ON DATABASE devise_test TO devise_app")
    print("Disposable CI database role is ready")


if __name__ == "__main__":
    main()
