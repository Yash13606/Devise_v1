@echo off
cd /d "%~dp0"
title Devise - MCP Gateway

if not exist "mcp-gateway\node_modules" (
    echo [INFO] Installing MCP Gateway dependencies...
    cd mcp-gateway && call npm install && cd ..
)

echo [MCP] Starting MCP Gateway on http://localhost:3001
cd mcp-gateway && npx ts-node --transpile-only server.ts
