# Supabase/Auth0 + Vercel/Render handoff

These are prepared configurations and operator instructions, not a deployment. No external project, subscription, domain or key has been created. Real Auth0/Supabase compatibility, deployed HTTPS/CORS, backups/restore, signing and owner acceptance remain unverified.

## Database and identity

Create a dedicated Supabase project in the selected region. This implementation uses **PostgreSQL connection strings**, not direct browser PostgREST. A server service-role API key is not needed for this route. Use an operator connection for migrations/provisioning and a separate `devise_app` login connection for the web API. Confirm provider support and network/pooler settings with the actual project.

An operator creates the `devise_app` role with LOGIN, NOSUPERUSER, NOCREATEDB, NOCREATEROLE, NOINHERIT and NOBYPASSRLS using a generated private password, and grants database CONNECT. Migrations grant only required table operations and force tenant RLS. The API refuses a superuser/BYPASSRLS runtime connection. The role/grants and Supabase public `anon`/`authenticated` table denial must be tested against the configured project; local PostgreSQL proof does not prove hosted grants or subscriptions.

Set operator `DATABASE_ADMIN_URL` and runtime `DATABASE_URL` privately, then run `python -m api.manage migrate`. Never run the development seed in production. Create the approved organization with an operator-scoped UUID/name insert after migration; it is not a public signup action.

In Auth0, register a React Single Page Application and a custom API audience. Configure callback/logout/web-origin URLs for the deployed frontend; enable the intended user login connection. Server settings are `AUTH0_DOMAIN` and `AUTH0_AUDIENCE`. Browser settings are `VITE_AUTH0_DOMAIN`, `VITE_AUTH0_CLIENT_ID` and `VITE_AUTH0_AUDIENCE`; a SPA client secret is not needed. The API verifies RS256/JWKS, issuer/audience/expiry/subject, then looks up memberships server-side. JWT role or organization claims alone confer no authority.

After independently verifying each actual Auth0 subject/email and existing organization, provision membership using private operator settings:

```powershell
python -m api.operations_routes provision-member --org-id <uuid> --subject 'auth0|verified-id' --email verified@example.com --name 'Verified User' --role admin
```

Use `viewer` or `member` where appropriate. This command does not create an Auth0 account, invite by email or prove ownership remotely. It is a private operator action. Test two real organizations and role denial before admitting a pilot device.

## Vercel frontend

Set the Vercel project's **Root Directory to `frontend`**. `frontend/vercel.json` builds Vite and rewrites SPA routes to index.html. The old root Python-function rewrite was removed: the API belongs on Render.

Set `VITE_APP_MODE=live`, `VITE_API_URL=https://<render-api-host>` and the three public Auth0 settings. Do not set local mode in a deployed build or put database/device/operator keys in VITE variables. Rebuild after changing Vite environment settings. Missing configuration stays an error; there is no demo fallback.

## Render API

`render.yaml` and `Dockerfile.api` prepare the non-root Python3.12 API image with hash-locked runtime dependencies and `/health` readiness. Supply runtime `DATABASE_URL`, Auth0 domain/audience, exact frontend `CORS_ORIGINS`, and a generated `DEVISE_PENDING_SECRET` of at least32 characters. Keep the encryption secret stable and backed up while stored results are retained. Rotating it without a migration makes previous encrypted content unreadable.

Do not expose `DATABASE_ADMIN_URL` to the web service. Apply migrations through a separate controlled operator job before deploying code that requires them. A scheduled operator job must run `python -m api.manage expire-pending` to physically clear expired request content for idle tenants. Access-time expiry also runs on new executions/continuations. Request intent is ten-minute content storage in the local implementation; expired executing/unknown records retain their non-retryable identity while request ciphertext is cleared. Saved result ciphertext has a separate retention decision, currently unresolved for customer rollout.

The current supported upstream is an explicitly configured **loopback HTTP `/mcp` fixture**, with bounded JSON responses. Do not configure a remote vendor URL and claim support: select the first real client/upstream/transport and implement/test its credentials, policy and privacy behavior before customer enforcement. SSE/cancellation/resumption and general vendor integrations are not implemented.

## Before a pilot release

Verify real Auth0 login/JWKS rotation, Supabase migrations/RLS/grants, separate tenants/roles, enrollment/revocation, HTTPS/CORS, backup restoration and retention/export procedures. Exercise installed Windows lifecycle on a clean consented device, including outage/restart/upgrade/uninstall. Sign distribution through the selected publisher route. Choose the first supported real MCP integration, pending-content/result retention and consent wording. No proprietary detector/LLM API key is required for the deterministic local policy engine.

Prepared CI and Docker/hosting files still need actual remote build/deployment validation. Never equate a local test, unsigned ZIP or provider configuration file with a customer release.
