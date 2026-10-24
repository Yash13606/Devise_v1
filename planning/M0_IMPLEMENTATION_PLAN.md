# M0 honest baseline implementation plan

> For agentic workers: execute this approved milestone with the Superpowers implementation/testing flow. Independent registry and existing TypeScript failures may be assigned to isolated, non-overlapping worker tasks; one final independent review covers the combined patch.

**Goal:** Make Devise start reproducibly and represent its current capabilities honestly, with passing frontend type checks and meaningful registry/configuration tests.

**Architecture:** Preserve the existing stack. Put frontend mode/configuration decisions in one small runtime module. Keep demo data behind explicit demo mode, and return clear unavailable errors where persistence has not been implemented. Reconcile registry behavior against evidence rather than restoring unsafe process-only attribution.

**Tech stack:** Existing React 18/Vite/TypeScript/Vitest, Python/pytest, Windows PowerShell and Node.

**Spec:** [WINDOWS_PILOT_DESIGN.md](WINDOWS_PILOT_DESIGN.md), M0 only. Owner approved and asked to start M0; no further workflow-selection approval is needed for routine execution.

## Global constraints

- Keep user edits intact and leave publication/deployment out of this local milestone.
- Production never silently becomes a demo administrator.
- A detected connection is not a license, saved work hour, or invoice.
- Unsupported capabilities must not return fabricated success.
- Do not relax TypeScript flags or remove meaningful failing assertions to make checks green.
- No shared CDN or process-only hint may establish that an AI request happened.

## Review focus

1. Missing/placeholder live configuration must render a useful configuration state rather than a demo user or requests to a placeholder service.
2. Demo data must not be substituted after a live data error or trigger real mutations.
3. Zero savings remains zero/unknown; profile/settings/invite/resolve operations without persistence reject clearly.
4. A more specific API hostname must beat a parent-domain match; unrelated shared CDN traffic remains unknown.
5. New data types must match real hooks; build success alone does not establish type safety or runtime behavior.

## Task 1: Reconcile registry behavior

Files: `devise-agent/devise-eye/registry.py`, registry JSON if needed, and `tests/test_detection_accuracy.py`.

- [x] Reproduce and classify the 25 existing failures.
- [x] Add/adjust contract tests for longest hostname match, CDN ambiguity, confidence evidence, and process hints without inventing network activity.
- [x] Implement the smallest coherent fix; explicitly migrate stale API tests when the replacement interface is safer.
- [x] Run the complete bounded agent registry suite and report counts and any deliberately changed expectation.

## Task 2: Fix existing frontend type and asset failures

Files: `DevicesTab.tsx`, legacy dashboard page wrappers, landing animation declarations, the missing hero asset reference, and `frontend/package.json` typecheck script.

- [x] Use baseline `tsc` diagnostics as the failing check; trace every caller before editing.
- [x] Use live heartbeat types, supported layout props and typed animation variants without adding `any` or suppressions.
- [x] Fix the missing asset through an existing asset or remove the obsolete reference.
- [x] Run `npm run typecheck`; leave compiler strictness unchanged for this focused repair.

## Task 3: Explicit configuration and honest live behavior

Files: `frontend/src/lib/runtimeConfig.ts`, provider/main/App gate, Supabase client, dashboard services, MCP hooks and their focused tests.

- [x] Write failing tests for live configuration, explicit demo behavior, non-fabricated zero/error data and unavailable mutations.
- [x] Implement explicit `VITE_APP_MODE=live|demo` with live as the default. Mark demo visibly and keep it read-only.
- [x] Gate application data screens when required live configuration is invalid. Public marketing pages remain accessible.
- [x] Remove live mock fallbacks and successful no-op writes. Defer unsupported MCP screens with an unavailable state instead of convincing mock enterprise status.
- [x] Run focused tests, full frontend tests and typecheck, then verify missing-config and explicit-demo flows in the browser.

## Task 4: Reproducible Windows setup and handoff

Files: root `package.json`, `start.bat`, setup/preflight script, `.env.example` files, `README.md` and this ledger.

- [x] Replace missing `mcp/` paths, document the actual port 8081, separate UI preview from agent/gateway operation, and add secret-safe configuration preflight.
- [x] Make startup avoid installing packages on every run or launching active monitoring with missing configuration.
- [x] Provide exact setup commands, explicit demo instructions, current service limitations and verification commands.
- [x] Run preflight tests/checks, full frontend validation and the bounded agent suite; inspect the combined diff independently.
- [x] Update graphify and the completion ledger. Record unresolved M1+ gates accurately; M0 is not a customer pilot.

## Execution record

Started after owner approval. Baseline: Vite build passes, example frontend test passes, TypeScript check fails, registry suite 81 passed / 25 failed. Runtime skill installation is separate from product completion.

Delivered: tasks 1-4 completed locally. Frontend typecheck/build pass; lint has zero errors and 12 pre-existing warnings; frontend tests 19 passed, Python tests 121 passed, launcher tests 3 passed. Browser checks cover default configuration failure, explicit read-only dashboard/MCP, and inactive demo scanning. Independent review found two demo side-effect gaps; both received regression tests and fixes. See COMPLETION_STATUS.md for acceptance evidence, warnings, graph limitations and the remaining M1+ gates.

Ruling: keep live application access locked until M1 supplies tenant-authorized contracts, rather than allowing configured credentials to reactivate unscoped direct database access. This prevents unsafe interim live behavior; the cost is that M0 is a preview instead of a working connected dashboard.

Ruling: do not restore process-only or DNS-address attribution to satisfy stale tests. Test the current hostname-evidence interface instead. The cost is intentionally unavailable IP-only coverage until verified ownership data exists.

Ruling: use a root pytest configuration so automatic discovery never imports manual traffic scripts. Browser checks and test output are local evidence only.
