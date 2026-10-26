from fastapi.testclient import TestClient
from scripts.mcp_fixture import create_fixture_app


def test_fixture_protocol_and_actual_execution_counter():
    client = TestClient(create_fixture_app(), base_url="http://127.0.0.1:9010")
    result = client.post("/mcp", json={"jsonrpc": "2.0", "id": 1, "method": "initialize"})
    assert result.json()["result"]["capabilities"] == {"tools": {}}
    notification = client.post("/mcp", json={"jsonrpc": "2.0", "method": "notifications/initialized"})
    assert notification.status_code == 202 and not notification.content
    assert client.get("/state").json()["executions"] == 0
    call = {"jsonrpc": "2.0", "id": 2, "method": "tools/call", "params": {"name": "echo", "arguments": {"text": "local fixture"}}}
    assert client.post("/mcp", json=call).json()["result"]["content"][0]["text"] == "local fixture"
    assert client.get("/state").json() == {"executions": 1, "last_text": "local fixture"}
    assert client.get("/mcp").status_code == 405


def test_fixture_rejects_rebinding_and_invalid_calls_without_execution():
    app = create_fixture_app()
    foreign = TestClient(app, base_url="http://remote.example")
    assert foreign.post("/mcp", json={}).status_code == 400
    client = TestClient(app, base_url="http://127.0.0.1:9010")
    assert client.post("/mcp", headers={"Origin": "https://remote.example"}, json={}).status_code == 403
    bad = {"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": "unknown", "arguments": {}}}
    assert client.post("/mcp", json=bad).json()["error"]["code"] == -32602
    assert client.get("/state").json()["executions"] == 0
