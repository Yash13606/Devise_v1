"""Typed settings dataclasses for Devise agent modules.

Each module declares exactly what it needs as constructor parameters rather
than reading from the global Config object directly. build_agent_settings()
converts a Config instance into the specific Settings type each module needs.

This seam means: changing the config source (file → Supabase → env) touches
only ConfigLoader/build_agent_settings, not every downstream module.
"""

from dataclasses import dataclass
from typing import Optional


@dataclass(frozen=True)
class ReporterSettings:
    supabase_url: str
    supabase_key: str
    timeout: float = 10.0
    batch_size: int = 100


@dataclass(frozen=True)
class HeartbeatSettings:
    device_id: str
    org_id: str
    user_email: str
    agent_version: str
    supabase_url: str
    supabase_key: str


@dataclass(frozen=True)
class FirewallSettings:
    supabase_url: str
    supabase_key: str
    org_id: str


@dataclass(frozen=True)
class AgentSettings:
    api_key: str
    device_id: str
    org_id: str
    supabase_url: str
    supabase_key: str
    poll_interval: int = 30
    deduplication_window: int = 60
    doh_enabled: bool = True
    agent_version: str = "1.0.0"
    registry_update_url: Optional[str] = None
    config_endpoint: Optional[str] = None


def build_agent_settings(config, device_id: str = "") -> "AgentSettings":
    """Build AgentSettings from a Config instance.

    device_id may come from IdentityResolver when config doesn't specify one.
    """
    return AgentSettings(
        api_key=config.api_key or "dev-api-key",
        device_id=config.device_id or device_id or "unknown-device",
        org_id=config.org_id or "local-org",
        supabase_url=config.supabase_url or "http://localhost:8000",
        supabase_key=config.supabase_key or "dummy-key",
        poll_interval=config.poll_interval,
        deduplication_window=config.deduplication_window,
        doh_enabled=config.doh_enabled,
        agent_version=config.agent_version,
        registry_update_url=config.registry_update_url,
        config_endpoint=config.config_endpoint,
    )
