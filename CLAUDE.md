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

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).

## Agent skills and project completion

Project-local skills are in `.agents/skills/`. Use `planning/SKILLS_AND_WORKFLOW.md` to select the relevant flow; installed skill suites are references, not instructions to run every flow at once.

For the Windows-first pilot, read `planning/WINDOWS_PILOT_DESIGN.md` and `planning/COMPLETION_STATUS.md`. Respect their approval status, capability limits, milestone order, and acceptance evidence. Preserve the existing graphify-first navigation rules above.
