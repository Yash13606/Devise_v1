"""Supported Windows pilot entrypoint: consented metadata observation via scoped API.

No clipboard, window titles, command lines, contents, process termination, direct
database access, reverse DNS, or external DNS probing is enabled here.
"""
import argparse
from datetime import datetime, timezone
import hashlib
import json
import logging
import platform
from pathlib import Path
import socket
import time
from uuid import uuid4

from credentials import WindowsCredentialStore, default_state_dir
from event_queue import SecureEventQueue, QueueFull
from reporter import DeviceTransport, QueueDelivery, CredentialRevoked, TransportFailure, validate_api_url

VERSION = "0.2.0-pilot"
CONSENT_VERSION = "metadata-v1"
logger = logging.getLogger(__name__)


class RunLock:
    """Windows file lock supplies live status and prevents competing collectors."""
    def __init__(self, directory):
        import msvcrt
        Path(directory).mkdir(parents=True, exist_ok=True)
        self.stream = (Path(directory) / "run.lock").open("a+b")
        if self.stream.tell() == 0:
            self.stream.write(b"0")
            self.stream.flush()
        self.stream.seek(0)
        try:
            msvcrt.locking(self.stream.fileno(), msvcrt.LK_NBLCK, 1)
        except OSError:
            self.stream.close()
            raise RuntimeError("Agent is already running; stop it with Ctrl+C before forgetting or starting again") from None

    def close(self):
        import msvcrt
        self.stream.seek(0)
        msvcrt.locking(self.stream.fileno(), msvcrt.LK_UNLCK, 1)
        self.stream.close()


def is_running(directory):
    try:
        lock = RunLock(directory)
    except RuntimeError:
        return True
    lock.close()
    return False


def set_paused(store, paused):
    def change(state):
        if not paused and (state.get("consent_version") != CONSENT_VERSION or state.get("revoked")):
            raise ValueError("A valid metadata consent and active device credential are required")
        return {**state, "paused": paused}
    return store.update(change)


def cache_hostnames(records):
    """A shared cache address cannot identify which hostname a connection used."""
    import ipaddress
    names = {}
    for record in records:
        try:
            address = str(ipaddress.ip_address(record.get("Data", "")))
        except ValueError:
            continue
        hostname = record.get("Entry", "").strip().lower().rstrip(".")
        if hostname:
            names.setdefault(address, set()).add(hostname)
    return {address: next(iter(values)) for address, values in names.items() if len(values) == 1}


def os_dns_cache():
    """Read local Windows cache once per cycle; never make a DNS request."""
    import subprocess
    import sys
    if sys.platform != "win32":
        return {}
    try:
        result = subprocess.run(["powershell", "-NoProfile", "-Command", "Get-DnsClientCache | Select-Object Entry,Data | ConvertTo-Json -Compress"], capture_output=True, text=True, timeout=3, creationflags=subprocess.CREATE_NO_WINDOW)
        if result.returncode or len(result.stdout) > 2_000_000:
            logger.warning("Windows DNS cache unavailable or oversized; no hostname observations")
            return {}
        records = json.loads(result.stdout or "[]")
        return cache_hostnames(records if isinstance(records, list) else [records])
    except (OSError, ValueError, subprocess.TimeoutExpired):
        logger.warning("Windows DNS cache unavailable; no hostname observations")
        return {}


class MetadataMonitor:
    """Reuses network detector and evidence-aware registry; only OS cache names."""
    def __init__(self, detector=None, registry=None, hostname_resolver=None):
        from detector import NetworkDetector
        from registry import Registry
        self.detector = detector or NetworkDetector(poll_interval=5)
        self.registry = registry or Registry()
        self.hostname_resolver = hostname_resolver
        self.poll_interval = 5
        self.registry_version = hashlib.sha256(Path(self.registry._get_default_registry_path()).read_bytes()).hexdigest()[:16]

    def observe(self):
        from registry import LookupHint
        import ipaddress
        events = []
        snapshot = os_dns_cache() if self.hostname_resolver is None else {}
        for connection in self.detector.run_detection_cycle():
            # Validate before passing an OS-observed address to the cache query.
            try:
                address = str(ipaddress.ip_address(connection.get("remote_addr", "")))
            except ValueError:
                continue
            hostname = self.hostname_resolver(address) if self.hostname_resolver else snapshot.get(address)
            result = self.registry.lookup(LookupHint(hostname=hostname))
            if not result.is_match:
                continue
            entry = result.entry
            process_name = self.detector.get_process_name(connection["pid"]) if connection.get("pid") else "unknown"
            events.append({"event_id": str(uuid4()), "timestamp": datetime.now(timezone.utc).isoformat(),
                           "tool_name": entry.tool_name, "domain": entry.domain,
                           "category": entry.category, "vendor": entry.vendor,
                           "risk_level": entry.risk_level, "source": "network_metadata",
                           "process_name": (process_name or "unknown")[:255],
                           "evidence_method": "os_dns_cache_hostname", "confidence": result.confidence})
        return events


class PilotAgent:
    def __init__(self, store, queue, transport, monitor, clock=None):
        self.store, self.queue, self.transport, self.monitor = store, queue, transport, monitor
        self.delivery = QueueDelivery(queue, transport)
        state = self._state()
        self.config_version = state.get("config_version", 0)
        self.heartbeat_interval = 30
        self.remote_monitoring = True
        self.clock = clock or time.monotonic
        self.next_observation = self.next_heartbeat = self.next_delivery = 0.0
        self.heartbeat_backoff = self.delivery_backoff = 5
        self.apply_config({"config_version": self.config_version, "config": state.get("config", {})}, persist=False)

    def _state(self):
        state = self.store.read()
        if not state:
            raise ValueError("Agent is not enrolled; enroll first")
        return state

    def start(self, consent=False):
        if not consent:
            raise ValueError("run requires --consent for metadata-only monitoring")
        def change(state):
            if state.get("revoked"):
                raise ValueError("Device credential revoked; forget and enroll again")
            # A new run explicitly consents but preserves a prior operator pause.
            state["consent_version"] = CONSENT_VERSION
            if not state.get("consented_at"):
                state["paused"] = False
            state["consented_at"] = datetime.now(timezone.utc).isoformat()
            return state
        self.store.update(change)

    def pause(self):
        set_paused(self.store, True)

    def resume(self):
        set_paused(self.store, False)

    def apply_config(self, envelope, persist=True):
        version, config = envelope.get("config_version"), envelope.get("config")
        if type(version) is not int or version < 0 or not isinstance(config, dict):
            raise ValueError("Invalid device config envelope")
        intervals = {}
        for key, default in [("poll_interval_seconds", 5), ("heartbeat_interval_seconds", 30)]:
            value = config.get(key, default)
            if type(value) is not int or not 5 <= value <= 3600:
                raise ValueError(f"Invalid {key}")
            intervals[key] = value
        monitoring = config.get("monitoring_enabled", True)
        if type(monitoring) is not bool:
            raise ValueError("Invalid monitoring_enabled")
        batch_size = config.get("batch_size", 100)
        if type(batch_size) is not int or not 1 <= batch_size <= 100:
            raise ValueError("Invalid batch_size")
        # Validate every field and persist first; invalid or busy credential
        # storage must leave all running objects on the previous configuration.
        if persist:
            self.store.update(lambda state: {**state, "config_version": version, "config": config})
        self.monitor.poll_interval = intervals["poll_interval_seconds"]
        if hasattr(self.monitor, "detector"):
            self.monitor.detector._poll_interval = self.monitor.poll_interval
        self.heartbeat_interval = intervals["heartbeat_interval_seconds"]
        self.remote_monitoring = monitoring
        self.delivery.batch_size = batch_size
        self.config_version = version

    def monitoring_enabled(self, state):
        return state.get("consent_version") == CONSENT_VERSION and not state.get("paused", True) and not state.get("revoked", False) and self.remote_monitoring

    def cycle(self):
        """Explicit one-shot observation; background runs use independent deadlines."""
        self.tick(force_observation=True)

    def _deliver(self):
        self.delivery.flush()
        delay = self.delivery_backoff if self.delivery.retryable_failure else 5
        self.next_delivery = self.clock() + delay
        self.delivery_backoff = min(60, delay * 2) if self.delivery.retryable_failure else 5

    def tick(self, force_observation=False):
        """Run due work only. Transport deadlines are measured after each attempt."""
        state = self._state()
        if state.get("revoked"):
            raise CredentialRevoked(401)
        try:
            if self.clock() >= self.next_heartbeat:
                try:
                    result = self.transport.request("POST", "/api/heartbeat", {
                        "agent_version": VERSION, "os_version": platform.platform(),
                        "queue_depth": self.queue.status()["pending"],
                        "monitoring_enabled": self.monitoring_enabled(state),
                        "consent_version": state.get("consent_version"),
                        "registry_version": getattr(self.monitor, "registry_version", "test"),
                        "config_version": self.config_version})
                    old_poll_interval = self.monitor.poll_interval
                    self.apply_config(result)
                    if old_poll_interval != self.monitor.poll_interval:
                        self.next_observation = min(self.next_observation, self.clock() + self.monitor.poll_interval)
                    self.next_heartbeat = self.clock() + self.heartbeat_interval
                    self.heartbeat_backoff = 5
                except CredentialRevoked:
                    raise
                except TransportFailure:
                    self.queue.record_error("network_unavailable")
                    self.next_heartbeat = self.clock() + self.heartbeat_backoff
                    self.heartbeat_backoff = min(60, self.heartbeat_backoff * 2)
            # Flush first so a recovered connection frees bounded queue capacity.
            delivery_due = self.clock() >= self.next_delivery
            if delivery_due:
                self._deliver()
            state = self._state()
            if force_observation or self.clock() >= self.next_observation:
                if self.monitoring_enabled(state):
                    for event in self.monitor.observe():
                        self.queue.enqueue(event)
                self.next_observation = self.clock() + self.monitor.poll_interval
                if delivery_due and not self.delivery.retryable_failure:
                    self._deliver()
        except CredentialRevoked:
            self.store.update(lambda state: {**state, "paused": True, "revoked": True, "last_error": "credential_revoked"})
            raise
        except QueueFull:
            self.pause()
            raise


def _queue(store):
    state = store.read()
    if not state:
        raise ValueError("Agent is not enrolled; enroll first")
    return SecureEventQueue(store.directory / "pilot_queue.db", state["queue_key"].encode())


def main(argv=None):
    parser = argparse.ArgumentParser(description="Devise scoped Windows agent; metadata observation requires --consent")
    parser.add_argument("--state-dir", type=Path, default=default_state_dir())
    parser.add_argument("--verbose", action="store_true")
    commands = parser.add_subparsers(dest="command", required=True)
    enroll = commands.add_parser("enroll")
    enroll.add_argument("--api-url", required=True)
    enroll.add_argument("--token", required=True)
    run = commands.add_parser("run")
    run.add_argument("--consent", action="store_true")
    run.add_argument("--once", action="store_true", help="Run one real observation/delivery cycle and exit")
    for command in ["status", "pause", "resume", "forget"]:
        commands.add_parser(command)
    args = parser.parse_args(argv)
    logging.basicConfig(level=logging.DEBUG if args.verbose else logging.INFO, format="%(levelname)s %(name)s: %(message)s")
    # HTTP debug logging can include authorization headers; keep it disabled.
    logging.getLogger("httpx").setLevel(logging.WARNING)
    logging.getLogger("httpcore").setLevel(logging.WARNING)
    store = WindowsCredentialStore(args.state_dir)
    transport = None
    run_lock = None
    try:
        if args.command == "enroll":
            run_lock = RunLock(store.directory)
            if store.read():
                raise ValueError("Already enrolled; explicitly forget before changing device identity")
            api_url = validate_api_url(args.api_url)
            transport = DeviceTransport(api_url)
            identity = transport.request("POST", "/api/devices/enroll", {"enrollment_token": args.token, "hostname": socket.gethostname(), "os_version": platform.platform(), "agent_version": VERSION})
            if any(not isinstance(identity.get(key), str) or not identity[key] for key in ["device_token", "device_id", "org_id"]):
                raise ValueError("Invalid enrollment response")
            from cryptography.fernet import Fernet
            store.create({**{key: identity[key] for key in ["device_token", "device_id", "org_id"]}, "api_url": api_url, "queue_key": Fernet.generate_key().decode(), "paused": True, "consent_version": None})
            print(json.dumps({"enrolled": True, "device_id": identity["device_id"], "monitoring_enabled": False}))
            return 0
        if args.command == "forget":
            run_lock = RunLock(store.directory)
            # Destroy the DPAPI-protected key and encrypted local event files only.
            store.forget()
            for suffix in ["", "-wal", "-shm", "-journal"]:
                (store.directory / ("pilot_queue.db" + suffix)).unlink(missing_ok=True)
            print(json.dumps({"forgotten": True, "server_revocation_required": True}))
            return 0
        state = store.read()
        if args.command == "status":
            if not state:
                print(json.dumps({"enrolled": False, "monitoring_enabled": False}))
            else:
                queue_status = _queue(store).status()
                running = is_running(store.directory)
                print(json.dumps({"enrolled": True, "running": running, "device_id": state["device_id"], "org_id": state["org_id"], "paused": state.get("paused", True), "revoked": state.get("revoked", False), "consent_version": state.get("consent_version"), "config_version": state.get("config_version", 0), "monitoring_enabled": bool(running and state.get("consent_version") == CONSENT_VERSION and not state.get("paused", True) and not state.get("revoked", False) and state.get("config", {}).get("monitoring_enabled", True)), "queue": queue_status}))
            return 0
        if not state:
            raise ValueError("Agent is not enrolled; enroll first")
        if args.command in {"pause", "resume"}:
            state = set_paused(store, args.command == "pause")
            print(json.dumps({"paused": state["paused"]}))
            return 0
        if not args.consent:
            raise ValueError("run requires --consent for metadata-only monitoring")
        run_lock = RunLock(store.directory)
        state = store.read()
        if not state:
            raise ValueError("Agent is not enrolled; enroll first")
        transport = DeviceTransport(state["api_url"], state["device_token"])
        agent = PilotAgent(store, _queue(store), transport, MetadataMonitor())
        agent.start(consent=True)
        logger.info("Metadata consent active: registry hostnames and process names only. Ctrl+C to stop.")
        while True:
            agent.tick()
            if args.once:
                print(json.dumps({"cycle_complete": True, "queue": agent.queue.status()}))
                return 0
            # Local state is checked each second; network work has its own backoff.
            time.sleep(1)
            if not store.read():
                return 0
    except KeyboardInterrupt:
        print(json.dumps({"stopped": True}))
        return 0
    except (ValueError, RuntimeError, OSError) as error:
        # Error strings never contain response bodies or credentials.
        print(json.dumps({"error": str(error)}))
        return 1
    finally:
        if transport:
            transport.close()
        if run_lock:
            run_lock.close()


if __name__ == "__main__":
    raise SystemExit(main())
