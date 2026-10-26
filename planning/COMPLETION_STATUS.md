# Devise completion ledger

Updated: 2026-10-26. Target: **Windows-first pilot, then expand**. The owner approved the pilot design and instructed completion of locally achievable work while external credentials are obtained.

**Current boundary:** the local trusted data path and supported loopback policy adapter are implemented. This is not a configured cloud/customer release. Use [README](../README.md), [local setup](LOCAL_SETUP.md), [verification](LOCAL_VERIFICATION.md) and [deployment/operator steps](DEPLOYMENT.md).

## Delivered locally

| Area | Implementation/evidence | Remaining boundary |
|---|---|---|
| M0 startup and honesty | Explicit local/live/demo modes, one root start command, real readiness, read-only demo, disabled legacy direct-table access | Existing frontend warnings/performance debt remain |
| M1 identity/storage | Versioned migrations; restricted Postgres role/forced RLS; server memberships; separate human/device credentials; hashed single-use enrollment/revocation; durable idempotent ingestion | Real Auth0 and Supabase project/grant/role/network configuration still require credentials |
| M2 Windows delivery | Supported source CLI; Windows DPAPI; encrypted bounded queue; explicit metadata consent; pause/resume/forget; independent observation/heartbeat/delivery scheduling and bounded retry; live config propagation | Clean-device install/service startup/upgrade/uninstall and customer attribution remain unverified |
| M3 request governance | Tenant-versioned structured policies; literal/credential/email conditions; allow/block/warn/redact/review; encrypted expiring pending content; real HTTP dispatch; exact-request replay protection; serialized audit chain and latest/older pagination | Only the controlled loopback JSON HTTP integration is supported; real client/upstream/transport, SSE/cancellation/resumption and production content decisions remain open |
| M4 dashboard/spend | Real scoped workspace/events/devices/settings/profile/team; validated manual/CSV billing records; exact currency/period totals; metadata export and confirmed expired-event retention | No vendor usage connectors, currency conversion, invented savings, email invitations, SSO/SCIM or complete legal erasure workflow |
| M5 local delivery assets | Hash-locked Python dependencies; CI workflow; Vercel frontend/Render API configuration; unsigned portable Windows package and smoke checks; setup/operator/recovery docs | Remote cloud, signing, installed-device lifecycle, backups/restore and owner/customer acceptance are separate gates |

## Original gap disposition

| IDs | Current disposition |
|---|---|
| M0-01..08 | Local baseline delivered; warnings and large bundle recorded in verification |
| M1-01,02,03,04,05,08 | Implemented and exercised locally, including spoof/replay/conflict/revocation cases |
| M1-06,07 | Gateway public ledger removed; backend membership and RLS/grants tested. Hosted Supabase policies/roles/subscriptions still need configured-project verification |
| M2-01,02,04 | Scoped transport, encrypted queue/restart/recovery, independent scheduling and actual config updates implemented/tested |
| M2-03 | Registry remains 204 entries with hostname evidence/ambiguity limits; no 6500-tool or universal visibility claim |
| M2-05 | Device identity is authoritative; no fabricated employee email/department. Directory-backed employee assignment remains a later integration |
| M2-06 | Source lifecycle and unsigned portable smoke verified on this machine; clean-device installed lifecycle is open |
| M3-01,04,05,06 | Versioned rules, deterministic supported-text inspection, persisted reviews/results and scoped audit implemented |
| M3-02 | Supported main no longer runs legacy process termination. Observation is not prevention; actual request adapter outcomes are separate |
| M3-03,07 | Real counter-proven loopback HTTP execution delivered. Customer-client/protocol coverage and other content/app capture remain unimplemented |
| M4-01,02,03,05 | Source-based spend and actual scoped dashboard actions delivered for supported features; unavailable features do not report success |
| M4-04 | Scoped membership/team view and private operator provisioning implemented. Email invites/enterprise SSO/SCIM/sessions remain unavailable |
| M4-06 | Code scan/tour/reviewer remain explicitly unavailable (HTTP501); unrestricted server filesystem scanning is not exposed |
| M5-01 | Consent/status, metadata minimization, request-content TTL, export and bounded confirmed event retention implemented. Final owner privacy/result retention/legal deletion scope remains open |
| M5-02,03 | Local proof is delivered; installed clean-device and configured deployment acceptance remain open |
| M5-04 | Tracked reproducible GitHub Actions workflow added; remote run status must be verified separately from the workflow file |
| M5-05 | Portable version/hash manifest, source/run recovery and operator handoff supplied; signed release/rollback drills remain open |
| M5-06 | macOS/Linux endpoint capture, universal inspection and proprietary-model parity are expansion work, outside accepted Windows pilot |

## Review and proof

Independent reviews found and drove fixes for pause/config races, Unicode redaction, abandoned executing-content expiry, heartbeat/delivery scheduling and audit truncation. Clean-environment verification additionally caught SQLite file-handle leakage affecting Windows forget and interval-contract/atomic-update mismatch. The final text-inspection review caught a quoted-credential overspan; its delimiter-specific fix passed scoped re-review.

Exact current test counts, actual outage/recovery timing, package identity, browser evidence and warnings are in [LOCAL_VERIFICATION.md](LOCAL_VERIFICATION.md). Evidence distinguishes real local HTTP/Postgres/Windows operations from synthetic test inputs and external completion.

## Owner/external release inputs

1. Auth0 tenant/SPA/API registration, verified subjects and approved organization membership.
2. Supabase region, operator/runtime connections, hosted role/RLS/grant validation and backup/restore.
3. Vercel frontend/Render API projects, deployed URLs, exact CORS/HTTPS and environment secrets.
4. First real MCP client/upstream/transport and its permitted tools/authentication.
5. Pending-request/result retention, consent wording, deletion requirements and pilot-device approval.
6. Publisher identity/signing route, clean Windows test device and install/upgrade/uninstall acceptance.
7. Actual billing/usage source records when demonstrating real spend rather than explicitly synthetic examples.

An LLM/provider key is not required for the implemented deterministic local engine. No cloud account, domain, external integration or signed release is declared complete from these local checks.
