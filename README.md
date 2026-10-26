# Devise

Windows-first AI governance: **Understand → Act → Quantify**, through Pulse, Oversight and Spend.

The local implementation has real PostgreSQL persistence, server-resolved organization access, device enrollment, encrypted Windows delivery, a controlled HTTP MCP integration, versioned policies/reviews/audit, and source-based spend imports. It uses explicit development identities while Auth0/Supabase credentials are pending. This is local development evidence, not a configured customer release.

## Run locally

Prerequisites: Windows, Node24, Python3.12 and installed PostgreSQL binaries. PostgreSQL's existing system service/database is not used. [Detailed setup and Docker alternative](planning/LOCAL_SETUP.md).

```powershell
py -3.12 -m venv .venv
.venv\Scripts\python.exe -m pip install --require-hashes -r requirements-dev.lock
npm ci --prefix frontend
npm ci --prefix mcp-gateway
npm start
```

Open **http://127.0.0.1:8081/dashboard**, choose a development account and sign in. `start.bat` and `npm run dev:local` run the same application. No cloud keys are needed.

Local startup prepares a separate database on127.0.0.1:55432, applies migrations, seeds three local identities, and starts the API8000, frontend8081, controlled MCP fixture9010, gateway3001 and request-content cleanup. It does not start device monitoring. Private generated settings are ignored in `.local/` and `.env.local`; existing owner configuration is never overwritten.

- `admin@local.devise.test`: administrator of Local Alpha.
- `viewer@local.devise.test`: read-only membership in Local Alpha.
- `other@local.devise.test`: administrator of Local Beta, isolated from Alpha.

These are development identities, not real company accounts. Local login requires an explicit development API, loopback client/Host/Origin and a generated signing secret. Production rejects it; the browser also rejects local mode in production builds or away from loopback.

Ctrl+C stops the application processes. The database retains data. `npm run local:stop` stops this project's database after the application has stopped; `npm run local:status` reports its status.

## Try the actual flow

1. **Devices:** create an enrollment token. Enroll the supported Windows CLI using the instructions in [PILOT.md](devise-agent/devise-eye/PILOT.md). Monitoring requires `run --consent`; it collects supported network metadata, without clipboard/window content or process termination.
2. **Events/Overview:** read persisted, tenant-scoped events and heartbeat status. A connection is not a paid seat, prompt count or inspected request.
3. **Governance:** create an explicit allow policy for the local fixture. Exercise allow/block/warn/redact/review using the controlled echo tool; warnings require continuation and reviews an administrator decision. Rules can match literal text or supported credential/email patterns; these heuristics do not detect all sensitive data. No matching rule means block. This is a narrow local JSON HTTP integration, not universal app interception or verified customer-client support.
4. **Spend:** import real billing evidence, or the explicitly synthetic [example CSV](examples/spend.example.csv). Every amount retains source, period and currency; no invented metering, converted mixed-currency total or verified savings.
5. **Settings:** persist profile/organization settings, view scoped membership, export metadata and preview/confirm retention of expired events. Invitations, SSO and SCIM are unavailable until actually integrated.

The earlier marketing/demo screens remain available using `npm run dev:demo` after stopping the local stack. Demo is visibly read-only. The real workspace never falls back to demo records. Code scanning stays unavailable until its separate bounded integration is implemented.

## Verify

```powershell
.venv\Scripts\python.exe -m pytest -q
npm run test:setup
npm run typecheck --prefix frontend
npm run lint --prefix frontend
npm test --prefix frontend -- --maxWorkers=1
npm run build --prefix frontend
npm test --prefix mcp-gateway
```

API tests use only the separate `devise_test` database, never the application database. The root pytest configuration excludes manual network generators. Do not discover tests from the legacy agent directory with bare pytest.

With `npm start` running, this integration check uses actual HTTP, PostgreSQL, Windows DPAPI, a real upstream execution counter and a five-minute delivery outage. It labels synthetic inputs and cleans only its fresh UUID tenants:

```powershell
.venv\Scripts\python.exe scripts/verify_local.py --outage-seconds 300
```

Results and current limits: [local verification](planning/LOCAL_VERIFICATION.md), [completion ledger](planning/COMPLETION_STATUS.md). Dependency locks include hashes; `.github/workflows/ci.yml` prepares separate API/web and Windows-agent checks. A workflow file is not a verified GitHub run.

## Next external connections

Keep Supabase/Postgres + Auth0, Vercel frontend + Render API. [Deployment/operator guide](planning/DEPLOYMENT.md) describes exactly which settings and operator steps remain. Frontend requests go through the trusted API; no service-role database key is shipped in the browser, Windows package or Node adapter.

An [unsigned portable Windows build](planning/WINDOWS_PACKAGE.md) is available locally. Signing, clean-device installation/upgrade/uninstall, configured cloud identity/database/TLS/backups, first real MCP client/upstream, final privacy choices and owner/customer acceptance remain release gates.

[Approved design](planning/WINDOWS_PILOT_DESIGN.md) · [API contract](planning/LOCAL_API_CONTRACT.md) · [operations contract](planning/LOCAL_OPERATIONS_CONTRACT.md) · [skills/workflow](planning/SKILLS_AND_WORKFLOW.md).
