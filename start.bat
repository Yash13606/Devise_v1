@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
    echo Node.js is required. Install Node.js 22 LTS or later.
    exit /b 1
)
echo Devise local application on http://127.0.0.1:8081/dashboard
echo For explicit read-only demo mode, run npm run dev:demo.
echo Real local PostgreSQL and API; development login only. Agent monitoring is opt-in.
call npm start
exit /b %errorlevel%
