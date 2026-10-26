"""Loopback-only MCP test server. Echoes synthetic test text; not a production integration."""
from __future__ import annotations

import argparse
import json
from threading import Lock

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse, Response
from starlette.middleware.trustedhost import TrustedHostMiddleware


def create_fixture_app() -> FastAPI:
    app = FastAPI(title="Devise local MCP fixture", docs_url=None, redoc_url=None)
    app.add_middleware(TrustedHostMiddleware, allowed_hosts=["127.0.0.1", "localhost", "[::1]"])
    state = {"executions": 0, "last_text": None}
    lock = Lock()

    @app.middleware("http")
    async def local_only(request: Request, call_next):
        origin = request.headers.get("origin")
        allowed = {f"http://{host}:{port}" for host in ["127.0.0.1", "localhost"] for port in [8081, 3001, 9010]}
        if origin and origin not in allowed:
            return JSONResponse({"detail": "Only local fixture origins are accepted"}, status_code=403)
        return await call_next(request)

    @app.get("/health")
    def health():
        return {"status": "ok", "fixture": True}

    @app.get("/state")
    def get_state():
        with lock:
            return dict(state)

    @app.post("/mcp")
    async def rpc(request: Request):
        chunks = []
        size = 0
        async for chunk in request.stream():
            size += len(chunk)
            if size > 16384:
                return JSONResponse({"detail": "Fixture request too large"}, status_code=413)
            chunks.append(chunk)
        try:
            body = json.loads(b"".join(chunks))
        except (ValueError, UnicodeError):
            return JSONResponse({"jsonrpc": "2.0", "id": None, "error": {"code": -32700, "message": "Invalid JSON"}})
        if not isinstance(body, dict) or body.get("jsonrpc") != "2.0":
            return JSONResponse({"jsonrpc": "2.0", "id": None, "error": {"code": -32600, "message": "Invalid request"}})
        request_id = body.get("id")
        method = body.get("method")

        def reply(result):
            return JSONResponse({"jsonrpc": "2.0", "id": request_id, "result": result})

        def error(code: int, message: str):
            return JSONResponse({"jsonrpc": "2.0", "id": request_id, "error": {"code": code, "message": message}})

        if method == "notifications/initialized" and "id" not in body:
            return Response(status_code=202)
        if "id" not in body:
            return error(-32600, "A request ID is required")
        if method == "initialize":
            return reply({"protocolVersion": "2025-06-18", "capabilities": {"tools": {}},
                          "serverInfo": {"name": "devise-local-fixture", "version": "1.0.0"}})
        if method == "ping":
            return reply({})
        if method == "tools/list":
            return reply({"tools": [{"name": "echo", "description": "Echo synthetic local verification text",
                                      "inputSchema": {"type": "object", "properties": {"text": {"type": "string"}},
                                                      "required": ["text"], "additionalProperties": False}}]})
        if method != "tools/call":
            return error(-32601, "Method not supported by local fixture")
        params = body.get("params")
        if not isinstance(params, dict) or params.get("name") != "echo":
            return error(-32602, "Unknown fixture tool")
        arguments = params.get("arguments")
        if (not isinstance(arguments, dict) or set(arguments) != {"text"}
                or not isinstance(arguments["text"], str) or len(arguments["text"]) > 8000):
            return error(-32602, "Expected a text argument of at most 8000 characters")
        with lock:
            state["executions"] += 1
            state["last_text"] = arguments["text"]
        return reply({"content": [{"type": "text", "text": arguments["text"]}], "isError": False})

    return app


if __name__ == "__main__":
    import uvicorn
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--port", type=int, default=9010)
    args = parser.parse_args()
    uvicorn.run(create_fixture_app(), host="127.0.0.1", port=args.port, log_level="info", access_log=False)
