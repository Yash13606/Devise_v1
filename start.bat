@echo off
setlocal enabledelayedexpansion

title Devise-CAD Development Environment

echo.
echo ========================================
echo   Devise-CAD Development Server
echo ========================================
echo.

REM ─── Prerequisite checks ─────────────────────────────────────────────────

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] npm not found. Please install Node.js 18+
    pause & exit /b 1
)

where python >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Python not found. Please install Python 3.10+
    pause & exit /b 1
)

where concurrently >nul 2>nul
if %errorlevel% neq 0 (
    echo [INFO] Installing concurrently globally...
    call npm install -g concurrently --silent
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install concurrently.
        pause & exit /b 1
    )
)

REM ─── Node dependency installs ────────────────────────────────────────────

if not exist "frontend\node_modules" (
    echo [INFO] Installing frontend dependencies...
    pushd frontend
    call npm install --loglevel=error
    set _ERR=!errorlevel!
    popd
    if !_ERR! neq 0 (
        echo [ERROR] Frontend npm install failed.
        pause & exit /b 1
    )
    echo [OK] Frontend dependencies ready.
)

if not exist "mcp-gateway\node_modules" (
    echo [INFO] Installing MCP Gateway dependencies...
    pushd mcp-gateway
    call npm install --loglevel=error
    set _ERR=!errorlevel!
    popd
    if !_ERR! neq 0 (
        echo [ERROR] MCP Gateway npm install failed.
        pause & exit /b 1
    )
    echo [OK] MCP Gateway dependencies ready.
)

REM ─── Python agent dependencies ───────────────────────────────────────────

echo [INFO] Checking agent Python dependencies...
python -m pip install -r "devise-agent\devise-eye\requirements.txt" --quiet
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install agent dependencies.
    pause & exit /b 1
)
echo [OK] Agent dependencies ready.

REM ─── Launch all services ─────────────────────────────────────────────────

echo.
echo Starting services:
echo   [FRONTEND]    React Vite   -^>  http://localhost:5173
echo   [MCP-GATEWAY] Fastify      -^>  http://localhost:3001
echo   [AGENT]       Python monitor
echo.

concurrently -k --raw -p "[{name}]" -n "FRONTEND,MCP-GATEWAY,AGENT" -c "cyan,magenta,yellow" ^
  "cd frontend && npm run dev" ^
  "cd mcp-gateway && npx ts-node server.ts" ^
  "cd devise-agent/devise-eye && python main.py"

echo.
echo All services stopped.
pause
endlocal
