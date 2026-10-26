"""Supported Windows pilot entrypoint. Legacy direct-database agent is disabled."""
from pilot_agent import main

if __name__ == "__main__":
    raise SystemExit(main())
