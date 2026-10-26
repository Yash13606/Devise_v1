# Measured operations contract

All HTTP routes use the trusted API human bearer token and `X-Organization-ID` membership header described in `LOCAL_API_CONTRACT.md`. The server resolves every role. Administrators perform imports, organization settings updates, export and retention. Every member can read spend/settings/team and edit their own profile. There is no invitation email or public membership mutation endpoint.

Register `api.spend_routes.router` and `api.operations_routes.router` in the application factory. Migration `003_operations.sql` requires `001_core.sql` and `002_governance.sql`. Audit mutations reuse `api.execution.append_audit` inside the same tenant transaction; no credentials or imported invoice values are logged in the audit chain.

## Measured spend

`POST /api/spend/import` accepts `{records:[record]}` with 1-100 records. Each record has exactly:

```json
{"source_id":"invoice-2026-09-example","kind":"invoice","vendor":"Example AI","amount_minor":1234,"currency":"USD","period_start":"2026-09-01","period_end":"2026-09-30","source":"September invoice"}
```

`kind` is `invoice` or `subscription`. String fields are nonempty, trimmed, bounded to 200 characters. Amount is a JSON integer (booleans and numeric strings rejected), 0-9,000,000,000,000 in currency minor units. Currency must be a supported ISO 4217 monetary code; there is no conversion. Both dates must be explicit `YYYY-MM-DD`, with end on/after start. Period end is inclusive. Amounts represent an invoice or a subscription charge for that period; an operator must not import the same charge as both kinds under different IDs.

Identical reuse of tenant `source_id` returns a duplicate; changed reuse returns 409 and rolls back the complete import. Successful response is `{accepted:number,duplicates:number}`. Imports are administrator-only. Server records have generated `id`, `org_id`, and `created_at`.

`POST /api/spend/import/csv` accepts `{csv:string}` with UTF-8 content <=256 KiB and 1-100 data rows, exact unique columns, strict CSV parsing and the same validation. Validation finishes before any write. Every row writes in one transaction. Example fixture:

```csv
source_id,kind,vendor,amount_minor,currency,period_start,period_end,source
invoice-usd-sep,invoice,Example AI,1234,USD,2026-09-01,2026-09-30,invoice.csv
subscription-inr-sep,subscription,Example Local,50000,INR,2026-09-01,2026-09-30,subscription.csv
```

`GET /api/spend?limit=200&offset=0` returns `{total,records,totals,usage_available:false}`. Limits are 1-1000, offset 0-1,000,000. Records are the fields above plus `id`, `org_id`, `created_at`. Totals have `{currency,period_start,period_end,amount_minor}`, summed only within the exact same currency and period. Totals cover all records; `records` is paginated. There is no global mixed-currency total, measured usage, verified savings, invented metering or billing connector. A configured budget is a planning threshold and is not measured spend.

## Profile, settings and team

`GET /api/profile` and `PATCH /api/profile {name:string}` return `{subject,email,name}`. Name is trimmed, 1-120 characters. PATCH requires a selected membership, changes only the authenticated user's name, and rejects email/role/subject changes. Real Auth0 users must first have an operator-provisioned profile and membership.

`GET /api/settings` and administrator `PATCH /api/settings` return this full settings object:

```json
{"retention_days":30,"poll_interval_seconds":30,"heartbeat_interval_seconds":30,"monitoring_enabled":true,"budget_minor":null,"budget_currency":null}
```

PATCH accepts the full object (omitted fields take these defaults). Retention is an integer 1-3650 days, intervals 5-3600 seconds, monitoring is strict boolean, and budget fields must both be null or both be a supported currency and nonnegative integer minor amount. Other existing organization settings are preserved. Each change increments tenant devices' `config_version`; core heartbeat/config responses consume the three agent settings. Monitoring still requires local agent consent and cannot enable clipboard collection or termination.

The Windows run loop schedules observation, heartbeat/config checks, and queued delivery against independent monotonic deadlines. A due heartbeat never itself requests an observation. Local pause/consent/revocation state is checked on each one-second scheduler wake and immediately before observation; synchronous transport/observation work may delay that wake. Successful heartbeats use the configured interval. Delivery checks run every five seconds and send only pending records; heartbeat and delivery transport failures each back off independently for 5, 10, 20, 40, then at most 60 seconds between completed attempts. A successful attempt resets its backoff. Offline observations continue at the configured observation interval; recovered delivery does not wait for that interval. `run --once` performs the initial heartbeat/observation/delivery tick and exits. Pausing stops new observation while already queued metadata remains eligible for delivery; credential rejection stops both and records revocation.

`GET /api/stats` counts a non-revoked device online when its last heartbeat is newer than `max(120, 2 * heartbeat_interval_seconds)` seconds, using the organization's current configuration. This tolerates one missed expected heartbeat and keeps healthy long-interval agents online. Configuration changes can take until the next scheduled heartbeat to reach a running device, so changing to a shorter interval may temporarily change its reported freshness before the device receives that setting. Online freshness is a recent-contact signal, not proof that monitoring is enabled.

`GET /api/team` returns `{members:[{subject,email,name,role}],provisioning:"operator_only",invitations_available:false}` for the selected organization. Roles are `admin`, `member`, `viewer`. Every read is scoped, including profile joins. HTTP callers cannot create memberships or promote identities.

An operator who has independently verified the actual Auth0 subject/email and existing organization can run:

```powershell
.venv/Scripts/python.exe -m api.operations_routes provision-member --config .local/database.json --org-id <existing-org-uuid> --subject 'auth0|verified-id' --email verified@example.com --name 'Verified User' --role viewer
```

This requires the private migration/admin DSN. It creates a profile if absent and creates/updates only the explicitly named membership. It refuses nonexistent organizations, non-Auth0 subjects and changed emails for existing subjects. It records an operator audit entry in the same transaction, with the audit append running as `devise_app` in tenant scope. It does not contact Auth0, validate ownership remotely, create a tenant, or send an invitation; operator verification is required. HTTP administrators cannot invoke this command through the API. Keep `.local/database.json` private.

## Metadata export and retention

Administrator `GET /api/export` returns `{schema_version:1,org_id,exported_at,settings,devices,events,spend,audit}`. Each section is capped at 1000 rows; larger exports fail with 409, never silently truncate. Devices contain public operational fields only; device/enrollment/session secrets and hashes are excluded. Events contain `{event_id,device_id,received_at,payload}` with a metadata field allowlist; unexpected legacy prompt/content/token fields are dropped. Spend is `{id,org_id,payload,created_at}` with the validated invoice record as payload. Audit entries contain `{sequence,kind,metadata,created_at,previous_hash,entry_hash}` in ascending order, preserving their exact hash-chain payloads. Execution request/response encrypted content is not exported. Identity metadata such as hostname and administrator subject remains personal metadata and must be handled accordingly. The export is generated on request and is not automatically uploaded.

Administrator `POST /api/privacy/retention/preview {}` returns `{preview_id,eligible_count,has_more,cutoff,expires_at,confirmation:"DELETE EXPIRED EVENTS"}`. It captures at most 1000 event IDs received before the current organization retention cutoff. This is a dry run; it deletes no events. Preview expires in five minutes and is bound to tenant and human subject.

Administrator `POST /api/privacy/retention/delete {preview_id,confirmation:"DELETE EXPIRED EVENTS"}` returns `{deleted:number}`. It locks and consumes the preview once (409 for expiry/reuse), deletes only the captured event IDs still expired under both preview and current retention settings, and appends an audit entry atomically. A foreign tenant/subject sees 404. `has_more:true` means repeat preview/confirmation for the next bounded set. New events arriving after a preview are excluded. Received time, rather than an untrusted client event timestamp, determines retention.

Retention never deletes audit entries, spend, profiles, memberships, devices or execution records. It is explicit maintenance, not a background scheduler or complete legal erasure workflow. Expired preview metadata is cleaned inside tenant scope. Pending execution content TTL/cleanup belongs to governance. No clipboard or consented request user content is collected by these operations endpoints. The hash chain provides tamper evidence within this database; a database owner can rewrite storage, and there is no external immutable anchor.
