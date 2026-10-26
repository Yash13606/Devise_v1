"""Scoped pilot delivery and privacy regressions (all network uses in-process fakes)."""
import json
import sqlite3
import sys
from pathlib import Path
from uuid import uuid4

import httpx
import pytest
from cryptography.fernet import Fernet

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))


def event():
    return {"event_id": str(uuid4()), "timestamp": "2026-10-25T12:00:00+00:00",
            "tool_name": "ChatGPT", "domain": "chatgpt.com", "category": "assistant",
            "vendor": "OpenAI", "risk_level": "medium", "source": "network_metadata",
            "process_name": "browser.exe", "evidence_method": "os_dns_cache_hostname",
            "confidence": 0.95}


@pytest.mark.skipif(sys.platform != "win32", reason="Windows file handle lifecycle")
def test_queue_releases_windows_file_handles_without_garbage_collection(tmp_path):
    import gc
    from event_queue import SecureEventQueue
    gc.disable()
    path = tmp_path / "close-proof.db"
    try:
        queue = SecureEventQueue(path, Fernet.generate_key())
        queue.enqueue(event())
        assert queue.status()["pending"] == 1
        path.rename(tmp_path / "closed.db")
    finally:
        gc.enable()
        gc.collect()


def test_queue_encrypts_survives_restart_and_refuses_overflow(tmp_path):
    from event_queue import SecureEventQueue, QueueFull
    key = Fernet.generate_key()
    path = tmp_path / "queue.db"
    queue = SecureEventQueue(path, key, capacity=1)
    first = event()
    queue.enqueue(first)
    with pytest.raises(QueueFull):
        queue.enqueue(event())
    assert b"ChatGPT" not in path.read_bytes()
    again = SecureEventQueue(path, key, capacity=1)
    assert again.pending()[0]["event"] == first
    assert again.status()["pending"] == 1


def test_queue_expiry_is_retained_visible_and_cannot_reuse_conflicting_id(tmp_path):
    from event_queue import SecureEventQueue
    clock = [100.0]
    queue = SecureEventQueue(tmp_path / "queue.db", Fernet.generate_key(), ttl=5, clock=lambda: clock[0])
    first = event()
    queue.enqueue(first)
    assert queue.enqueue(first) is False
    with pytest.raises(ValueError, match="conflict"):
        queue.enqueue({**first, "tool_name": "changed"})
    clock[0] = 106
    assert queue.pending() == []
    assert queue.status()["dead_letter"] == 1
    assert queue.status()["last_error"] == "expired"


def test_outage_restart_then_flush_does_not_reenqueue(tmp_path):
    from event_queue import SecureEventQueue
    from reporter import DeviceTransport, QueueDelivery
    key = Fernet.generate_key()
    path = tmp_path / "queue.db"
    queue = SecureEventQueue(path, key)
    original = event()
    queue.enqueue(original)
    def offline(request):
        raise httpx.ConnectError("offline", request=request)
    delivery = QueueDelivery(queue, DeviceTransport("http://127.0.0.1:8000", "device", transport=httpx.MockTransport(offline)))
    assert delivery.flush() == 0
    assert queue.status()["pending"] == 1
    seen = []
    def online(request):
        seen.append(json.loads(request.content))
        assert request.headers["authorization"] == "Bearer device"
        assert "x-organization-id" not in request.headers
        return httpx.Response(200, json={"accepted": 1, "duplicates": 0})
    queue = SecureEventQueue(path, key)
    delivery = QueueDelivery(queue, DeviceTransport("http://127.0.0.1:8000", "device", transport=httpx.MockTransport(online)))
    assert delivery.flush() == 1
    assert delivery.flush() == 0
    assert seen == [{"schema_version": 1, "events": [original]}]
    assert queue.status()["pending"] == 0


@pytest.mark.parametrize("code", [400, 409, 413, 422])
def test_permanent_event_errors_quarantine_without_losing_record(tmp_path, code):
    from event_queue import SecureEventQueue
    from reporter import DeviceTransport, QueueDelivery
    queue = SecureEventQueue(tmp_path / "queue.db", Fernet.generate_key())
    queue.enqueue(event())
    client = DeviceTransport("http://localhost:8000", "device", transport=httpx.MockTransport(lambda _: httpx.Response(code, json={"detail": "invalid"})))
    assert QueueDelivery(queue, client).flush() == 0
    assert queue.status()["dead_letter"] == 1
    assert queue.status()["pending"] == 0


def test_revocation_retains_pending_and_blocks_delivery(tmp_path):
    from event_queue import SecureEventQueue
    from reporter import DeviceTransport, QueueDelivery, CredentialRevoked
    queue = SecureEventQueue(tmp_path / "queue.db", Fernet.generate_key())
    queue.enqueue(event())
    client = DeviceTransport("http://localhost:8000", "secret", transport=httpx.MockTransport(lambda _: httpx.Response(401)))
    with pytest.raises(CredentialRevoked):
        QueueDelivery(queue, client).flush()
    assert queue.status()["pending"] == 1


def test_transport_rejects_insecure_remote_and_never_redirects():
    from reporter import DeviceTransport, TransportFailure
    for url in ["http://example.com", "http://127.0.0.1.evil.test", "https://user:pass@example.com", "https://example.com/api", "ftp://localhost"]:
        with pytest.raises(ValueError):
            DeviceTransport(url, "secret")
    calls = []
    def redirect(request):
        calls.append(str(request.url))
        return httpx.Response(307, headers={"location": "https://evil.test"})
    client = DeviceTransport("https://example.com", "secret", transport=httpx.MockTransport(redirect))
    with pytest.raises(TransportFailure):
        client.request("GET", "/api/device/config")
    assert calls == ["https://example.com/api/device/config"]


class MemoryStore:
    def __init__(self):
        self.value = None
    def read(self):
        return self.value.copy() if self.value else None
    def write(self, value):
        self.value = value.copy()
    def update(self, transform):
        self.write(transform(self.read()))
        return self.read()
    def forget(self):
        self.value = None


def test_consent_pause_resume_and_config_apply_to_running_monitor(tmp_path):
    from pilot_agent import PilotAgent
    from event_queue import SecureEventQueue
    from reporter import DeviceTransport
    store = MemoryStore()
    store.write({"device_id": "id", "org_id": "org", "device_token": "secret", "api_url": "http://localhost:8000", "paused": True, "consent_version": None})
    queue = SecureEventQueue(tmp_path / "queue.db", Fernet.generate_key())
    class Monitor:
        poll_interval = 5
        count = 0
        def observe(self):
            self.count += 1
            return [event()]
    monitor = Monitor()
    heartbeats = []
    def handler(request):
        if request.url.path == "/api/heartbeat":
            heartbeats.append(json.loads(request.content))
            return httpx.Response(200, json={"config_version": 3, "config": {"poll_interval_seconds": 8, "heartbeat_interval_seconds": 15, "monitoring_enabled": True, "terminate_processes": True}})
        return httpx.Response(200, json={"accepted": 1, "duplicates": 0})
    transport = DeviceTransport("http://localhost:8000", "secret", transport=httpx.MockTransport(handler))
    app = PilotAgent(store, queue, transport, monitor)
    with pytest.raises(ValueError, match="consent"):
        app.start(consent=False)
    app.start(consent=True)
    app.cycle()
    assert monitor.count == 1
    assert monitor.poll_interval == 8
    assert app.heartbeat_interval == 15
    assert heartbeats[-1]["monitoring_enabled"] is True
    assert heartbeats[-1]["consent_version"] == "metadata-v1"
    app.pause()
    app.cycle()
    assert monitor.count == 1
    app.resume()
    app.cycle()
    assert monitor.count == 2
    assert app.config_version == 3


def test_config_accepts_server_limits_and_applies_all_fields_atomically(tmp_path):
    from types import SimpleNamespace
    from pilot_agent import PilotAgent
    from event_queue import SecureEventQueue
    from reporter import DeviceTransport
    store = MemoryStore()
    store.write({"device_id": "id", "paused": True})
    monitor = SimpleNamespace(poll_interval=5)
    transport = DeviceTransport("http://127.0.0.1:8000", transport=httpx.MockTransport(lambda _: httpx.Response(500)))
    agent = PilotAgent(store, SecureEventQueue(tmp_path / "queue.db", Fernet.generate_key()), transport, monitor)
    try:
        agent.apply_config({"config_version": 1, "config": {"poll_interval_seconds": 3600, "heartbeat_interval_seconds": 3600}})
        assert (monitor.poll_interval, agent.heartbeat_interval) == (3600, 3600)
        before = (monitor.poll_interval, agent.heartbeat_interval, agent.config_version, store.read())
        with pytest.raises(ValueError):
            agent.apply_config({"config_version": 2, "config": {"poll_interval_seconds": 10, "heartbeat_interval_seconds": 4000}})
        assert (monitor.poll_interval, agent.heartbeat_interval, agent.config_version, store.read()) == before
    finally:
        transport.close()


def test_metadata_adapter_discards_sensitive_fields_and_requires_hostname(tmp_path):
    from pilot_agent import MetadataMonitor
    from registry import Registry
    registry = Registry()
    class Detector:
        def run_detection_cycle(self):
            return [{"remote_addr": "1.2.3.4", "pid": 10, "process_path": "private", "clipboard": "secret", "window_title": "private"}]
        def get_process_name(self, pid):
            return "browser.exe"
    monitor = MetadataMonitor(Detector(), registry, hostname_resolver=lambda _: "chatgpt.com")
    values = monitor.observe()
    assert len(values) == 1
    assert set(values[0]) == set(event())
    assert values[0]["evidence_method"] == "os_dns_cache_hostname"
    monitor.hostname_resolver = lambda _: None
    assert monitor.observe() == []


@pytest.mark.skipif(sys.platform != "win32", reason="Windows DPAPI")
def test_windows_credentials_are_encrypted_and_forget_removes_them(tmp_path):
    from credentials import WindowsCredentialStore
    store = WindowsCredentialStore(tmp_path)
    store.write({"device_token": "highly-secret", "queue_key": Fernet.generate_key().decode()})
    assert b"highly-secret" not in store.path.read_bytes()
    assert WindowsCredentialStore(tmp_path).read()["device_token"] == "highly-secret"
    store.forget()
    assert store.read() is None


def test_invalid_ack_keeps_original_event_and_revocation_pauses_observation(tmp_path):
    from event_queue import SecureEventQueue
    from reporter import DeviceTransport, QueueDelivery, CredentialRevoked
    from pilot_agent import PilotAgent, CONSENT_VERSION
    queue = SecureEventQueue(tmp_path / "queue.db", Fernet.generate_key())
    queue.enqueue(event())
    client = DeviceTransport("http://localhost:8000", "secret", transport=httpx.MockTransport(lambda _: httpx.Response(200, json={"accepted": 0, "duplicates": 0})))
    assert QueueDelivery(queue, client).flush() == 0
    assert queue.status()["pending"] == 1
    store = MemoryStore()
    store.write({"device_id": "id", "consent_version": CONSENT_VERSION, "paused": False})
    class NeverMonitor:
        poll_interval = 5
        def observe(self):
            pytest.fail("Revoked credential must stop observation")
    client = DeviceTransport("http://localhost:8000", "secret", transport=httpx.MockTransport(lambda _: httpx.Response(403)))
    agent = PilotAgent(store, queue, client, NeverMonitor())
    with pytest.raises(CredentialRevoked):
        agent.cycle()
    assert store.read()["paused"] is True
    assert store.read()["revoked"] is True


def test_main_entrypoint_routes_only_to_supported_pilot():
    import main
    from pilot_agent import main as supported_main
    assert main.main is supported_main
    assert not hasattr(main, "DeviseAgent")


def test_queue_corrupt_ciphertext_fails_visibly(tmp_path):
    from event_queue import SecureEventQueue
    from cryptography.fernet import InvalidToken
    path = tmp_path / "queue.db"
    queue = SecureEventQueue(path, Fernet.generate_key())
    queue.enqueue(event())
    with sqlite3.connect(path) as conn:
        conn.execute("UPDATE pilot_events SET payload=?", (b"corrupt",))
    with pytest.raises(InvalidToken):
        queue.pending()
    assert queue.status()["pending"] == 1


def test_os_dns_cache_refuses_ambiguous_shared_ip():
    from pilot_agent import cache_hostnames
    records = [{"Entry": "chatgpt.com", "Data": "1.2.3.4"},
               {"Entry": "unrelated.example", "Data": "1.2.3.4"},
               {"Entry": "api.openai.com", "Data": "2.3.4.5"}]
    assert cache_hostnames(records) == {"2.3.4.5": "api.openai.com"}


def test_batch_size_config_is_applied(tmp_path):
    from pilot_agent import PilotAgent
    from event_queue import SecureEventQueue
    from reporter import DeviceTransport
    store = MemoryStore()
    store.write({"device_id": "id", "paused": True})
    class Monitor:
        poll_interval = 5
    queue = SecureEventQueue(tmp_path / "queue.db", Fernet.generate_key())
    calls = []
    def handler(request):
        values = json.loads(request.content)
        calls.append(values)
        return httpx.Response(200, json={"accepted": len(values["events"]), "duplicates": 0})
    client = DeviceTransport("http://localhost:8000", "secret", transport=httpx.MockTransport(handler))
    agent = PilotAgent(store, queue, client, Monitor())
    agent.apply_config({"config_version": 1, "config": {"batch_size": 1}})
    queue.enqueue(event())
    queue.enqueue(event())
    assert agent.delivery.flush() == 1
    assert queue.status()["pending"] == 1
    assert len(calls[0]["events"]) == 1


@pytest.mark.skipif(sys.platform != "win32", reason="Windows pilot lifecycle")
def test_cli_enroll_consent_status_and_forget(tmp_path, monkeypatch, capsys):
    import pilot_agent
    from reporter import DeviceTransport
    requests = []
    def handler(request):
        requests.append(request)
        assert request.url.path == "/api/devices/enroll"
        assert "authorization" not in request.headers
        return httpx.Response(200, json={"device_token": "device-secret", "device_id": str(uuid4()), "org_id": str(uuid4())})
    monkeypatch.setattr(pilot_agent, "DeviceTransport", lambda url, token=None: DeviceTransport(url, token, transport=httpx.MockTransport(handler)))
    prefix = ["--state-dir", str(tmp_path)]
    assert pilot_agent.main(prefix + ["enroll", "--api-url", "http://127.0.0.1:8000", "--token", "enrollment-secret"]) == 0
    assert "device-secret" not in capsys.readouterr().out
    assert pilot_agent.main(prefix + ["run", "--once"]) == 1
    assert "consent" in capsys.readouterr().out
    assert pilot_agent.main(prefix + ["status"]) == 0
    status = json.loads(capsys.readouterr().out)
    assert status["enrolled"] is True
    assert status["running"] is False
    assert status["monitoring_enabled"] is False
    assert pilot_agent.main(prefix + ["forget"]) == 0
    capsys.readouterr()
    assert pilot_agent.main(prefix + ["status"]) == 0
    assert json.loads(capsys.readouterr().out)["enrolled"] is False
    assert len(requests) == 1


@pytest.mark.skipif(sys.platform != "win32", reason="Windows DPAPI and cross-process lifecycle")
def test_successful_cli_pause_survives_concurrent_heartbeat_persistence(tmp_path):
    import subprocess
    import threading
    from concurrent.futures import ThreadPoolExecutor
    from credentials import WindowsCredentialStore
    from event_queue import SecureEventQueue
    from pilot_agent import PilotAgent, CONSENT_VERSION
    from reporter import DeviceTransport
    at_persist, release_persist = threading.Event(), threading.Event()
    class CoordinatedStore(WindowsCredentialStore):
        def boundary(self):
            if threading.current_thread().name.startswith("heartbeat"):
                at_persist.set()
                assert release_persist.wait(10), "operator pause did not finish"
        def write(self, value):
            self.boundary()
            return super().write(value)
        def update(self, transform):
            self.boundary()
            return super().update(transform)
    store = CoordinatedStore(tmp_path)
    store.write({"device_id": "id", "org_id": "org", "paused": False,
                 "consent_version": CONSENT_VERSION, "consented_at": "earlier"})
    class Monitor:
        poll_interval = 5
        count = 0
        def observe(self):
            self.count += 1
            return []
    monitor = Monitor()
    transport = DeviceTransport("http://localhost:8000", "token", transport=httpx.MockTransport(lambda _: httpx.Response(200, json={"config_version": 1, "config": {"monitoring_enabled": True}})))
    agent = PilotAgent(store, SecureEventQueue(tmp_path / "queue.db", Fernet.generate_key()), transport, monitor)
    with ThreadPoolExecutor(max_workers=1, thread_name_prefix="heartbeat") as pool:
        pending = pool.submit(agent.apply_config, {"config_version": 1, "config": {"monitoring_enabled": True}})
        try:
            assert at_persist.wait(10), "heartbeat did not reach persistence"
            paused = subprocess.run([sys.executable, str(Path(__file__).resolve().parents[1] / "pilot_agent.py"), "--state-dir", str(tmp_path), "pause"], capture_output=True, text=True, timeout=10)
            assert paused.returncode == 0, paused.stdout + paused.stderr
            assert WindowsCredentialStore(tmp_path).read()["paused"] is True
        finally:
            release_persist.set()
        pending.result(timeout=10)
    assert store.read()["paused"] is True, "heartbeat overwrote an acknowledged pause"
    assert store.read()["config_version"] == 1
    agent.cycle()
    assert monitor.count == 0


@pytest.mark.skipif(sys.platform != "win32", reason="Windows DPAPI and cross-process state lock")
def test_dpapi_state_updates_serialize_across_processes(tmp_path):
    import subprocess
    from credentials import WindowsCredentialStore
    store = WindowsCredentialStore(tmp_path)
    store.write({"count": 0, "paused": True, "revoked": True, "consent_version": "metadata-v1"})
    script = """import sys,time
from credentials import WindowsCredentialStore
store=WindowsCredentialStore(sys.argv[1])
def increment(state):
    old=state['count']
    time.sleep(0.01)
    state['count']=old+1
    return state
for _ in range(8):
    store.update(increment)
"""
    children = [subprocess.Popen([sys.executable, "-c", script, str(tmp_path)], cwd=Path(__file__).resolve().parents[1], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True) for _ in range(3)]
    for child in children:
        output, error = child.communicate(timeout=20)
        assert child.returncode == 0, output + error
    assert store.read() == {"count": 24, "paused": True, "revoked": True, "consent_version": "metadata-v1"}
    assert list(tmp_path.glob("*.tmp")) == []


def scheduled_agent(tmp_path, handler):
    from pilot_agent import PilotAgent, CONSENT_VERSION
    from event_queue import SecureEventQueue
    from reporter import DeviceTransport
    store = MemoryStore()
    store.write({"paused": False, "consent_version": CONSENT_VERSION,
                 "config": {"poll_interval_seconds": 3600, "heartbeat_interval_seconds": 30}})
    class Monitor:
        count = 0
        def observe(self):
            self.count += 1
            return [event()]
    clock = [0.0]
    transport = DeviceTransport("http://localhost:8000", "secret", transport=httpx.MockTransport(handler))
    agent = PilotAgent(store, SecureEventQueue(tmp_path / "queue.db", Fernet.generate_key()), transport, Monitor(), clock=lambda: clock[0])
    return agent, clock


def test_scheduler_heartbeat_does_not_trigger_slow_observation(tmp_path):
    calls = []
    def handler(request):
        calls.append((clock[0], request.url.path))
        return httpx.Response(200, json={"config_version": 1, "config": {"poll_interval_seconds": 3600, "heartbeat_interval_seconds": 30}} if request.url.path.endswith("heartbeat") else {"accepted": 1, "duplicates": 0})
    agent, clock = scheduled_agent(tmp_path, handler)
    for second in range(122):
        clock[0] = second
        agent.tick()
    assert [t for t, path in calls if path.endswith("heartbeat")] == [0, 30, 60, 90, 120]
    assert agent.monitor.count == 1
    agent.pause()
    clock[0] = 3600
    agent.tick()
    assert agent.monitor.count == 1
    agent.resume()
    clock[0] = 7200
    agent.tick()
    assert agent.monitor.count == 2
    agent.store.update(lambda state: {**state, "revoked": True})
    from reporter import CredentialRevoked
    with pytest.raises(CredentialRevoked):
        agent.tick()
    assert agent.monitor.count == 2


def test_scheduler_outage_backoff_and_recovery_independent_of_observation(tmp_path):
    calls = []
    def handler(request):
        calls.append((clock[0], request.url.path))
        if clock[0] < 100:
            raise httpx.ConnectError("offline", request=request)
        return httpx.Response(200, json={"config_version": 1, "config": {"poll_interval_seconds": 3600, "heartbeat_interval_seconds": 30}} if request.url.path.endswith("heartbeat") else {"accepted": 1, "duplicates": 0})
    agent, clock = scheduled_agent(tmp_path, handler)
    for second in range(137):
        clock[0] = second
        agent.tick()
    for path in ["/api/heartbeat", "/api/events/batch"]:
        attempts = [t for t, p in calls if p == path]
        assert attempts == [0, 5, 15, 35, 75, 135]
    assert agent.monitor.count == 1
    assert agent.queue.status()["pending"] == 0


def test_scheduler_remote_revocation_stops_before_next_observation(tmp_path):
    from reporter import CredentialRevoked
    def handler(request):
        if clock[0] >= 30:
            return httpx.Response(401)
        return httpx.Response(200, json={"config_version": 1, "config": {"poll_interval_seconds": 3600, "heartbeat_interval_seconds": 30}} if request.url.path.endswith("heartbeat") else {"accepted": 1, "duplicates": 0})
    agent, clock = scheduled_agent(tmp_path, handler)
    agent.tick()
    clock[0] = 30
    with pytest.raises(CredentialRevoked):
        agent.tick()
    assert agent.store.read()["paused"] and agent.store.read()["revoked"]
    assert agent.monitor.count == 1


@pytest.mark.parametrize("once", [True, False])
def test_main_runs_due_scheduler_and_preserves_once(tmp_path, monkeypatch, capsys, once):
    import pilot_agent
    from types import SimpleNamespace
    from event_queue import SecureEventQueue
    from reporter import DeviceTransport
    clock, heartbeats = [0.0], []
    store = MemoryStore()
    store.directory = tmp_path
    store.write({"api_url": "http://localhost:8000", "device_token": "synthetic"})
    queue = SecureEventQueue(tmp_path / "queue.db", Fernet.generate_key())
    class Monitor:
        count = 0
        def observe(self):
            self.count += 1
            return [event()]
    monitor = Monitor()
    def handler(request):
        if request.url.path.endswith("heartbeat"):
            heartbeats.append(clock[0])
            return httpx.Response(200, json={"config_version": 1, "config": {"poll_interval_seconds": 3600, "heartbeat_interval_seconds": 30}})
        return httpx.Response(200, json={"accepted": 1, "duplicates": 0})
    def sleep(seconds):
        clock[0] += seconds
        if clock[0] >= 122:
            raise KeyboardInterrupt
    monkeypatch.setattr(pilot_agent, "time", SimpleNamespace(monotonic=lambda: clock[0], sleep=sleep))
    monkeypatch.setattr(pilot_agent, "WindowsCredentialStore", lambda _: store)
    monkeypatch.setattr(pilot_agent, "RunLock", lambda _: SimpleNamespace(close=lambda: None))
    monkeypatch.setattr(pilot_agent, "_queue", lambda _: queue)
    monkeypatch.setattr(pilot_agent, "MetadataMonitor", lambda: monitor)
    monkeypatch.setattr(pilot_agent, "DeviceTransport", lambda *args: DeviceTransport(*args, transport=httpx.MockTransport(handler)))
    assert pilot_agent.main(["--state-dir", str(tmp_path), "run", "--consent"] + (["--once"] if once else [])) == 0
    assert heartbeats == ([0] if once else [0, 30, 60, 90, 120])
    assert monitor.count == 1
    assert queue.status()["pending"] == 0
    assert json.loads(capsys.readouterr().out).get("cycle_complete" if once else "stopped") is True
