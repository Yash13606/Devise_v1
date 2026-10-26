"""Real loopback HTTP/PostgreSQL/Windows proof with isolated synthetic input tenants.

Requires npm run dev:local. Creates and cleans only this run's fresh UUID tenants.
Does not contact cloud providers or purchase/provision external accounts.
"""
from __future__ import annotations
import argparse
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path
import socket
import subprocess
import sys
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from threading import Thread
from uuid import uuid4

import httpx
import psycopg
from psycopg import sql
from psycopg.conninfo import conninfo_to_dict

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "devise-agent/devise-eye"))
from credentials import WindowsCredentialStore
from event_queue import SecureEventQueue
from reporter import DeviceTransport, QueueDelivery, CredentialRevoked


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--outage-seconds", type=int, default=300)
    args = parser.parse_args()
    if not 0 <= args.outage_seconds <= 600:
        raise ValueError("Outage proof must be between zero and 600 seconds")
    config = json.loads((ROOT / ".local/database.json").read_text())
    admin = conninfo_to_dict(config["admin_dsn"])
    if admin.get("host") != "127.0.0.1" or admin.get("dbname") != "devise_local" or int(admin.get("port", 0)) != config["port"]:
        raise ValueError("Verification requires the generated loopback development database")
    run_id = str(uuid4())
    orgs = [str(uuid4()), str(uuid4())]
    subjects = ["local|admin", "local|other"]
    emails = ["admin@local.devise.test", "other@local.devise.test"]
    state_dir = ROOT / ".local/proof-runs" / run_id
    report = {"run_id": run_id, "started_at": datetime.now(timezone.utc).isoformat(),
              "input_kind": "explicit synthetic local verification", "checks": [], "cloud_verified": False, "status": "failed"}
    client = httpx.Client(base_url="http://127.0.0.1:8000", timeout=20, trust_env=False, follow_redirects=False)
    transport = None
    collector = None
    collector_log = None
    created = False
    gate = {"online": True}
    class NetworkGate(BaseHTTPRequestHandler):
        def log_message(self, *_args):
            pass
        def forward(self):
            if not gate["online"]:
                # A real TCP reset, not an HTTP client mock. The same enrolled
                # API origin becomes reachable again after the outage.
                self.connection.shutdown(socket.SHUT_RDWR)
                self.connection.close()
                return
            size = int(self.headers.get("Content-Length", "0"))
            if size > 512 * 1024:
                self.send_error(413)
                return
            headers = {key: self.headers[key] for key in ["Authorization", "Content-Type", "X-Organization-ID"] if key in self.headers}
            response = httpx.request(self.command, "http://127.0.0.1:8000" + self.path, headers=headers,
                                     content=self.rfile.read(size) if size else None, timeout=20, trust_env=False)
            self.send_response(response.status_code)
            self.send_header("Content-Type", response.headers.get("content-type", "application/json"))
            self.send_header("Content-Length", str(len(response.content)))
            self.end_headers()
            self.wfile.write(response.content)
        do_GET = do_POST = do_PATCH = do_DELETE = forward
    network_gate = ThreadingHTTPServer(("127.0.0.1", 0), NetworkGate)
    Thread(target=network_gate.serve_forever, daemon=True).start()
    device_api = f"http://127.0.0.1:{network_gate.server_port}"

    def check(name, condition):
        if not condition:
            raise AssertionError(name)
        report["checks"].append(name)
        print("PASS " + name, flush=True)

    def request(method, path, headers=None, body=None, expected=200):
        response = client.request(method, path, headers=headers, json=body)
        if response.status_code != expected:
            raise AssertionError(f"{method} {path}: expected HTTP{expected}, got HTTP{response.status_code}")
        return response.json() if response.content else None

    def cli(*arguments, expected=0):
        result = subprocess.run([sys.executable, str(ROOT / "devise-agent/devise-eye/pilot_agent.py"),
                                 "--state-dir", str(state_dir), *arguments], cwd=ROOT, capture_output=True, text=True, timeout=30)
        if result.returncode != expected:
            raise AssertionError("Agent command failed: " + arguments[0])
        return json.loads(result.stdout.strip().splitlines()[-1])

    def login(email, org):
        session = request("POST", "/api/local/session", body={"email": email})
        headers = {"Authorization": "Bearer " + session["access_token"]}
        profile = request("GET", "/api/me", headers)
        if org not in {item["org_id"] for item in profile["memberships"]}:
            raise AssertionError("Verification membership was not resolved by the server")
        return {**headers, "X-Organization-ID": org}

    def fixture_state():
        response = httpx.get("http://127.0.0.1:9010/state", timeout=5, trust_env=False)
        response.raise_for_status()
        return response.json()

    def stop_collector():
        if collector is not None and collector.poll() is None:
            if sys.platform == "win32":
                subprocess.run(["taskkill", "/PID", str(collector.pid), "/T", "/F"], capture_output=True, timeout=15)
            else:
                collector.terminate()
            collector.wait(timeout=15)

    def execute(text):
        return request("POST", "/api/mcp/execute", human, {"request_id": str(uuid4()), "rpc": {
            "jsonrpc": "2.0", "id": str(uuid4()), "method": "tools/call", "params": {"name": "echo", "arguments": {"text": text}}}})

    try:
        health = request("GET", "/health")
        check("real database and explicit local authentication ready", health.get("database") == "ready" and health.get("auth_mode") == "local")
        fixture_health = httpx.get("http://127.0.0.1:9010/health", timeout=5, trust_env=False).json()
        check("controlled loopback fixture ready", fixture_health.get("fixture") is True)
        with psycopg.connect(config["admin_dsn"]) as conn:
            for org, subject, email in zip(orgs, subjects, emails):
                conn.execute("INSERT INTO organizations(id,name) VALUES(%s,'Synthetic local verification')", (org,))
                if not conn.execute("SELECT 1 FROM users WHERE subject=%s AND email=%s", (subject, email)).fetchone():
                    raise ValueError("Run local setup to create the explicit development identities first")
                conn.execute("INSERT INTO memberships(org_id,subject,role) VALUES(%s,%s,'admin')", (org, subject))
        created = True
        human, other = [login(email, org) for email, org in zip(emails, orgs)]
        request("GET", "/api/events", {**human, "X-Organization-ID": other["X-Organization-ID"]}, expected=403)
        check("foreign organization access denied over real HTTP", True)
        enrollment = request("POST", "/api/enrollments", human, {"name": "Local verification device"})
        check("Windows CLI exchanges single-use enrollment", cli("enroll", "--api-url", device_api, "--token", enrollment["enrollment_token"])["enrolled"])
        request("POST", "/api/devices/enroll", body={"enrollment_token": enrollment["enrollment_token"],
                "hostname": "replay", "os_version": "Windows", "agent_version": "proof"}, expected=401)
        cli("run", "--consent", "--once")
        check("real metadata monitor completes a consented Windows cycle", cli("status")["consent_version"] == "metadata-v1")
        cli("pause")
        check("pause persists across an independent CLI process", cli("status")["paused"] is True)
        cli("resume")
        store = WindowsCredentialStore(state_dir)
        state = store.read()
        queue = SecureEventQueue(state_dir / "pilot_queue.db", state["queue_key"].encode())
        event = {"event_id": str(uuid4()), "timestamp": datetime.now(timezone.utc).isoformat(), "tool_name": "Local verification fixture",
                 "domain": "fixture.devise.test", "category": "verification", "vendor": "Local fixture", "risk_level": "low",
                 "source": "synthetic_local_verification", "process_name": "verify_local.py", "evidence_method": "controlled_fixture", "confidence": 1.0}
        queue.enqueue(event)
        gate["online"] = False
        offline = DeviceTransport(state["api_url"], state["device_token"])
        try:
            check("real TCP failure retains the encrypted event", QueueDelivery(queue, offline).flush() == 0 and queue.status()["pending"] >= 1)
        finally:
            offline.close()
        offline_started = time.monotonic()
        cli("run", "--consent", "--once")
        check("actual Windows collector tolerates offline heartbeat and keeps its queue", cli("status")["queue"]["pending"] >= 1)
        collector_log = (state_dir / "collector.log").open("w", encoding="utf-8")
        collector = subprocess.Popen([sys.executable, str(ROOT / "devise-agent/devise-eye/pilot_agent.py"),
            "--state-dir", str(state_dir), "run", "--consent"], cwd=ROOT, stdout=collector_log, stderr=collector_log)
        check("queue and credentials reopen in a new Windows process", cli("status")["queue"]["pending"] >= 1)
        baseline = fixture_state()["executions"]
        request("POST", "/api/policies", human, {"name": "Explicit verification allow", "outcome": "allow"})
        rpc = {"jsonrpc": "2.0", "id": str(uuid4()), "method": "tools/call", "params": {"name": "echo", "arguments": {"text": "synthetic gateway proof"}}}
        gateway_headers = {**human, "X-Request-ID": str(uuid4()), "Accept": "application/json, text/event-stream"}
        gateway = httpx.post("http://127.0.0.1:3001/mcp", headers=gateway_headers, json=rpc, timeout=20, trust_env=False)
        check("Node gateway returns actual upstream execution", gateway.status_code == 200 and gateway.json()["result"]["content"][0]["text"] == "synthetic gateway proof")
        again = httpx.post("http://127.0.0.1:3001/mcp", headers=gateway_headers, json=rpc, timeout=20, trust_env=False)
        check("same gateway request retries do not execute twice", again.status_code == 200 and fixture_state()["executions"] == baseline + 1)
        notification = httpx.post("http://127.0.0.1:3001/mcp", headers={**human, "Accept": "application/json, text/event-stream"},
            json={"jsonrpc": "2.0", "method": "notifications/initialized"}, timeout=20, trust_env=False)
        check("MCP notification receives empty HTTP202", notification.status_code == 202 and not notification.content)
        request("POST", "/api/policies", human, {"name": "Block fixture", "outcome": "block", "text_pattern": "BLOCKME"})
        check("blocked request never executes upstream", execute("BLOCKME")["status"] == "blocked" and fixture_state()["executions"] == baseline + 1)
        request("POST", "/api/policies", human, {"name": "Unicode redaction fixture", "outcome": "redact", "text_pattern": "STRASSE", "replacement": "[removed]"})
        check("actual upstream receives redacted Unicode text", execute("Before Stra\u00dfe after")["status"] == "succeeded" and fixture_state()["last_text"] == "Before [removed] after")
        request("POST", "/api/policies", human, {"name": "Warning fixture", "outcome": "warn", "text_pattern": "WARNME"})
        warned = execute("WARNME")
        count = fixture_state()["executions"]
        check("warning waits for explicit continuation", warned["status"] == "pending_warning")
        check("warning executes once after acknowledgement", request("POST", "/api/mcp/continue", human, {"continuation_token": warned["continuation_token"]})["status"] == "succeeded" and fixture_state()["executions"] == count + 1)
        request("POST", "/api/mcp/continue", human, {"continuation_token": warned["continuation_token"]}, expected=409)
        request("POST", "/api/policies", human, {"name": "Review fixture", "outcome": "review", "text_pattern": "REVIEWME"})
        reviewed = execute("REVIEWME")
        count = fixture_state()["executions"]
        request("POST", f"/api/reviews/{reviewed['review_id']}/approve", other, expected=404)
        check("authorized review executes once", request("POST", f"/api/reviews/{reviewed['review_id']}/approve", human)["status"] == "succeeded" and fixture_state()["executions"] == count + 1)
        request("POST", f"/api/reviews/{reviewed['review_id']}/approve", human, expected=409)
        request("POST", "/api/policies", human, {"name": "Email class fixture", "outcome": "redact", "data_class": "email"})
        check("data-class inspection redacts actual upstream text", execute("Send to person@example.test please")["status"] == "succeeded" and fixture_state()["last_text"] == "Send to [REDACTED] please")
        request("POST", "/api/policies", human, {"name": "Credential class fixture", "outcome": "block", "data_class": "credentials"})
        count = fixture_state()["executions"]
        check("credential pattern blocks before upstream execution", execute("api_key='synthetic-super-secret-123'")["status"] == "blocked" and fixture_state()["executions"] == count)
        csv = "source_id,kind,vendor,amount_minor,currency,period_start,period_end,source\nproof1,invoice,Local fixture,1234,USD,2026-10-01,2026-10-31,synthetic verification\nproof2,subscription,Local fixture,2500,USD,2026-10-01,2026-10-31,synthetic verification\nproof3,invoice,Local fixture,50000,INR,2026-10-01,2026-10-31,synthetic verification\n"
        check("CSV imports persist measured source records", request("POST", "/api/spend/import/csv", human, {"csv": csv}) == {"accepted": 3, "duplicates": 0})
        check("CSV retry is idempotent", request("POST", "/api/spend/import/csv", human, {"csv": csv}) == {"accepted": 0, "duplicates": 3})
        totals = request("GET", "/api/spend", human)["totals"]
        check("amounts remain separated by currency and period", {row["currency"]: row["amount_minor"] for row in totals} == {"USD": 3734, "INR": 50000})
        check("spend remains invisible to another tenant", request("GET", "/api/spend", other)["records"] == [])
        settings = request("GET", "/api/settings", human)
        request("PATCH", "/api/settings", human, {**settings, "poll_interval_seconds": 7})
        # Keep the offline record undelivered; only status opens the persisted queue.
        print(f"Waiting for {args.outage_seconds}-second outage proof; other checks completed.", flush=True)
        while time.monotonic() - offline_started < args.outage_seconds:
            time.sleep(max(0, min(1, args.outage_seconds - (time.monotonic() - offline_started))))
        check("encrypted queue survives the requested outage duration", cli("status")["queue"]["pending"] >= 1)
        transport = DeviceTransport(state["api_url"], state["device_token"])
        queue = SecureEventQueue(state_dir / "pilot_queue.db", state["queue_key"].encode())
        outage_elapsed = time.monotonic() - offline_started
        gate["online"] = True
        began = time.monotonic()
        deadline = began + 75
        while True:
            events = request("GET", "/api/events", human)["events"]
            if event["event_id"] in {item["event_id"] for item in events}:
                break
            if collector.poll() is not None or time.monotonic() >= deadline:
                raise AssertionError("Continuous collector did not recover its durable event")
            time.sleep(1)
        delivery_seconds = time.monotonic() - began
        check("continuous collector reconnects and delivers without manual flushing", delivery_seconds <= 75)
        stop_collector()
        retry = transport.request("POST", "/api/events/batch", {"schema_version": 1, "events": [event]})
        check("durable ingestion acknowledges identical retry without duplicate", retry == {"accepted": 0, "duplicates": 1})
        cli("run", "--consent", "--once")
        check("remote configuration reaches running agent objects", store.read()["config"]["poll_interval_seconds"] == 7)
        exported = request("GET", "/api/export", human)
        check("metadata export excludes device credentials", state["device_token"] not in json.dumps(exported) and "token_hash" not in json.dumps(exported))
        previous = "0" * 64
        for entry in exported["audit"]:
            payload = {key: entry[key] for key in ["sequence", "kind", "metadata", "created_at"]}
            digest = hashlib.sha256((previous + json.dumps(payload, sort_keys=True, separators=(",", ":"))).encode()).hexdigest()
            check_hash = entry["previous_hash"] == previous and entry["entry_hash"] == digest
            if not check_hash:
                raise AssertionError("Audit hash chain mismatch")
            previous = digest
        check("exported tenant audit hash chain verifies", True)
        request("POST", f"/api/devices/{state['device_id']}/revoke", human)
        cli("run", "--consent", "--once", expected=1)
        check("revocation stops real agent before observation", store.read()["revoked"] is True and store.read()["paused"] is True)
        check("local forget removes protected identity and queue", cli("forget")["forgotten"] and not (state_dir / "credentials.dpapi").exists() and not (state_dir / "pilot_queue.db").exists())
        report["outage_seconds"] = outage_elapsed
        report["online_delivery_seconds"] = delivery_seconds
        report["status"] = "passed"
    finally:
        stop_collector()
        if collector_log:
            collector_log.close()
        if transport:
            transport.close()
        network_gate.shutdown()
        network_gate.server_close()
        client.close()
        if created:
            # Only fresh UUID tenants and subjects created by this invocation.
            with psycopg.connect(config["admin_dsn"]) as conn:
                for table in ["retention_previews", "spend_records", "audit_entries", "executions", "policies", "policy_versions", "events", "devices", "enrollments", "memberships"]:
                    conn.execute(sql.SQL("DELETE FROM {} WHERE org_id=ANY(%s::uuid[])").format(sql.Identifier(table)), (orgs,))
                conn.execute("DELETE FROM organizations WHERE id=ANY(%s::uuid[])", (orgs,))
        report["finished_at"] = datetime.now(timezone.utc).isoformat()
        report["fixture_tenants_cleaned"] = created
        output = ROOT / ".local/reports/local-flow.json"
        output.write_text(json.dumps(report, indent=2), encoding="utf-8")
        print("Report: .local/reports/local-flow.json", flush=True)


if __name__ == "__main__":
    main()
