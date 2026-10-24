# Devise completion ledger

Updated: 2026-10-24

Target: Windows-first pilot, then expand. The owner approved the design and instructed M0 implementation in this session. Read [WINDOWS_PILOT_DESIGN.md](WINDOWS_PILOT_DESIGN.md) before implementation and [SKILLS_AND_WORKFLOW.md](SKILLS_AND_WORKFLOW.md) for installed workflows.

## M0 delivery evidence

M0's local implementation and checks are delivered. This is an honest UI/development baseline, not a configured customer pilot. M1-M5 remain open.

| Check | Final result |
| --- | --- |
| `npm run test:setup` | 3 passed |
| `npm run typecheck --prefix frontend` | PASS, without relaxing compiler flags |
| `npm run lint --prefix frontend` | 0 errors, 12 warnings (3 hook-dependency and 9 Fast Refresh export warnings) |
| `npm test --prefix frontend` | 19 passed across 6 files, including mode/authentication, missing configuration, truthful API results, disabled demo actions and scanner route isolation |
| `npm run build --prefix frontend` | PASS; missing hero asset warning removed |
| `python -m pytest -q` | 121 passed (118 registry tests and 3 API tests); root discovery excludes manual traffic scripts |
| `npm run preflight` | Readiness report succeeds and identifies unfinished services without exposing setting values |
| `npm run dev:agent` / `npm run dev:gateway` | Each exits 1 with an explicit implementation/configuration explanation; no service is launched |
| Browser: default live `/dashboard` without settings | Setup screen names the missing keys; no demo administrator and no Supabase/Auth0 request observed |
| Browser: explicit demo `/dashboard` and `/mcp` | Visible read-only/sample notice, disabled action surface, navigation available |
| Browser: demo `/understand` | Unavailable state; no scanner mounted and no scan request observed |
| Skill setup | 156 project-local entry points validated; gstack native Codex runtime navigated the running UI and produced inspected screenshots |
| `graphify update .` | AST graph refreshed: 2,056 nodes, 3,553 edges; graph limitations below |

Implementation changes include corrected launch paths and port 8081, explicit `VITE_APP_MODE`, read-only demos, unavailable live access until M1 authorization, no fabricated savings or successful no-op writes, 501 event responses instead of discarded-event acknowledgements, precise hostname matching, conservative IP/process attribution, and current setup documentation.

Remaining baseline concerns: frontend bundle approximately 2.13 MB / 579 KB gzip, old Browserslist data, one ambiguous Tailwind animation utility, mixed static/dynamic imports, existing hook/Fast Refresh and React Router migration warnings. Python verification ran on the available Python 3.13 environment; a clean Python 3.12 install and a fully pinned Python dependency lock are not verified. The global Python environment emits a RequestsDependencyWarning. These are not configured-cloud, installed-device, or release evidence.

Graph limitations: the AST updater reports 11 partly extracted source files, 3 zero-node data/config files, and no SQL extraction because `tree_sitter_sql` is absent. TypeScript compilation passes; graph parser warnings do not establish compiler failures. Community names partly use hub-derived labels after the update. Semantic documentation extraction was not run.

Screenshots, network observations, installation hashes and source revisions are local in `.agents/setup/`; [SKILLS_INSTALLATION.md](SKILLS_INSTALLATION.md) is the portable setup summary. Git history and the remote branch establish publication status; this evidence record does not imply deployment or customer-pilot readiness.

## Pre-change evidence recorded this session

| Check | Result | Meaning |
| --- | --- | --- |
| Live GitHub head versus local head | Both `818ad409ef2d691d90ade239ead6dcdc75eca1b0` | No unpushed commits at inspection |
| `frontend: npm run build` | PASS, with warnings | Assets bundle; this does not type-check or prove data integrations |
| `frontend: npm test -- --reporter=dot` | 1 test passed | Only the existing example test; no substantial UI coverage established |
| `frontend: npx tsc --noEmit -p tsconfig.app.json` | FAIL | Heartbeat contract, dashboard props, and animation variant typing errors |
| `python -m pytest devise-agent/devise-eye/tests/test_detection_accuracy.py -q` | 81 passed, 25 failed | Existing registry API/coverage expectations do not match implementation |
| Common local environment files | Absent | No configured-cloud integration proof |
| Architecture survey | Source review completed by an independent agent | Findings below; no runtime security certification |
| Gstack setup | Native Codex project setup completed, version 1.91.186.0 | Runtime/browser smoke validation recorded in skills manifest when complete |

Frontend build warnings include the unresolved `/images/hero-dots.png` asset, an approximately 1.98 MB JavaScript bundle before gzip, a duplicate static/dynamic import, old browser compatibility data, and an ambiguous animation class. They are baseline findings, not regressions introduced by this setup work.

## Gap inventory and acceptance

M0 items below are implemented for the local preview, as verified above. M1-M5 are open. Dependencies are milestone order, not percentage estimates.

### M0 — Reproducible and honest baseline

Status: local implementation delivered; remaining warning/clean-environment concerns are listed above.

| ID | Gap and source evidence | Required result |
| --- | --- | --- |
| M0-01 | Root `package.json` references missing `mcp/`; `start.bat` omits the existing gateway | One documented startup path uses real paths/ports and reports unavailable services |
| M0-02 | Common environment files absent; Supabase uses placeholder defaults | Examples and preflight validation name missing keys without printing secrets |
| M0-03 | `AuthContext.tsx:40-45,140-145` silently supplies a demo administrator | Demo is explicit and visibly marked; production configuration failure cannot authorize access |
| M0-04 | `services/api.ts:364-367` fabricates savings/license totals; many mutations return success without persistence | Live mode displays unknown/empty/error honestly; no successful no-op actions |
| M0-05 | Registry suite has 25 failures; methods expected by tests are missing | Reconciled evidence/confidence contract, correct API hostname specificity, shared-CDN negatives, passing meaningful suite |
| M0-06 | TypeScript check fails despite Vite build passing | Type check passes; use shared live-data types rather than mock types; do not hide errors through relaxed flags |
| M0-07 | Missing asset, heavy eager bundle, weak frontend test | Asset resolves; representative dashboard states tested; baseline performance recorded before optimization |
| M0-08 | README references missing docs and removed workflows | Current commands, environment/setup guide, and checks are reproducible |

### M1 — Identity and durable ingestion

| ID | Gap and source evidence | Required result |
| --- | --- | --- |
| M1-01 | `api/index.py:25-32` acknowledges events without storage | Validated event ingestion persists before acknowledging and retrieves actual scoped rows |
| M1-02 | `event_builder.py:104-122` emits columns absent from `supabase_schema.sql:16-50` | Versioned migrations match the emitted contract and run from an empty database |
| M1-03 | `reporter.py:59-65` uses database key bearer directly; `settings.py:60-65` falls back to local organization | Enrollment, scoped hashed device tokens, revocation, trusted server-side tenant derivation |
| M1-04 | `services/api.ts:232-236` tenant/token setters do nothing; reads at `:294-319` lack tenant scoping | Membership-based backend reads/mutations, tenant-specific cache keys and cache clearing |
| M1-05 | Authentication and data authorization are disconnected | Auth0 JWT verification and server-side organization membership/roles; spoofed tenant/role rejected |
| M1-06 | Service-role ledger reads are unscoped (`mcp-gateway/server.ts:198-204`) | Authenticated tenant-scoped evidence; public test/ledger routes removed or development-gated |
| M1-07 | No proven grant/RLS isolation for checked-in schema | Real two-tenant negative read/write tests, including subscriptions and service-role paths |
| M1-08 | No event idempotency/replay contract | Durable unique event IDs, duplicate retry handling, conflicting ID and revoked-token rejection |

### M2 — Windows observation and delivery

| ID | Gap and source evidence | Required result |
| --- | --- | --- |
| M2-01 | Agent bypasses the backend through direct Supabase writes | Agent sends bounded authenticated batches to ingestion; no database service key shipped |
| M2-02 | Queue/retry code exists without end-to-end acceptance evidence | Offline/restart/reconnect test proves encryption, bounded storage, no silent loss and no duplicates |
| M2-03 | 204 registry entries versus 6,500+ product claim | Versioned supported-coverage inventory, matching method/confidence and ambiguous/unknown states |
| M2-04 | Settings snapshots built once (`main.py:40-45,76-98`); config polling only updates Config | Versioned config update actually reaches live dependent objects and is acknowledged |
| M2-05 | Device/user/department identity partly inferred from OS context | Device identity authoritative; user attribution source visible; no fabricated work email |
| M2-06 | Installers/binary exist, lifecycle not validated | Clean Windows enrollment, restart, recovery, revocation and uninstall evidence |

### M3 — Supported request policy and enforcement

| ID | Gap and source evidence | Required result |
| --- | --- | --- |
| M3-01 | UI firewall upsert (`api.ts:503-513`) conflicts on a missing unique key and omits required tenant | Authorized, versioned policy storage with composite tenant keys and live propagation |
| M3-02 | PID termination happens after connection; failures still appear blocked (`main.py:193-249`) | Capability labels distinguish observation, attempted termination, and prevented request; actual result recorded |
| M3-03 | Gateway dispatch is comments; returns `proxied: true` (`server.ts:151-168`) | Protocol-correct supported client/upstream forwarding, timeout/cancellation/error propagation and credentials handling |
| M3-04 | ToolGuard is substring detection (`server.ts:75-84`) | One deterministic text/action evaluator with explicit policy versions and all outcome tests |
| M3-05 | Generated/mock policy and approval UI | Persisted decisions, authorized exact-request reviews, expiry and replay prevention |
| M3-06 | Hash chain reads latest then inserts separately (`server.ts:95-134`) | Concurrent append integrity, actual execution statuses, tenant scoping, tested verification/export |
| M3-07 | Source describes complete prompt/data protection without a capture integration | Tested coverage matrix; unsupported apps/content clearly unavailable; no blanket interception claim |

Before M3 planning: select the first real MCP client/upstream/transport pair, and specify local scanning plus paused-request content lifetime. The loopback test fixture does not itself establish customer-client support. These decisions do not block M0/M1.

### M4 — Measured Spend and useful dashboard

| ID | Gap and source evidence | Required result |
| --- | --- | --- |
| M4-01 | Spend/subscription functions return defaults (`api.ts:573-581`) | Validated imported billing/seat evidence, with source, period, currency and duplicate handling |
| M4-02 | Detected users times catalog price is presented as savings | Measured spend, estimates, potential savings, and verified savings are separate; no inferred license purchase |
| M4-03 | MCP failed reads replaced by generated calls (`useMCPData.ts:363-384`) | Honest loading/empty/error/disconnected states with no synthetic live evidence |
| M4-04 | SCIM, SSO, sessions, team and policies partly hardcoded (`useMCPData.ts:482-552`) | Wire pilot capabilities to real data; mark deferred integrations unavailable |
| M4-05 | Profile/settings/alerts/invites contain successful stubs | Persist accepted pilot actions with authorization, audit, error recovery and tests |
| M4-06 | Code scanning accepts a directory with limited safeguards (`api/index.py:41-56`) | Authenticated configured-root scanning with path containment, size/exclusion/time limits; tour/reviewer either implemented or unavailable |

### M5 — Pilot release and expansion gates

| ID | Gap | Required result |
| --- | --- | --- |
| M5-01 | Monitoring privacy/consent and retention not operationalized | Consent/status controls, minimal collection, documented deletion/export/retention, redacted logs |
| M5-02 | Unit/demo evidence does not establish installed agent operation | Clean Windows device verification with accepted install/upgrade/uninstall and outage scenarios |
| M5-03 | Deployment configuration exists without current service proof | Configured Auth0/Supabase/hosting/HTTPS, migrations, backups, health checks and owner acceptance |
| M5-04 | No current tracked GitHub Actions workflows | Reproducible checks locally and CI once publication is authorized; failures must block readiness |
| M5-05 | No proven support/recovery process | Versioned package, rollback/recovery procedure, audit export, operator runbook and explicit known limits |
| M5-06 | Cross-platform/universal capture/proprietary-model parity remains aspirational | Separate expansion specs after pilot acceptance; no claim of completion based on this milestone |

## Architecture survey recommendations

1. **Tenant-scoped ingestion module (Strong; first):** replace the empty ingestion surface with identity, validation, idempotency, persistence and authorized reads. Deleting the current stub removes ceremony; deleting the completed module would spread those invariants across its callers.
2. **Policy delivery/enforcement module (Strong):** deepen the existing monitor seam around versioned policy and measured adapter outcomes. Network observation and supported request prevention are two real adapters, not equivalent evidence.
3. **MCP execution/evidence module (Strong):** replace optimistic proxy semantics with actual forwarding and measured durable outcomes. Keep protocol and persistence complexity behind the execution interface.
4. **Measured-spend module (Strong; after ingestion):** concentrate billing evidence, identity reconciliation, currency/period and provenance. Remove contradictory fallback totals rather than wrapping them.

## Current next action

Implement M1 from the approved design: versioned schema, organization membership, server-verified identity, scoped device enrollment, durable/idempotent ingestion and authorized reads. Use a local real Postgres test environment for development evidence; configured Auth0/Supabase and a consented Windows device remain separate acceptance gates. Preserve the explicit live-data lock until those authorization contracts exist. The product is not pilot-ready at this point.
