@echo off
cd /d "%~dp0\devise-agent\devise-eye"
title Devise - Agent (Network Monitor)

echo.
echo  [AGENT] Starting Devise Desktop Monitor...
echo  Monitoring AI tool network connections...
echo.

python -m pip install -r requirements.txt -q
python main.py
pause
