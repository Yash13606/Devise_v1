@echo off
cd /d "%~dp0"
title Devise - Agent Monitor

python -m pip install -r devise-agent\devise-eye\requirements.txt -q

echo [AGENT] Starting Devise desktop monitor...
cd devise-agent\devise-eye && python main.py
