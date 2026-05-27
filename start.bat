@echo off
cd /d "%~dp0"
title Devise

echo.
echo  ============================================
echo    Devise — Development Launcher
echo  ============================================
echo.
echo  Checking dependencies...
echo.

REM Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found. Install from https://nodejs.org
    pause
    exit /b 1
)

REM Check Python
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Python not found. Install Python 3.10+
    pause
    exit /b 1
)

REM Install frontend deps if missing
if not exist "frontend\node_modules\" (
    echo [INFO] Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
)

REM Install Python deps if missing
echo [INFO] Checking Python dependencies...
python -m pip install -r requirements.txt -q
python -m pip install -r devise-agent\devise-eye\requirements.txt -q

echo.
echo  Starting services:
echo    FRONTEND   http://localhost:5173
echo    API        http://localhost:8000
echo    AGENT      monitoring...
echo.

start "Devise - Frontend"  cmd /k "cd /d %~dp0 && start-frontend.bat"
start "Devise - API"       cmd /k "cd /d %~dp0 && start-api.bat"
start "Devise - Agent"     cmd /k "cd /d %~dp0 && start-agent.bat"

echo  All windows launched. Close this window or press any key to exit.
pause >nul
