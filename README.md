# Devise

Devise is a Windows-first AI governance pilot in development. The product direction is **Understand -> Act -> Quantify**, through Pulse (adoption), Oversight (policy), and Spend (cost evidence).

**Current state: local preview and baseline repair.** The live data path, tenant identity, device enrollment, request enforcement and measured billing still need implementation. This is not a production-ready governance product.

Start with the [approved pilot design](planning/WINDOWS_PILOT_DESIGN.md), [completion ledger](planning/COMPLETION_STATUS.md), and [skill/workflow guide](planning/SKILLS_AND_WORKFLOW.md). The earlier [master document](DEVISE_MASTER.md) describes product ambitions; its numbers and coverage claims are not release evidence.

## Run the interface

Use Node.js 22 LTS or later. From this repository root:

```powershell
npm ci --prefix frontend
npm start
```

Open **http://127.0.0.1:8081**. The public website is accessible. Application routes show a configuration/readiness screen instead of silently authenticating a demo administrator. The preview binds to loopback and uses a strict port, so it reports a conflict instead of silently moving to another port.

For an explicit, read-only demo:

```powershell
npm run dev:demo
```

Open `/dashboard` or `/mcp`. A visible notice labels sample data. Navigation between screens is available; dashboard actions are disabled, no device monitoring runs, and code scanning is unavailable in the demo. No environment file is needed for this mode. Stop the server with Ctrl+C before switching modes.

`start.bat` runs the same default UI preview. It does not install packages or open monitoring processes automatically.

## Configuration and readiness

```powershell
npm run preflight
```

This reports missing setting **names** and the current agent/gateway implementation gates. It does not test cloud connectivity or print credential values. Exit zero means the report ran, not that live services are ready. `npm run dev:agent` and `npm run dev:gateway` currently report unavailable and exit nonzero; they do not start unfinished monitoring or enforcement.

[frontend/.env.example](frontend/.env.example) lists public browser settings. Copy it to `frontend/.env.local` when connecting real authentication later. `VITE_APP_MODE=live` is the default. Missing/placeholder configuration never selects demo mode. Explicit demo mode remains a UI preview even if a production bundle was built with that setting.

The direct Supabase browser client is intentionally blocked until M1 replaces unscoped table access with tenant-authorized contracts. Setting credentials alone does not enable live access. This gate is not a substitute for backend authorization.

Server-only placeholders are in [.env.example](.env.example) and [mcp-gateway/.env.example](mcp-gateway/.env.example). Never put a service-role key in a `VITE_` variable, an endpoint-agent package, a screenshot, or Git.

## Local API development

Python 3.12 is the repository's intended baseline (`.python-version`). Create an isolated environment:

```powershell
py -3.12 -m venv .venv
.venv\Scripts\python.exe -m pip install -r requirements.txt
.venv\Scripts\python.exe -m pip install pytest
npm run dev:api
```

The launcher uses `.venv/Scripts/python.exe` when present, otherwise `python`. Set `DEVISE_PYTHON` to another interpreter path if needed. The API binds to **127.0.0.1:8000** with development logging.

`GET /health` is available. Event GET/POST endpoints explicitly return **501** until durable, authorized ingestion exists. They do not acknowledge discarded events. Existing local code-scanning endpoints are development-only and still require the authentication/path limits recorded in the gap ledger before exposure or pilot use.

To install the legacy gateway and endpoint dependencies as well, after creating the virtual environment:

```powershell
npm run install:all
```

This uses existing npm lockfiles and the Python requirements. It does not start services. Python requirements currently have lower bounds rather than a complete pinned lock; clean Python 3.12 environment validation remains part of release work. No paid detector or remote inspection is required for a UI preview.

## Verify changes

```powershell
npm run test:setup
npm run typecheck --prefix frontend
npm run lint --prefix frontend
npm test --prefix frontend
npm run build --prefix frontend
.venv\Scripts\python.exe -m pytest api/tests devise-agent/devise-eye/tests -q
```

Use the Python interpreter where the dependencies were installed. The bounded Python command excludes legacy manual traffic generators. Do not use bare pytest in `devise-agent/devise-eye`: `persistent_test.py` performs a network operation at import time and is not an automated acceptance test.

A passing Vite build is not a type check. Passing local tests is not a configured Supabase, Auth0, installed Windows agent, or production deployment check. See the completion ledger for results and warnings.

## Repository map

| Path | Purpose |
| --- | --- |
| `frontend/` | React/Vite marketing site, endpoint dashboard, MCP sample screens and code graph UI |
| `api/` | FastAPI entry point and API tests; ingestion is not implemented yet |
| `devise-agent/devise-eye/` | Windows-oriented observation agent, registry, delivery/lifecycle modules and tests |
| `devise-agent/understand_pipeline/` | Local Tree-sitter code graph pipeline; guided tour/review stages are incomplete |
| `mcp-gateway/` | Legacy Fastify gateway prototype; real forwarding/tenant enforcement still required |
| `devise-agent/prompt_library/` | Reference prompts and supporting material, not application feature coverage |
| `scripts/` | Development launcher/preflight and its checks |
| `planning/` | Approved scope, ordered gaps, plans, evidence and skill usage |
| `.agents/skills/` | Project-local installed skills, ignored by Git |
| `graphify-out/` | Local code knowledge graph, ignored by Git |

## What comes next

After M0 baseline verification, M1 implements organization membership, versioned schema, scoped device enrollment, durable/idempotent ingestion and authorized dashboard reads. Windows delivery proof follows, then supported request enforcement, measured Spend and the pilot release gates.

Two choices remain before M3: the first real MCP client/upstream/transport pair and the privacy/lifetime rules for paused request content. Cross-platform coverage follows the Windows pilot. Oximy's proprietary model and published customer/tool statistics are reference material, not Devise capabilities.
