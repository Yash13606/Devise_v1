# Devise Windows pilot design

Date: 2026-10-24

Status: Approved by the owner in this session on 2026-10-24, with instruction to start M0. Implementation is tracked separately in COMPLETION_STATUS.md; approval is not completion evidence.

## Intent

Deliver a working enterprise AI governance pilot on Windows: enroll a device, identify supported AI activity, attribute it to the right organization, apply a policy at a supported request integration, and show auditable results and measured costs in the existing dashboard.

Devise's product direction remains Understand -> Act -> Quantify, with Pulse, Oversight, and Spend. The reference is [Oximy's current website](https://oximy.com/), retrieved on 2026-10-24. It now emphasizes local inspection and intervention before requests and agent actions. Its proprietary model, customer numbers, and tool-coverage claims are not Devise implementation evidence.

## Scope agreed with the owner

- First release: Windows-first pilot, then expand to other operating systems.
- Real ingestion, tenant isolation, policy enforcement on supported integrations, and measured spend.
- Preserve the existing product and build on its React/Vite, Python/FastAPI, Node gateway, and Supabase foundation.

## Proposed approach

Keep the existing stack and concentrate trusted identity, ingestion, and dashboard mutations behind FastAPI. Supabase/Postgres remains the durable store. Keep the Node MCP gateway as a protocol adapter rather than implementing a second independent governance engine.

Alternatives considered:

1. Keep direct browser and agent Supabase writes and harden each caller. This minimizes initial edits but spreads identity, validation, authorization, schema compatibility, and audit decisions across three implementations.
2. Retain the stack and centralize trusted operations behind FastAPI (recommended). This gives one place to enforce organization membership and event contracts while reusing the current UI and agent.
3. Rewrite the product or attempt immediate cross-platform interception. This discards working assets and substantially expands the unproven integration surface; cross-platform work follows the pilot.

The owner selected Windows-first scope. The recommendation to centralize trusted operations is the builder's proposal for approval.

## What counts as complete

A release candidate must pass all of these on a clean Windows test device and a configured test organization:

1. Follow the documented setup with explicit configuration and without editing source. Missing configuration produces a useful error; production never silently becomes a demo administrator.
2. An authorized administrator enrolls a device with a short-lived, single-use enrollment token. The resulting device credential is scoped to one organization and can be revoked.
3. A detection travels from the running agent through validated ingestion into Postgres and appears in the dashboard within 30 seconds online. Event IDs make retry delivery idempotent.
4. During a five-minute network outage, events remain in the encrypted local queue. Reconnection delivers them without duplicates or silent loss. Queue capacity and expiry have visible failure behavior.
5. A second organization cannot read, mutate, subscribe to, or attribute events, devices, rules, approvals, costs, or audit records belonging to the first. Automated negative tests and configured-database checks both prove this.
6. A supported MCP request is evaluated before its upstream action executes. Allowed requests actually reach an allowlisted upstream; blocked requests never do. Errors and timeouts are shown as errors, never as successful proxying.
7. Allow, warn, redact, review, and block outcomes have explicit behavior. Text redaction removes only matched content; review pauses execution until an authorized decision or expiry. Warnings require an explicit continuation action. Unsupported outcomes fail clearly.
8. A decision records organization, device/user identity, integration, policy version, outcome, reason, request identifier, and execution result. A denied or failed termination is not recorded as a successful block.
9. Spend comes from imported subscription/invoice records or metered integration usage. Every number exposes its currency, period, and source. Estimates and potential savings remain separate from measured spend and verified savings.
10. Agent installation, restart, offline recovery, upgrade, credential revocation, and uninstall are exercised. Installation and monitoring require administrator consent and visible status.
11. The frontend build, type check, meaningful tests, real-database checks, supported-integration test, and browser walkthrough pass. Known warnings and remaining external release gates are listed.

## Supported pilot coverage

| Surface | Pilot behavior | Evidence required |
| --- | --- | --- |
| Windows network/process activity | Observe matched registry hostnames/process metadata; classify ambiguity honestly | Deterministic matching tests plus recorded Windows activity |
| Shared CDN addresses | Do not identify an AI tool from a shared address alone | Negative cases for unrelated CDN traffic |
| Supported MCP HTTP integration | Evaluate text arguments and configured actions before forwarding; allowlisted upstream only | Real loopback MCP server with execution counter and blocked-action proof |
| Other desktop/browser AI apps | Observation only where detection works | Capability status clearly says observed, unsupported, or disconnected |
| Clipboard/window context | Optional local risk hints with consent; not proof of the content sent | Privacy defaults and consent test |
| Images, PDFs, spreadsheets, universal HTTPS interception | Follow-on integrations | No pilot claims of complete content inspection |

Process termination after a network connection is not pre-execution enforcement. It should be disabled by default for the pilot; a future administrator opt-in must report actual results and risks. The pilot's prevention claim applies only to the tested request adapter.

## Identity and storage

- Retain Auth0 for real dashboard authentication unless configuration testing demonstrates a concrete incompatibility. Verify issuer, audience, signature algorithm, expiry, and organization membership on the backend.
- Browser-provided organization IDs and role labels never establish authority. Resolve membership server-side; check roles on each privileged operation.
- Device enrollment and device tokens are separate from human access tokens. Store token hashes server-side and Windows credentials in OS-backed storage. Ship no service-role database key in the agent or browser.
- Restrict development authentication to an explicit development configuration. Keep demo datasets explicitly marked and separate from live mode; configuration failure is not authorization.
- Use versioned migrations for organizations, memberships, devices/enrollment, detection events, heartbeats, policies/versions, policy decisions, reviews, cost sources, and audit records as their owning milestones introduce them.
- Put organization identifiers and appropriate foreign keys on tenant-owned rows. Enforce composite uniqueness, including `(org_id, event_id)` and `(org_id, domain)` where relevant.
- Browser access goes through scoped backend endpoints. Database policies and least-privilege grants provide defense in depth; anonymous/public ledger reads must not expose tenant data. Service-role access bypasses RLS, so backend scoping requires dedicated tests.

## Event contract and delivery

- Version the event envelope. Preserve the existing useful fields, reconcile builder and SQL names, validate timestamps and identifiers, and reject unexpected/oversized input with a stable error.
- The authenticated device establishes organization and device identity; clients cannot overwrite those fields.
- Return success only after durable persistence or acknowledgement of an existing identical event ID. A conflicting reuse of an ID fails clearly.
- Use bounded batching and exponential retry for transient failures. Permanent validation errors are surfaced locally and do not endlessly poison the queue.
- Keep detection facts distinct from policy decisions and execution results. Confidence records both value and evidence method.
- Debug logs include event IDs, counts, and error codes, with content and credentials redacted.

## Policies and enforcement

- Store structured, versioned rules with explicit conditions and outcomes. Plain-language input can help draft a rule later; an administrator reviews the structured rule before activation.
- Implement one deterministic Python evaluator usable by the agent and FastAPI. The MCP adapter consumes the same decision semantics; do not maintain competing scoring engines.
- Rules support tool/integration, action, data class, subject scope, and optional monetary/run limits where the integration supplies reliable values.
- Device policy synchronization validates versions and applies configuration changes to live objects atomically. Revocation and unavailable policy behavior are explicit.
- For enforced integrations, missing/invalid policy or identity prevents execution; an observation failure produces a visibility warning rather than claiming coverage.
- Limit the initial payload scanner to supported text and deterministic secret/PII patterns. No new hosted inspection service or unverified foundation-model claim.
- Manual review is tenant-scoped, expires, and cannot execute the same action twice. Tokens granting execution are bound to the exact request and policy version.
- Persist decision intent before execution and record the actual execution result separately. Hash chaining improves tamper evidence but is not a blockchain or an immutable database by itself.

## Spend and adoption

- Start with validated CSV/manual subscription and invoice imports, not banking credentials. Store currency and amounts in minor units with an explicit billing period and source ID.
- Attribute supported metered requests from actual usage responses and a versioned pricing source; unknown usage remains unknown.
- A detected connection is not a license, paid seat, prompt count, saved work hour, or invoice.
- Show empty and disconnected states honestly. Remove fabricated savings, license counts, connected SSO status, and successful no-op mutations from live mode.
- Potential waste is an estimate tied to a rule and time window. Verified savings require before/after billing evidence; no generic ROI percentage.

## Interface and operations

- Reuse current layouts, shadcn components, and TanStack Query. Add backend contracts rather than replacing the visual design wholesale.
- Give every screen loading, empty, disconnected, permission-denied, and error states. Persist settings, reviews, and profile actions that the UI presents as completed.
- Defer screens without a real pilot capability behind a clear unavailable state instead of simulated enterprise integration status.
- Keep code scanning isolated to configured local roots, with authentication, path containment, exclusions, file/byte limits, and timeout. It is secondary to the governance pilot.
- Produce a clean local setup, environment examples, dependency locks, serial verification commands, schema migration guide, operational runbook, and release checklist.
- Preserve raw content locally by default. Define event retention and deletion and expose monitoring consent/status. No content in general application logs.
- Use a Windows test device for installer and lifecycle evidence. Public distribution requires signing and owner-controlled deployment configuration; local builds do not satisfy those gates.

## Delivery order

Each milestone is independently demonstrable. Detailed execution plans follow design approval.

| Milestone | Result | Acceptance evidence |
| --- | --- | --- |
| M0: Reproducible and honest baseline | Correct launchers/configuration; separate demo mode; remove fabricated live metrics; reconcile registry tests and type checking | Clean setup, build/type check, registry suite, UI empty/error states |
| M1: Identity and durable ingestion | Versioned schema, server-side membership, enrollment, scoped ingestion and dashboard reads | Two tenants, spoof/replay/revocation tests, real Postgres persistence |
| M2: Windows observation | Agent uses scoped credentials and ingestion; reliable queue/heartbeat/config updates | Windows live traffic, outage/reconnect, restart and revocation demo |
| M3: Policy and request enforcement | Structured rules, one evaluator, real allowlisted MCP forwarding, outcomes/reviews/audit | Upstream counter proves denied actions never run; review expiry/replay tests |
| M4: Measured Spend and useful dashboard | Actual cost imports, source/period labels, adoption reports, persistent actions | Known import totals, duplicate/mixed-currency cases, browser walkthrough |
| M5: Pilot release | Consent/privacy, retention, signed package route, runbooks and regressions | Clean-device install/upgrade/uninstall, configured deployment checks, owner acceptance |

M1 precedes enterprise data access; M2 and M3 build on its identity contracts. M4 can use imported data before vendor integrations. Cross-platform expansion follows the accepted pilot.

## Observed starting evidence

- Local and remote `main`: `818ad409ef2d691d90ade239ead6dcdc75eca1b0`; the application code was clean before this work. Five local instruction/config files were already modified or untracked.
- Agent registry: 204 entries, not the master document's 6,500+ coverage claim.
- Baseline registry suite: 81 passed, 25 failed. Failures include missing `is_cdn_ip`, `find_match_with_confidence`, and `find_by_process_hint` methods and mismatched API tool identities. Do not restore old APIs blindly; reconcile the intended confidence/evidence contract first.
- FastAPI GET `/api/event` returns an empty list; POST acknowledges without persistence.
- Agent reporter writes directly to Supabase. The checked-in event schema omits fields emitted by the event builder.
- Dashboard tenant/token setters are no-ops; numerous Supabase reads and mutations lack tenant scope.
- Firewall UI upserts conflict on `domain`, but the checked-in schema does not define that unique constraint and requires an organization that the mutation omits.
- MCP endpoint returns `proxied: true` without upstream dispatch. Its ledger read route is not tenant-scoped.
- Registry observations, post-connection termination, clipboard context, and successful request prevention are different evidence classes.
- Frontend authentication falls back to demo administration; spend, profiles, policies, SCIM, SSO, and other functions contain mocks/stubs.
- Root npm launcher references missing `mcp/`; `start.bat` omits the gateway. Common environment files are absent.
- Checked-in TypeScript configuration has `strict: false` and `noImplicitAny: false`, despite instruction-file strictness claims.

These are current local findings, not a certification or exhaustive security audit. Exact source locations and the architecture survey accompany the gap inventory.

## External completion gates

Local development may proceed without paid accounts using test adapters, an explicitly local auth harness, and local Postgres. These are development evidence only.

A customer pilot still requires configured Auth0 and Supabase credentials, an approved tenant, real Windows device enrollment and consent, an allowlisted supported upstream, a hosting target, HTTPS, backup/retention settings, and the owner's distribution/signing and privacy decisions. Do not label these complete from a passing unit suite or a local demo.

## Left to the builder

Choose ordinary module/file layout, migration tooling consistent with the repo, test fixtures, and UI text without re-opening product scope. Prefer small complete changes and existing dependencies. Keep user edits intact. Identify real blockers precisely rather than substituting synthetic proof for deployment or customer acceptance.
