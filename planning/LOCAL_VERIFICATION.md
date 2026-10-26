# Local verification record

Date: 2026-10-26. Scope: Windows source runtime and a controlled loopback HTTP integration on this development machine. **Local pilot evidence; no configured cloud/customer release claim.**

## Automated checks

| Check | Result |
|---|---|
| Clean Python3.12 hash-locked environment install | PASS; separate `.local/verify-venv` created from `requirements-dev.lock` |
| Final `.venv` Python3.12/hash-locked `python -m pytest -q` | **220 passed**, one upstream Starlette/httpx TestClient deprecation warning |
| Frontend type check | PASS, without weakening compiler settings |
| Frontend lint | **0 errors,12 existing warnings** |
| Frontend tests, one worker | **42 passed across12 files** |
| Frontend production build | PASS; main JS approximately1.99MB /529KB gzip |
| Node gateway build/tests | **4 passed**, strict TypeScript |
| Root launcher tests | **4 passed** |
| Disposable CI role bootstrap on guarded local `devise_test` | PASS |
| Root start/setup repeated | PASS; migrations/seed idempotent and database data retained |
| Ctrl+C process cleanup | Application listeners8000/8081/3001/9010 stopped; PostgreSQL retained |

API tests require explicit test DSNs with exact database name `devise_test`. They cannot fall back to `devise_local`; runtime role is non-superuser/NOBYPASSRLS. Tests include tenant/role spoofing, RLS/grants, single-use concurrent/expired enrollment, revoke, atomic/conflicting retries, restart persistence, versioned policy/review races, encrypted content TTL, uncertain execution, Unicode/class redaction, audit pagination/integrity, spend conflicts/currencies and scoped export/retention.

Windows tests exercise actual DPAPI and separate processes for pause/config state races. Time-controlled tests exercise the actual main loop with observation3600s and heartbeat30s, independent backoff/recovery, pause/revocation, `--once`, and heartbeat-aware device freshness. SQLite file-handle closing is tested with garbage collection disabled, including immediate Windows rename/forget. These are distinct from clean-device installed lifecycle acceptance.

## Real end-to-end proof

`python scripts/verify_local.py --outage-seconds 300` uses actual HTTP, PostgreSQL and Windows DPAPI. It creates fresh UUID test tenants attached temporarily to explicit development identities, marks controlled events/billing as synthetic, then cleans only those new tenants. Existing application data is preserved.

The final run passed all checks. A temporary **actual collector process** stayed running while a loopback TCP-reset gate made its enrolled API origin unavailable for **300.421seconds**. It retained its encrypted event across independent process reads, retried with bounded backoff, and delivered after restoration **without manual queue flushing in23.375seconds**. The collector was stopped, revoked and locally forgotten afterward; no test monitor was left running.

Other real checks passed: authorized dashboard reads, tenant denial, single-use enrollment, consent/pause, Node→Python→upstream forwarding, idempotent tool retries, empty202 notifications, blocked requests never executing, matched-span Unicode/email redaction reaching the actual upstream, credential-pattern blocking, explicit warning continuation, approved-review execution once, mixed-currency source imports/duplicate handling, actual config propagation, metadata export without credentials, audit hash verification and revocation before observation.

Detection/billing inputs used for deterministic assertions are controlled fixtures. A real Windows metadata cycle can produce zero observations. This does not prove every AI tool is detectable, that observed traffic contains AI prompts, or that any actual subscription was purchased. Raw test logs/reports are local under `.local/reports/`; they contain no provider credentials.

## Browser walkthrough

Gstack's real headless browser exercised local account login, scoped workspace loading, administrator enrollment creation, source CSV import and visible INR/USD period totals, organization switching with cleared old totals, allow-rule creation, actual fixture execution, review creation and administrator approval. The fixture counter increased exactly once after browser approval. A screenshot of explicitly synthetic spend is local at `.local/reports/browser-spend.png`.

After the final service restart, browser checks additionally passed actual profile persistence/restoration, expired-event preview with deletion disabled for zero eligible events, viewer permission controls, data-class policy creation and real upstream redaction of a short quoted credential while preserving surrounding text. With205 added audit fixtures, the browser reached the oldest records using Older and returned to Latest. Browser fixture data was removed afterward; default local organizations/profile were preserved. No application console errors were observed; known React Router future-flag warnings remain.

Automated UI cases additionally cover disconnected/retry states, local mode production/remote denial, session/org cache cleanup, uncertain request-ID reuse and warning acknowledgement.

## Portable Windows build

Actual unsigned build from final agent source and locked build dependencies:

- Version: `0.2.0-pilot`, PyInstaller6.22.3, Python3.12.
- Local ZIP: `.local/packages/0.2.0-pilot/20261026T035417255Z-cceb7b99/DeviseAgent-0.2.0-pilot-windows-unsigned.zip`.
- ZIP SHA256: `60d908067b5a8fe5ad5ddf9ddc31f06cefda813160819b4512e1982419159e25`.
- Frozen executable help, fresh isolated status, bundled registry resolution/hash and ZIP inventory/CRC passed. Registry has204 entries.
- ZIP includes only executable, usage README and manifest. Device/database credentials and queues are excluded. The manifest records source hashes; package smoke did not enable monitoring.

See [WINDOWS_PACKAGE.md](WINDOWS_PACKAGE.md). This is a portable unsigned console artifact, not a signed installer, Windows service or clean-device acceptance result.

## Review and limitations

Independent core, governance/operations and whole-change reviews drove material fixes. Final scoped review approved the scheduler/freshness, audit pagination and deterministic class-inspection changes; a quoted-credential overspan regression was fixed and independently rechecked. Original sequence/hash fields remain intact; paginated audit pages explicitly identify partial history, and bounded export preserves ascending chains.

Existing concerns remain:12 lint warnings, React Router future flags, old Browserslist data, ambiguous Tailwind animation utility, mixed static/dynamic imports and large eager frontend bundle. TypeScript's historical compiler configuration remains less strict than the instruction-file aspiration; this work did not weaken it or claim strict-mode migration. An upstream TestClient deprecation warning remains in Python tests. Graph extraction can report parser/SQL limitations; it does not replace compiler or runtime checks.

Final AST graph refresh:2516 nodes,4786 edges,246 communities. Known limitations: two JSON files yielded no nodes, five SQL files lack the optional `tree_sitter_sql` extractor, and11 existing files are partially parsed. Community names partly use hub-derived labels; semantic documentation extraction was not run. Runtime SQL tests and TypeScript compilation are independent evidence. Private `.local/` and virtual-environment directories are explicitly excluded.

The default native PostgreSQL route is verified. Docker Compose/Render/Vercel files are prepared; their builds/deployments are not locally verified because Docker Desktop is stopped and cloud configuration is pending. Tracked CI prepares API/web and Windows-agent checks; current remote execution belongs to the GitHub Actions run for the published commit, not to the presence of YAML.

External gates: real Auth0/Supabase configuration and two-tenant hosted checks, actual MCP client/upstream/transport, hosted HTTPS/CORS, backup/restore, signing, clean Windows install/upgrade/uninstall, final consent/pending/result retention/legal deletion requirements and owner/customer acceptance. Code scanning, enterprise directory/email workflows, vendor metering and cross-platform capture remain explicitly unavailable or follow-on work. No proprietary-model or universal-content-inspection claim is made.
