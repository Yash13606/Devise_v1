# Local Windows Pilot Implementation Plan

> **For agentic workers:** Use subagent-driven-development for independent components and test-driven-development for behavior changes. Continue through local verification without milestone approval pauses; the owner explicitly requested all locally achievable work while cloud credentials are pending.

**Goal:** Run durable, tenant-isolated enrollment, agent delivery, supported MCP policy execution, measured spend, and a usable dashboard on this Windows machine without external credentials.

**Architecture:** FastAPI owns identity, authorization and trusted operations. PostgreSQL uses versioned migrations and least-privilege runtime access. An explicit loopback-only local authentication harness substitutes for Auth0 only in development; the Auth0 production adapter remains separate. The browser and agent never access database tables directly.

**Tech stack:** React/Vite/TypeScript, FastAPI/Pydantic/Psycopg 3, PostgreSQL, Python Windows agent, Node gateway.

**Spec:** [WINDOWS_PILOT_DESIGN.md](WINDOWS_PILOT_DESIGN.md)

## Global constraints

- Local verification does not satisfy configured Auth0/Supabase, hosted deployment, signing, clean-device lifecycle or customer acceptance.
- Default authentication is Auth0. Local login requires explicit development configuration, loopback binding/host/origin, and is rejected in production.
- Database credentials stay on the backend. Human tokens and device credentials have separate purposes; raw enrollment/device tokens are not stored server-side.
- All tenant reads and writes require server-resolved membership or device identity, with negative tests for another tenant, role spoofing, replay and revocation.
- Persist before acknowledging. Conflicting reuse of an event ID is an error. Bound request sizes, event batches, queues, timeouts and retention.
- Preserve the current UI design and demo mode. No fabricated live records, savings, upstream execution or successful placeholder actions.
- Queue encryption uses an OS-backed secret on Windows; monitoring is explicit and consented. No destructive process termination by default.
- No cloud accounts or credentials are required for local proof. Do not read unrelated projects' credentials or modify the existing PostgreSQL service.

## Shared HTTP contract

All human requests use `Authorization: Bearer <access token>` and `X-Organization-ID: <membership org UUID>` after `/api/me`. Body fields never confer membership/role. Errors are non-2xx with `detail`. Device endpoints use only their separate opaque device token.

- `POST /api/local/session {email}` -> `{access_token, token_type, expires_in}` for seeded local accounts only. `GET /api/local/accounts` -> `{accounts:[{email,name}]}`. Explicit local development only, never production.
- `GET /api/me` -> `{subject,email,name,memberships:[{org_id,org_name,role}]}`.
- `GET /api/devices` -> `{devices:[{id,org_id,name,hostname,os_version,agent_version,last_seen,queue_depth,revoked_at,monitoring_enabled}]}`.
- `POST /api/enrollments {name,expires_in_seconds?:600}` -> `{enrollment_token,expires_at}` (admin).
- `POST /api/devices/enroll {enrollment_token,hostname,os_version,agent_version}` -> `{device_token,device_id,org_id}`. Exchange once, atomically, before expiry.
- `POST /api/devices/{id}/revoke` -> `{revoked:true}` (admin).
- `POST /api/events/batch {schema_version:1,events:[Detection]}` -> `{accepted,duplicates}`. Limit 100, atomic batch, conflict 409. Detection contains UUID `event_id`, timezone-aware `timestamp`, `tool_name`, `domain`, `category`, `vendor`, `risk_level:low|medium|high`, `source`, `process_name`, `evidence_method`, `confidence:0..1`. No client org/role override. Optional metadata must be explicitly validated.
- `GET /api/events?limit=200&offset=0` -> `{total,events:[Detection plus org_id/device_id]}`.
- `GET /api/stats` -> `{events,tools,devices_online,devices_total,high_risk_events}`.
- `POST /api/heartbeat {agent_version,os_version,queue_depth,monitoring_enabled,consent_version,registry_version,config_version}` -> `{config_version,config}`.
- `GET /api/device/config` -> `{config_version,config}`. Defaults observation-only, no process termination.
- Auth0 validates RS256 signature, issuer, audience, expiry, subject using issuer JWKS; server memberships determine role. No JWT-provided admin/tenant authority.

Later task contracts are defined before their consumers are changed. Policy evaluation/execution belongs to Python, not a competing Node evaluator. MCP proof uses an allowlisted loopback HTTP JSON-RPC upstream and an execution counter; it is explicitly a test fixture.

## Review focus

1. An untrusted Host/Origin or production environment must not activate local login.
2. Concurrent retry/enrollment/review requests must not execute or persist twice.
3. Revoked credentials and identity changes must invalidate access and browser caches.
4. Offline queue restart, permanent errors and capacity/expiry must remain visible without losing data silently.
5. Unknown billing currency/period, missing usage and unsupported integrations must not become invented totals or execution claims.

### Task 1: Durable identity and ingestion

**Files:** `api/config.py`, `api/db.py`, `api/auth.py`, `api/models.py`, `api/core_routes.py`, `api/index.py`, `api/migrations/*.sql`, `api/manage.py`, `api/tests/test_core.py`, root requirements.

**Interfaces:** Produces the shared HTTP contract above, an application factory `create_app(settings=None)`, and reusable database/auth dependencies for governance/spend routes. Database config `DATABASE_URL` runtime and `DATABASE_ADMIN_URL` migrations/bootstrap; explicit local settings `APP_ENV=development`, `DEVISE_AUTH_MODE=local`, `DEVISE_LOCAL_AUTH_SECRET`. Default Auth0 uses `AUTH0_DOMAIN`, `AUTH0_AUDIENCE`. Document extension interfaces in `planning/LOCAL_API_CONTRACT.md`.

- [x] Write failing tests for local login guards, unauthenticated/foreign tenant access, role spoofing, single-use enrollment, expiry, revoke, idempotent/conflicting batches and DB persistence after app restart.
- [x] Run focused tests and record expected failures; implement schema/migrations, scoped storage and routes.
- [x] Run against real PostgreSQL with a non-superuser runtime role. Prove RLS negative reads/writes and grants; public browser roles cannot read tables.
- [x] Gate unrestricted legacy scanner routes: authenticated admin/configured root and bounded scan, or explicit unavailable response until safe implementation.
- [x] Record focused results and task review; no independent staging/commits while other components are writing.

### Task 2: Local infrastructure and reproducible launcher

**Files:** `scripts/local.py`, `scripts/dev.mjs`, `scripts/dev.test.mjs`, `compose.yaml`, `.env.example`, `.gitignore`, root package scripts, `planning/LOCAL_SETUP.md`.

**Interfaces:** Consumes Task 1 DB variables and migration command. Creates a separate loopback PostgreSQL cluster using installed binaries (default port 55432), generated private credentials under ignored `.local/`, or documented Docker Compose alternative. Never uses existing cluster credentials. Start API8000 and Vite8081 with explicit local mode.

- [x] Test configuration generation, refusal to overwrite existing credentials, port/host validation and production local-auth rejection.
- [x] Implement setup/start/stop/status/migrate commands, isolated Python3.12 dependencies, redacted diagnostics and process cleanup.
- [x] Verify repeatable start, real health readiness, restart persistence and useful occupied-port errors.

### Task 3: Scoped agent delivery and local lifecycle

**Files:** `devise-agent/devise-eye/{main,config,settings,reporter,event_queue,heartbeat,credentials,pilot_agent}.py`, focused agent tests, environment/packaging examples.

**Interfaces:** Consumes shared enrollment, batch, heartbeat and device config contract. CLI `python pilot_agent.py enroll --api-url URL --token TOKEN`, `run --consent`, `status`, `pause`, `resume`, `forget`. Production tokens go to Windows credential storage; test stores are explicit/injected.

- [x] Fail tests first for encrypted durable bounded queues, network outage/restart delivery, no re-enqueue on flush, rejected/quarantined permanent events and revoked tokens.
- [x] Implement scoped HTTP transport, OS-backed secrets, safe metadata envelope adapter and observation-only monitor using existing registry. Remove active direct Supabase delivery from the supported entrypoint.
- [x] Apply remote interval/config updates to running objects; heartbeat exposes actual consent/queue/registry/config status.
- [x] Verify consent gating, clean local enrollment, pause/resume, restart/revocation and metadata-only observation. Do not enable clipboard or termination automatically.

### Task 4: Real pilot dashboard

**Files:** `frontend/src/lib/{runtimeConfig,AuthContext,pilotApi}.tsx/ts`, `main.tsx`, `App.tsx`, `components/RuntimeStatus.tsx`, `pages/PilotWorkspace.tsx`, focused frontend tests.

**Interfaces:** Consumes shared contract. Add explicit `VITE_APP_MODE=local`, `VITE_API_URL=http://127.0.0.1:8000`; local mode only on loopback and Vite development builds. Auth0 mode gets access tokens via SDK; local mode obtains short-lived backend sessions. Membership selection drives header and cache keys/clearing.

- [x] Fail tests for local mode production/remote denial, authorized API headers, tenant changes and API error handling.
- [x] Reuse existing design components for real overview/events/devices, administrator enrollment/revocation, session/org switch and honest unavailable feature states. Demo remains read-only.
- [x] Extend this workspace for Task 5 policies/reviews/audit and Task 6 spend/settings using their finalized contracts. No legacy direct-table access may run in the real workspace.
- [x] Verify typecheck/lint/tests/build and browser loading/empty/error/permission behavior.

### Task 5: Local supported policy execution

**Files:** `api/{policy,governance_routes,execution}.py`, governance migration/tests, `mcp-gateway/server.ts` and tests, `scripts/mcp_fixture.py`.

**Interfaces:** Versioned tenant policies and deterministic evaluator; supported JSON-RPC HTTP adapter forwards to exact allowlisted upstream only after authorization. Review/warn continuations bind request+policy, expire, and execute at most once. Persist intent and result separately; serialize audit hash-chain appends per tenant.

- [x] Define endpoint/model contract and fail tests for allow/block/warn/redact/review, cross-tenant access, expiry, changed-policy/replay, concurrency, timeout and upstream failure.
- [x] Implement bounded text/action matching, redaction of matched spans, encrypted short-lived pending payloads, administrator review and explicit warning continuation. Local pending-content TTL defaults 10 minutes and is documented as development-only pending owner decision.
- [x] Replace fabricated Node forwarding and public ledger routes with the authenticated Python execution adapter; keep Node protocol adapter thin.
- [x] Prove a real loopback upstream executes allowed/redacted/approved requests once and never blocked/expired requests. State exact supported protocol surface.

### Task 6: Measured spend, settings and privacy operations

**Files:** `api/{spend_routes,operations_routes}.py`, migration/tests, CSV fixture, dashboard updates.

**Interfaces:** Tenant-scoped validated CSV/manual invoice/subscription imports with idempotent source IDs, currency, integer minor units and billing period. Totals stay separate by currency/period. Persistent profile/organization settings, audit export, retention/deletion with dry-run.

- [x] Fail tests for duplicate/conflicting imports, malformed/negative amounts, mixed currencies, unauthorized settings/profile roles and scoped deletion/export.
- [x] Implement measured records/totals and editable real settings. Team membership provisioning stays an explicit admin/operator action; email invitations/SSO remain disconnected until configured.
- [x] Provide bounded retention maintenance and metadata-only exports; redact secrets/content from logs. Browser shows source/period/currency and unknown usage honestly.

### Task 7: Integration verification and handoff

**Files:** `scripts/verify_local.py`, `.github/workflows/ci.yml`, root/agent dependency locks, `README.md`, `planning/COMPLETION_STATUS.md`, `planning/LOCAL_VERIFICATION.md`, operator/deployment/package instructions.

- [x] Test the complete real local HTTP -> PostgreSQL -> dashboard path, two tenants, outage/restart/revoke, policy upstream counter, CSV totals and privacy operations.
- [x] Run serial final backend/agent/frontend/gateway/setup checks and a real browser walkthrough; record exact results and limitations.
- [x] Verify render/Vercel configuration and prepare owner-configurable examples without provisioning cloud resources. Prepare an unsigned local Windows package route; signed/clean-device release gates stay open.
- [x] Run independent whole-change review, fix material findings with regressions, update graph, and leave a clear current completion ledger and exact start commands.

### Task 8: Complete deterministic text inspection from the approved design

**Files:** `api/text_inspection.py`, `api/policy.py`, `api/tests/test_text_inspection.py`, governance tests, frontend policy form/tests.

**Interfaces:** Add optional `data_class: credentials|email` to structured policy rules. Match credential assignment/token/private-key patterns or email spans in string argument values. Rules with both a literal and a data class require both; redaction removes matching spans only. Reports/audits contain class/count/reason metadata, never matched content. No universal capture or ML-classifier claim.

- [x] Fail tests for deterministic credential/email detection, ordinary-text negatives, bounded private-key spans, nested-value redaction, unrelated text preservation and unsupported classes.
- [x] Implement bounded fixed patterns without user-supplied regular expressions. Allow redact rules with either a supported class or nonempty literal; reject rules lacking both.
- [x] Expose class choice in the existing policy form, verify actual upstream receives redacted class spans and blocks matching credential text, run affected checks and scoped independent review.
