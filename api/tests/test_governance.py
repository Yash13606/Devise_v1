"""Real HTTP fixture + real PostgreSQL execution/review proof."""
from dataclasses import replace
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from threading import Thread, Lock
from uuid import uuid4
import json
import time
import pytest
from fastapi.testclient import TestClient
from api.tests.test_core import settings, human


@pytest.fixture
def governance(settings):
    from api.manage import migrate, seed_local
    from api.index import create_app
    import psycopg
    migrate(settings)
    seed_local(settings)
    state = {"count": 0, "arguments": [], "authorization": [], "accept": []}
    lock = Lock()
    class Handler(BaseHTTPRequestHandler):
        def log_message(self, *args):
            pass
        def do_POST(self):
            rpc = json.loads(self.rfile.read(int(self.headers["Content-Length"])))
            if rpc.get("method") == "notifications/initialized":
                self.send_response(202)
                self.end_headers()
                return
            args = rpc.get("params", {}).get("arguments", {})
            with lock:
                state["count"] += 1
                state["arguments"].append(args)
                state["authorization"].append(self.headers.get("Authorization"))
                state["accept"].append(self.headers.get("Accept"))
            if args.get("delay"):
                time.sleep(args["delay"])
            if args.get("fail"):
                self.send_response(500)
                self.end_headers()
                return
            if args.get("sse"):
                data = b'data: {"jsonrpc":"2.0","id":"test","result":{}}\n\n'
                self.send_response(200)
                self.send_header("Content-Type", "text/event-stream")
                self.send_header("Content-Length", str(len(data)))
                self.end_headers()
                self.wfile.write(data)
                return
            data = json.dumps({"jsonrpc": "2.0", "id": rpc.get("id"), "result": {"content": [{"type": "text", "text": args.get("text", "ok")}]}}).encode()
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(data)))
            self.end_headers()
            self.wfile.write(data)
    server = ThreadingHTTPServer(("127.0.0.1",0), Handler)
    thread = Thread(target=server.serve_forever, daemon=True)
    thread.start()
    configured = replace(settings, mcp_upstream_url=f"http://127.0.0.1:{server.server_port}/mcp")
    with psycopg.connect(settings.database_admin_url) as conn:
        # Cleanup only previous synthetic governance fixtures in this isolated local cluster.
        for table in ["audit_entries", "executions", "policies", "policy_versions"]:
            if conn.execute("SELECT to_regclass(%s)", (table,)).fetchone()[0]:
                conn.execute("DELETE FROM " + table)
    with TestClient(create_app(configured), base_url="http://127.0.0.1", client=("127.0.0.1",500)) as client:
        yield client, human(client), state
    server.shutdown()
    server.server_close()


def policy(client, headers, outcome, **values):
    result = client.post("/api/policies", headers=headers, json={"name": outcome, "outcome": outcome, **values})
    assert result.status_code == 200, result.text
    return result.json()


def test_audit_latest_window_and_cursor_reach_complete_original_chain(governance):
    from api.db import connection
    from api.execution import append_audit
    client, headers, _ = governance
    org = headers["X-Organization-ID"]
    with connection(client.app.state.settings, org) as conn:
        for sequence in range(1, 206):
            append_audit(conn, org, "synthetic_pagination", {"number": sequence})
    first = client.get("/api/audit", headers=headers).json()
    assert [row["sequence"] for row in first["entries"]] == list(range(205, 5, -1))
    assert first["has_more"] and first["next_before_sequence"] == 6
    assert first["order"] == "descending" and first["chain_scope"] == "partial_window"
    with connection(client.app.state.settings, org) as conn:
        append_audit(conn, org, "newest_outcome", {})
    older = client.get("/api/audit?before_sequence=6", headers=headers).json()
    assert [row["sequence"] for row in older["entries"]] == [5, 4, 3, 2, 1]
    assert not older["has_more"] and older["next_before_sequence"] is None
    assert client.get("/api/audit", headers=headers).json()["entries"][0]["sequence"] == 206
    assert client.get("/api/audit?before_sequence=0", headers=headers).status_code == 422
    assert client.get("/api/audit?before_sequence=6", headers=human(client, "other@local.devise.test")).json()["entries"] == []
    exported = client.get("/api/export", headers=headers).json()["audit"]
    assert [row["sequence"] for row in exported] == list(range(1, 207))
    assert list(reversed(first["entries"] + older["entries"])) == exported[:-1]


def rpc(text="hello", **args):
    return {"request_id": str(uuid4()), "rpc": {"jsonrpc": "2.0", "id": "test", "method": "tools/call", "params": {"name": "echo", "arguments": {"text": text, **args}}}}


def test_allow_real_forward_once_and_block_never_forwards(governance):
    client, headers, state = governance
    assert client.get("/api/policies", headers=headers).status_code == 200, "Policy routes are missing"
    policy(client, headers, "allow")
    request = rpc()
    response = client.post("/api/mcp/execute", headers=headers, json=request)
    assert response.status_code == 200, response.text
    assert response.json()["status"] == "succeeded"
    assert response.json()["result"]["result"]["content"][0]["text"] == "hello"
    assert client.post("/api/mcp/execute", headers=headers, json=request).json()["status"] == "succeeded"
    assert state["count"] == 1
    assert state["authorization"] == [None]
    policy(client, headers, "block", text_pattern="secret")
    result = client.post("/api/mcp/execute", headers=headers, json=rpc("my secret"))
    assert result.json()["decision"] == "block"
    assert state["count"] == 1


def test_redact_warn_review_and_expiry_replay_policy_change(governance, settings):
    client, headers, state = governance
    policy(client, headers, "allow")
    policy(client, headers, "redact", text_pattern="SECRET", replacement="[removed]")
    result = client.post("/api/mcp/execute", headers=headers, json=rpc("a SECRET b"))
    assert result.json()["status"] == "succeeded", result.text
    assert state["arguments"][-1]["text"] == "a [removed] b"
    warn = policy(client, headers, "warn", text_pattern="warning")
    response = client.post("/api/mcp/execute", headers=headers, json=rpc("warning"))
    token = response.json()["continuation_token"]
    assert state["count"] == 1
    continued = client.post("/api/mcp/continue", headers=headers, json={"continuation_token": token})
    assert continued.json()["status"] == "succeeded", continued.text
    assert client.post("/api/mcp/continue", headers=headers, json={"continuation_token": token}).status_code == 409
    assert state["count"] == 2
    review = policy(client, headers, "review", text_pattern="review")
    waiting = client.post("/api/mcp/execute", headers=headers, json=rpc("review" )).json()
    assert waiting["status"] == "pending_review"
    assert state["count"] == 2
    approved = client.post("/api/reviews/" + waiting["review_id"] + "/approve", headers=headers)
    assert approved.json()["status"] == "succeeded", approved.text
    assert client.post("/api/reviews/" + waiting["review_id"] + "/approve", headers=headers).status_code == 409
    assert state["count"] == 3
    changed = client.post("/api/mcp/execute", headers=headers, json=rpc("warning")).json()
    policy(client, headers, "block", text_pattern="new condition")
    assert client.post("/api/mcp/continue", headers=headers, json={"continuation_token": changed["continuation_token"]}).status_code == 409
    import psycopg
    pending = client.post("/api/mcp/execute", headers=headers, json=rpc("review")).json()
    with psycopg.connect(settings.database_admin_url) as conn:
        conn.execute("UPDATE executions SET expires_at=now()-interval '1 second' WHERE id=%s", (pending["review_id"],))
    assert client.post("/api/reviews/" + pending["review_id"] + "/approve", headers=headers).status_code == 410
    assert state["count"] == 3


def test_governance_tenant_roles_conflict_concurrent_approval_and_audit(governance):
    client, headers, state = governance
    policy(client, headers, "review")
    request = rpc("private content")
    pending = client.post("/api/mcp/execute", headers=headers, json=request).json()
    beta = human(client, "other@local.devise.test")
    viewer = human(client, "viewer@local.devise.test")
    assert client.get("/api/reviews", headers=beta).json()["reviews"] == []
    assert client.post("/api/reviews/" + pending["review_id"] + "/approve", headers=beta).status_code == 404
    assert client.post("/api/reviews/" + pending["review_id"] + "/approve", headers=viewer).status_code == 403
    assert client.post("/api/mcp/execute", headers=viewer, json=rpc()).status_code == 403
    assert client.post("/api/mcp/execute", headers=headers, json={**rpc("different"), "request_id": request["request_id"]}).status_code == 409
    from concurrent.futures import ThreadPoolExecutor
    with ThreadPoolExecutor(max_workers=2) as pool:
        statuses = sorted(pool.map(lambda _: client.post("/api/reviews/" + pending["review_id"] + "/approve", headers=headers).status_code, range(2)))
    assert statuses == [200, 409]
    assert state["count"] == 1
    entries = client.get("/api/audit", headers=headers).json()["entries"]
    assert len(entries) >= 3
    assert "private content" not in json.dumps(entries)
    previous = "0" * 64
    import hashlib
    for entry in reversed(entries):  # Latest-first API; verify chain in original order.
        assert entry["previous_hash"] == previous
        payload = {k: entry[k] for k in ["sequence", "kind", "metadata", "created_at"]}
        assert entry["entry_hash"] == hashlib.sha256((previous + json.dumps(payload,sort_keys=True,separators=(",", ":"))).encode()).hexdigest()
        previous = entry["entry_hash"]


def test_fail_closed_missing_policy_upstream_failure_and_unconfigured_upstream(governance):
    client, headers, state = governance
    assert client.post("/api/mcp/execute", headers=headers, json=rpc()).json()["decision"] == "block"
    assert state["count"] == 0
    policy(client, headers, "allow")
    request = rpc(fail=True)
    failed = client.post("/api/mcp/execute", headers=headers, json=request)
    assert failed.json()["status"] == "failed"
    assert client.post("/api/mcp/execute", headers=headers, json=request).json()["status"] == "failed"
    assert state["count"] == 1


def test_pending_content_is_encrypted_and_expiry_purges_it(governance, settings):
    import psycopg
    client,headers,state=governance
    policy(client,headers,"review")
    pending=client.post("/api/mcp/execute",headers=headers,json=rpc("DO-NOT-STORE-PLAINTEXT")).json()
    with psycopg.connect(settings.database_admin_url) as conn:
        raw=conn.execute("SELECT payload_cipher FROM executions WHERE id=%s",(pending["review_id"],)).fetchone()[0]
        assert "DO-NOT-STORE-PLAINTEXT" not in raw
        conn.execute("UPDATE executions SET expires_at=now()-interval '1 second' WHERE id=%s",(pending["review_id"],))
    assert client.post("/api/reviews/"+pending["review_id"]+"/approve",headers=headers).status_code==410
    with psycopg.connect(settings.database_admin_url) as conn:
        assert conn.execute("SELECT payload_cipher FROM executions WHERE id=%s",(pending["review_id"],)).fetchone()[0] is None
    assert state["count"]==0


def test_upstream_timeout_is_unknown_and_not_retried(governance):
    client,headers,state=governance
    policy(client,headers,"allow")
    request=rpc(delay=5.5)
    response=client.post("/api/mcp/execute",headers=headers,json=request)
    assert response.json()["status"]=="unknown"
    assert client.post("/api/mcp/execute",headers=headers,json=request).json()["status"]=="unknown"
    assert state["count"]==1


def test_unconfigured_or_non_loopback_upstream_and_invalid_rpc_are_rejected(governance):
    from api.execution import validate_upstream
    from fastapi import HTTPException
    client,headers,state=governance
    for target in ["", "http://evil.example/mcp", "http://127.0.0.1:9010/mcp?secret=x", "http://user:password@127.0.0.1:9010/mcp", "http://127.0.0.1:9010/other"]:
        with pytest.raises(HTTPException):
            validate_upstream(replace(client.app.state.settings,mcp_upstream_url=target))
    for change in [{"method":"evil"},{"jsonrpc":"1.0"},{"params":{"name":"echo","arguments":{},"url":"http://evil.test"}}]:
        request=rpc()
        request["rpc"].update(change)
        assert client.post("/api/mcp/execute",headers=headers,json=request).status_code==422
    assert state["count"]==0


def test_empty_202_notification_response_is_accepted_without_tool_execution(governance):
    client, headers, state = governance
    policy(client, headers, "allow")
    body = {"request_id": str(uuid4()), "rpc": {"jsonrpc": "2.0", "method": "notifications/initialized"}}
    result = client.post("/api/mcp/execute", headers=headers, json=body)
    assert result.json()["status"] == "succeeded"
    assert result.json()["result"] == {"notification_accepted": True}
    assert state["count"] == 0


def test_redaction_policy_requires_a_nonempty_literal_pattern(governance):
    client, headers, _ = governance
    assert client.post("/api/policies", headers=headers, json={"name": "meaningless", "outcome": "redact"}).status_code == 422


def test_data_class_redaction_and_blocking_reach_real_upstream_with_safe_audit(governance):
    client, headers, state = governance
    policy(client, headers, "allow")
    policy(client, headers, "redact", data_class="email")
    response = client.post("/api/mcp/execute", headers=headers, json=rpc("prefix example@example.test suffix"))
    assert response.json()["status"] == "succeeded"
    assert state["arguments"][-1]["text"] == "prefix [REDACTED] suffix"
    credential_policy = policy(client, headers, "block", data_class="credentials")
    before = state["count"]
    response = client.post("/api/mcp/execute", headers=headers, json=rpc("api_key = 'synthetic-super-secret-123'"))
    assert response.json()["status"] == "blocked" and state["count"] == before
    entries = client.get("/api/audit", headers=headers).json()["entries"]
    decisions = [entry for entry in entries if entry["kind"] == "decision"]
    assert any(entry["metadata"]["data_classes"] == ["credentials"] for entry in decisions)
    assert any(credential_policy["id"] in entry["metadata"]["matched_policy_ids"] for entry in decisions)
    assert all(entry["metadata"]["reason"] == "matched_policy" for entry in decisions)
    serialized = json.dumps(entries)
    assert "synthetic-super-secret-123" not in serialized and "example@example.test" not in serialized


def test_unicode_redaction_removes_exact_original_spans_before_dispatch(governance):
    client, headers, state = governance
    policy(client, headers, "redact", text_pattern="STRASSE", replacement="[removed]")
    response = client.post("/api/mcp/execute", headers=headers, json=rpc("Before Stra\u00dfe after"))
    assert response.json()["decision"] == "redact"
    assert state["arguments"][-1]["text"] == "Before [removed] after"
    from api.policy import replace_strings
    assert replace_strings("a\u00dfb", "s", "X") == "aXb"
    assert replace_strings("unrelated", "STRASSE", "X") == "unrelated"


def test_crashed_execution_expires_content_without_becoming_retryable(governance, settings, monkeypatch):
    import psycopg
    import api.execution as execution
    from api.manage import expire_pending
    client, headers, state = governance
    policy(client, headers, "allow")
    body = rpc("SHORT-LIVED-CRASH-CONTENT")
    original = execution.dispatch
    def crash(*args):
        raise RuntimeError("simulated process crash after durable intent")
    monkeypatch.setattr(execution, "dispatch", crash)
    with pytest.raises(RuntimeError, match="simulated"):
        client.post("/api/mcp/execute", headers=headers, json=body)
    monkeypatch.setattr(execution, "dispatch", original)
    with psycopg.connect(settings.database_admin_url) as conn:
        conn.execute("UPDATE executions SET expires_at=now()-interval '1 second' WHERE request_id=%s", (body["request_id"],))
    expire_pending(settings)
    with psycopg.connect(settings.database_admin_url) as conn:
        status, payload = conn.execute("SELECT status,payload_cipher FROM executions WHERE request_id=%s", (body["request_id"],)).fetchone()
        assert payload is None
        assert status in {"executing", "unknown"}
    response = client.post("/api/mcp/execute", headers=headers, json=body)
    assert response.status_code == 409 or response.json()["status"] == "unknown"
    assert state["count"] == 0


@pytest.mark.parametrize(("pattern","original","expected"), [
    ("STRASSE", "before Stra\u00dfe / STRASSE after", "before [removed] / [removed] after"),
    ("ss", "a\u00dfb", "a[removed]b"),
    ("s", "a\u00dfb", "a[removed]b"),
    ("FFI", "left \ufb03 right", "left [removed] right"),
    ("i\u0307", "left \u0130 right", "left [removed] right"),
])
def test_unicode_literal_redaction_removes_exact_source_spans(pattern, original, expected):
    from api.policy import evaluate
    request=rpc(original)["rpc"]
    decision,forwarded=evaluate(request,[{"rule":{"text_pattern":pattern,"outcome":"redact","replacement":"[removed]"}}])
    assert decision=="redact"
    assert forwarded["params"]["arguments"]["text"]==expected
    assert request["params"]["arguments"]["text"]==original


def test_literal_matching_does_not_invent_spans_across_argument_values():
    from api.policy import evaluate
    request=rpc()["rpc"]
    request["params"]["arguments"]={"first":"alpha","second":"beta"}
    decision,forwarded=evaluate(request,[{"rule":{"text_pattern":"alpha\nbeta","outcome":"redact"}}])
    assert decision=="block"
    assert forwarded["params"]["arguments"]=={"first":"alpha","second":"beta"}


@pytest.mark.parametrize("continuation",["direct","warning","review"])
def test_unicode_redaction_reaches_real_upstream_after_any_continuation(governance,continuation):
    client,headers,state=governance
    policy(client,headers,"redact",text_pattern="STRASSE",replacement="[removed]")
    if continuation!="direct":
        policy(client,headers,"warn" if continuation=="warning" else "review",tool_name="echo")
    result=client.post("/api/mcp/execute",headers=headers,json=rpc("left Stra\u00dfe right")).json()
    if continuation=="warning":
        result=client.post("/api/mcp/continue",headers=headers,json={"continuation_token":result["continuation_token"]}).json()
    elif continuation=="review":
        result=client.post("/api/reviews/"+result["review_id"]+"/approve",headers=headers).json()
    assert result["status"]=="succeeded"
    assert state["arguments"]==[{"text":"left [removed] right"}]


@pytest.mark.parametrize("sweep",["access","operator"])
def test_abandoned_execution_ciphertext_expires_without_becoming_retryable(governance,settings,sweep):
    import psycopg
    import hashlib
    from api.execution import canonical,encrypt
    client,headers,state=governance
    policy(client,headers,"allow")
    body=rpc("abandoned sensitive text")
    execution_id=uuid4()
    unknown_id=uuid4()
    result_cipher=encrypt(client.app.state.settings,{"error":{"code":"uncertain"}})
    with psycopg.connect(settings.database_admin_url) as conn:
        for row_id,status,request_id in [(execution_id,"executing",body["request_id"]),(unknown_id,"unknown",str(uuid4()))]:
            conn.execute("INSERT INTO executions(id,org_id,request_id,subject,request_hash,policy_version,decision,status,payload_cipher,result_cipher,expires_at) VALUES(%s,%s,%s,'local|admin',%s,1,'allow',%s,%s,%s,now()-interval '1 second')",
                         (row_id,headers["X-Organization-ID"],request_id,hashlib.sha256(canonical(body["rpc"]).encode()).hexdigest(),status,encrypt(client.app.state.settings,body["rpc"]),result_cipher))
    if sweep=="access":
        assert client.get("/api/reviews",headers=headers).status_code==200
    else:
        from api.manage import expire_pending
        expire_pending(settings)
    with psycopg.connect(settings.database_admin_url) as conn:
        rows=conn.execute("SELECT status,payload_cipher,result_cipher FROM executions WHERE id IN (%s,%s) ORDER BY status",(execution_id,unknown_id)).fetchall()
        assert rows==[("executing",None,result_cipher),("unknown",None,result_cipher)]
    assert client.post("/api/mcp/execute",headers=headers,json=body).status_code==409
    assert state["count"]==0


def test_policy_mutation_and_decision_audit_attributes_authenticated_actor(governance):
    client,headers,_=governance
    created=policy(client,headers,"block")
    client.post("/api/mcp/execute",headers=headers,json=rpc())
    assert client.delete("/api/policies/"+created["id"],headers=headers).status_code==200
    entries=client.get("/api/audit",headers=headers).json()["entries"]
    relevant=[entry for entry in entries if entry["kind"] in {"policy_created","policy_disabled","decision"}]
    assert len(relevant)==3
    assert all(entry["metadata"]["actor"]=="local|admin" for entry in relevant)
    import hashlib
    previous="0"*64
    for entry in reversed(entries):  # Latest-first API; verify chain from genesis.
        payload={key:entry[key] for key in ["sequence","kind","metadata","created_at"]}
        assert entry["previous_hash"]==previous
        assert entry["entry_hash"]==hashlib.sha256((previous+json.dumps(payload,sort_keys=True,separators=(",",":"))).encode()).hexdigest()
        previous=entry["entry_hash"]


def test_upstream_accept_advertises_json_and_sse_but_sse_response_is_explicitly_unsupported(governance):
    client,headers,state=governance
    policy(client,headers,"allow")
    result=client.post("/api/mcp/execute",headers=headers,json=rpc(sse=True)).json()
    assert state["accept"]==["application/json,text/event-stream"]
    assert result["status"]=="failed"
    assert result["result"]["error"]["code"]=="unsupported_sse_response"
