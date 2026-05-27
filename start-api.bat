@echo off
cd /d "%~dp0"
title Devise - API (http://localhost:8000)

echo.
echo  [API] Starting FastAPI backend...
echo  URL: http://localhost:8000
echo  Docs: http://localhost:8000/docs
echo.

python -m pip install -r requirements.txt -q
python -m uvicorn api.index:app --reload --port 8000
pause
