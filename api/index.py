"""Devise trusted API: authenticated routes over durable storage."""
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from api.config import Settings
from api.db import connection
from api.core_routes import router
from api.governance_routes import router as governance_router
from api.spend_routes import router as spend_router
from api.operations_routes import router as operations_router


def create_app(settings=None):
    settings = settings or Settings.from_env()
    app = FastAPI(title="Devise API", version="2.0.0")
    app.state.settings = settings
    app.add_middleware(CORSMiddleware, allow_origins=list(settings.allowed_origins), allow_credentials=False,
                       allow_methods=["GET", "POST", "PATCH", "DELETE"], allow_headers=["Authorization", "Content-Type", "X-Organization-ID"])

    @app.middleware("http")
    async def bounded_request(request: Request, call_next):
        size = 0
        chunks = []
        async for chunk in request.stream():
            size += len(chunk)
            if size > 512 * 1024:
                return JSONResponse({"detail": "Request exceeds 512 KiB"}, status_code=413)
            chunks.append(chunk)
        request._body = b"".join(chunks)
        response = await call_next(request)
        response.headers["Cache-Control"] = "no-store"
        return response

    @app.get("/health")
    def health():
        if not settings.configured:
            raise HTTPException(503, "Backend authentication/database is not configured")
        with connection(settings) as conn:
            conn.execute("SELECT 1 FROM organizations LIMIT 0")
            role = conn.execute("SELECT rolsuper,rolbypassrls FROM pg_roles WHERE rolname=current_user").fetchone()
            if role["rolsuper"] or role["rolbypassrls"]:
                raise HTTPException(503, "Runtime database role must not bypass tenant security")
        return {"status": "ok", "database": "ready", "auth_mode": settings.auth_mode}

    @app.get("/api/event")
    @app.post("/api/event")
    def legacy_event():
        raise HTTPException(501, "Use authenticated /api/events and device-scoped /api/events/batch ingestion")

    @app.post("/api/understand/scan")
    @app.get("/api/understand/graph")
    def scanner_unavailable():
        raise HTTPException(501, "Code scanner unavailable until bounded administrator configuration is implemented")

    app.include_router(router)
    app.include_router(governance_router)
    app.include_router(spend_router)
    app.include_router(operations_router)
    return app


app = create_app()
