@echo off
cd /d "%~dp0\frontend"
title Devise - Frontend (http://localhost:5173)

echo.
echo  [FRONTEND] Starting React Vite dev server...
echo  URL: http://localhost:5173
echo.

if not exist "node_modules\" (
    echo [INFO] Installing dependencies...
    call npm install
)

npm run dev
pause
