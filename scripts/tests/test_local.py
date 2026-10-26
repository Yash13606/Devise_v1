import importlib.util
import json
from pathlib import Path

import pytest

spec = importlib.util.spec_from_file_location("local_setup", Path(__file__).parents[1] / "local.py")
local = importlib.util.module_from_spec(spec)
spec.loader.exec_module(local)


def test_configuration_is_private_stable_and_loopback(tmp_path):
    path = tmp_path / "database.json"
    first = local.load_or_create_config(path, 55432)
    second = local.load_or_create_config(path, 55432)
    assert first == second
    assert first["admin_dsn"].startswith("postgresql://devise_owner:")
    assert "@127.0.0.1:55432/" in first["runtime_dsn"]
    assert len(first["auth_secret"]) >= 48
    assert first["admin_dsn"] != first["runtime_dsn"]
    assert json.loads(path.read_text()) == first
    with pytest.raises(ValueError, match="port"):
        local.load_or_create_config(path, 55433)


def test_configuration_refuses_foreign_database_and_malformed_files(tmp_path):
    path = tmp_path / "database.json"
    local.load_or_create_config(path, 55432)
    config = json.loads(path.read_text())
    config["runtime_dsn"] = "postgresql://someone:secret@remote.example:5432/production"
    path.write_text(json.dumps(config))
    with pytest.raises(ValueError, match="local"):
        local.load_or_create_config(path, 55432)
    path.write_text("not json")
    with pytest.raises(ValueError):
        local.load_or_create_config(path, 55432)


def test_local_environment_preserves_owner_settings(tmp_path):
    path = tmp_path / ".env.local"
    config = local.load_or_create_config(tmp_path / "database.json", 55432)
    local.write_environment(path, config)
    assert "DEVISE_AUTH_MODE=local" in path.read_text()
    path.write_text("APP_ENV=production\nDATABASE_URL=owner-settings\n")
    with pytest.raises(ValueError, match="overwrite"):
        local.write_environment(path, config)
    assert "owner-settings" in path.read_text()


def test_owned_paths_reject_escape(tmp_path):
    assert local.owned_path(tmp_path, "postgres") == tmp_path / "postgres"
    with pytest.raises(ValueError, match="outside"):
        local.owned_path(tmp_path, "../other")


@pytest.mark.parametrize("port", [0, 80, 65536, "bad"])
def test_invalid_ports_are_rejected(port):
    with pytest.raises(ValueError, match="port"):
        local.validate_port(port)
