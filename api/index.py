"""Devise Dashboard API — FastAPI backend."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sys
import os

app = FastAPI(title="Devise API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/api/event")
def get_events():
    return {"events": []}


@app.post("/api/event")
def post_event(event: dict):
    return {"status": "received"}


# ─── Understand Pipeline (code graph scanning) ──────────────────────────────
# Append devise-agent to path so we can import the pipeline
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "devise-agent"))

try:
    from understand_pipeline.manager import UnderstandPipelineManager

    class ScanRequest(BaseModel):
        directory: str = "."

    @app.post("/api/understand/scan")
    def run_scan(req: ScanRequest):
        manager = UnderstandPipelineManager(req.directory)
        graph = manager.run_pipeline()
        return {"status": "success", "graph": graph}

    @app.get("/api/understand/graph")
    def get_graph():
        manager = UnderstandPipelineManager(".")
        graph = manager.run_pipeline()
        return {"status": "success", "graph": graph}

except ImportError:
    pass  # understand_pipeline not available — skip those endpoints
