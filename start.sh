#!/bin/bash

echo ""
echo "========================================"
echo "  Devise-CAD Development Server"
echo "========================================"
echo ""
echo "Current directory: $(pwd)"
echo ""
echo "Starting services:"
echo "  - Frontend      (React Vite)      -> http://localhost:5173"
echo "  - MCP Gateway   (Fastify)         -> http://localhost:3001"
echo "  - Backend API   (FastAPI)         -> http://localhost:8000"
echo "  - Desktop Agent (Python Monitor)"
echo ""

# Check for npm
if ! command -v npm &> /dev/null; then
    echo "[ERROR] npm not found. Please install Node.js 18+"
    exit 1
fi

# Check for Python 3
if ! command -v python3 &> /dev/null; then
    echo "[ERROR] Python 3 not found. Please install Python 3.10+"
    exit 1
fi

# Check for concurrently package
if ! command -v concurrently &> /dev/null && [ ! -f "node_modules/.bin/concurrently" ]; then
    echo "[INFO] Installing concurrently globally..."
    npm install -g concurrently
fi

echo "Starting services..."
echo ""

# Start all services concurrently
npx concurrently -k -p "[{name}]" -n "FRONTEND,MCP-GATEWAY,API,AGENT" -c "cyan,magenta,green,yellow" \
    "cd frontend && npm run dev" \
    "cd mcp-gateway && npx tsx server.ts" \
    "python3 -m uvicorn api.index:app --reload --port 8000" \
    "cd devise-agent/devise-eye && python3 main.py"
