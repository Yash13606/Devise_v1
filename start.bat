@echo off
cd /d "%~dp0"
title Devise-CAD

echo.
echo  Starting all Devise services in separate windows...
echo.
echo  FRONTEND     http://localhost:5173
echo  MCP-GATEWAY  http://localhost:3001
echo  API          http://localhost:8000
echo  AGENT        monitoring...
echo.

start "Devise - Frontend"    cmd /k start-frontend.bat
start "Devise - MCP Gateway" cmd /k start-mcp.bat
start "Devise - API"         cmd /k start-api.bat
start "Devise - Agent"       cmd /k start-agent.bat
