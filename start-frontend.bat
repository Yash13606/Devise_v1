@echo off
cd /d "%~dp0"
title Devise - Frontend

if not exist "frontend\node_modules" (
    echo [INFO] Installing frontend dependencies...
    cd frontend && call npm install && cd ..
)

echo [FRONTEND] Starting React dev server on http://localhost:5173
cd frontend && npm run dev
