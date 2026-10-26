"""Frozen launcher for the supported CLI, with an observation-free package check."""
import hashlib
import json
from pathlib import Path
import sys

from pilot_agent import VERSION, main


def package_check():
    from registry import Registry
    registry = Registry()
    path = Path(registry._get_default_registry_path())
    if registry.entry_count < 1 or registry.find_match("chatgpt.com") is None:
        raise RuntimeError("Bundled registry is missing or invalid")
    print(json.dumps({"version": VERSION, "frozen": bool(getattr(sys, "frozen", False)),
                      "registry_entries": registry.entry_count,
                      "registry_sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
                      "monitoring_started": False}))
    return 0


if __name__ == "__main__":
    raise SystemExit(package_check() if sys.argv[1:] == ["--package-check"] else main())
