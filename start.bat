@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
    echo Node.js is required. Install Node.js 22 LTS or later.
    exit /b 1
)
echo Devise UI preview on http://127.0.0.1:8081
echo For explicit read-only demo mode, run npm run dev:demo.
echo Agent and gateway readiness: npm run preflight
call npm start
exit /b %errorlevel%
