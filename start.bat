@echo off
setlocal

REM Change to the folder this bat file lives in (works even if run from elsewhere)
cd /d "%~dp0"

title Devise-CAD

REM --- prerequisite checks ---------------------------------------------------
where npm >nul 2>nul
if errorlevel 1 ( echo [ERROR] npm not found. Install Node.js 18+. & pause & exit /b 1 )

where python >nul 2>nul
if errorlevel 1 ( echo [ERROR] python not found. Install Python 3.12+. & pause & exit /b 1 )

REM --- node_modules ----------------------------------------------------------
if not exist "frontend\node_modules" (
    echo [INFO] Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
)

if not exist "mcp-gateway\node_modules" (
    echo [INFO] Installing MCP Gateway dependencies...
    cd mcp-gateway
    call npm install
    cd ..
)

REM --- python dependencies ---------------------------------------------------
echo [INFO] Checking Python dependencies...
python -m pip install -r requirements.txt -q
python -m pip install -r devise-agent\devise-eye\requirements.txt -q

REM --- launch all services ---------------------------------------------------
echo.
echo  FRONTEND     http://localhost:5173
echo  MCP-GATEWAY  http://localhost:3001
echo  API          http://localhost:8000
echo  AGENT        monitoring...
echo.

npx concurrently -k -p "[{name}]" -n "FRONTEND,MCP-GATEWAY,API,AGENT" -c "cyan,magenta,green,yellow" "cd frontend && npm run dev" "cd mcp-gateway && npx ts-node --transpile-only server.ts" "python -m uvicorn api.index:app --reload --port 8000" "cd devise-agent/devise-eye && python main.py"

pause
endlocal
