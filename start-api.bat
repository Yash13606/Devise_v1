@echo off
cd /d "%~dp0"
title Devise - API

python -m pip install -r requirements.txt -q

echo [API] Starting FastAPI server on http://localhost:8000
python -m uvicorn api.index:app --reload --port 8000
