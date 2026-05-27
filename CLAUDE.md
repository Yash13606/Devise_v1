# Project Brain - Devise

## Tech Stack
* **Frontend:** React 18 (Vite, TypeScript, Tailwind CSS, shadcn/ui, Radix primitives, Lucide icons, Supabase Client)
* **API Backend:** FastAPI (Python 3.10+, Uvicorn, Pydantic, HTTPX, Tree-sitter)
* **Agent Service:** Devise Eye Desktop Monitor (Python 3.10+, Event Logging)
* **Database & Auth:** Supabase Direct / Auth0 (Local Mock Bypass mode active on placeholders)

## Development Commands
* **Start All Services:** `cmd.exe /c start.bat`
* **Vite Frontend Dev:** `npm run dev` (in `frontend/`, served on port `8081`)
* **Vite Frontend Build:** `npm run build` (in `frontend/`)
* **Vite Frontend Test:** `npm test` (in `frontend/`)
* **FastAPI API Backend Dev:** `python -m uvicorn api.index:app --reload --port 8000` (in root)
* **Devise Desktop Agent Dev:** `python main.py` (in `devise-agent/devise-eye/`)

## Coding Conventions
* **TypeScript:** Strict type checking, no `any` types.
* **Component Design:** Functional components + hooks only, use `cn()` for conditional Tailwind classes.
* **Styling:** Tailwind CSS, dark-mode first design principles.
* **State Management:** TanStack React Query for async cache, React Context for session/auth state.
* **Auto-Commit:** Auto-commits are pushed to `main` branch upon reaching stable states.
