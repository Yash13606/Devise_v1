from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sys
import os

# Append devise-agent to path so we can import the pipeline
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "devise-agent"))

from understand_pipeline.manager import UnderstandPipelineManager

app = FastAPI(title="Devise API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ScanRequest(BaseModel):
    directory: str = "."

@app.post("/api/understand/scan")
def run_scan(req: ScanRequest):
    manager = UnderstandPipelineManager(req.directory)
    graph = manager.run_pipeline()
    return {"status": "success", "graph": graph}

@app.get("/api/understand/graph")
def get_graph():
    # In a real implementation, this would fetch from SQLite or a cached JSON
    manager = UnderstandPipelineManager(".")
    graph = manager.run_pipeline()
    return {"status": "success", "graph": graph}
