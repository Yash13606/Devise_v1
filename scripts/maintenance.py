"""Local operator maintenance; no monitoring or request content in logs."""
import logging
import time
from api.config import Settings
from api.manage import expire_pending


def main():
    settings = Settings.from_env()
    if not settings.local_enabled or not settings.database_admin_url:
        raise SystemExit("Local maintenance requires explicit development configuration and operator database access")
    while True:
        try:
            expire_pending(settings)
        except Exception:
            # Database exception text can carry private connection information.
            logging.error("Pending-content maintenance failed; check local database readiness")
        time.sleep(30)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        pass
