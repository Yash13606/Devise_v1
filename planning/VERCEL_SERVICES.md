# Deploy Devise with Vercel Services

**Deferred:** the current deployment is frontend-only demo mode. Follow
[DEMO_DEPLOYMENT.md](DEMO_DEPLOYMENT.md). The multi-service details below are
retained for future live backend deployment and do not describe the current
root `vercel.json`.

Prepared for review. No Vercel deployment has been created by this change.
This replaces the frontend-only Vercel/Render arrangement for a project imported
from the repository root. Render remains an optional separate hosting route.

## Confirm before publishing

The project name in the import screen can stay `devise`. Root Directory must be
`./`, and Application Preset must be **Services**. Confirm these proposed service
names and ingress paths before pushing this configuration:

| Service | Root | Public paths | Outbound service binding |
| --- | --- | --- | --- |
| `frontend` | `frontend` | `/` and all non-backend routes, including `/mcp/*` | None: static browser JavaScript calls public `/api/*` |
| `devise-api` | `.` | `/api/*`, `/health` | None: Auth0 and PostgreSQL are external dependencies |
| `mcp-gateway` | `mcp-gateway` | `/gateway/*`; MCP endpoint `/gateway/mcp`, continuation `/gateway/mcp/continue`, readiness `/gateway/health` | `devise-api` via generated `DEVISE_API_URL` |

All three deployed services have explicit public ingress in this proposal; none
is exclusively internal. The gateway-to-API call uses the private binding even
though the API also has public authenticated routes for browsers and devices.
The gateway prefix avoids the dashboard's existing `/mcp/*` React routes.
Top-level service rewrites preserve paths; the gateway explicitly implements
`/gateway` routes in its Vercel entrypoint. Its regular local entrypoint keeps
`/mcp`, `/mcp/continue`, and `/health`.

**`devise-eye` is excluded**: it monitors a consenting user's Windows desktop and
stores a local encrypted queue/DPAPI credentials. It must run on that PC, not a
cloud server. Point the installed agent's configured API origin at
`https://<your-domain>` without an `/api` suffix; its client adds API paths.

## Environment variables in the import screen

Set these in the Vercel project for the intended deployment environments. Enter
private values directly in Vercel; do not commit them or put them in `VITE_*`.

| Variable | Value / purpose |
| --- | --- |
| `VITE_APP_MODE` | `live` |
| `VITE_API_URL` | `/` (explicit same-origin API; no build-time binding needed) |
| `VITE_AUTH0_DOMAIN` | Real Auth0 tenant hostname, without `https://` |
| `VITE_AUTH0_CLIENT_ID` | Public SPA application client ID |
| `VITE_AUTH0_AUDIENCE` | Registered Auth0 API identifier |
| `APP_ENV` | `production` |
| `DEVISE_AUTH_MODE` | `auth0` |
| `DATABASE_URL` | Restricted `devise_app` PostgreSQL login URL; select the provider's serverless-compatible pooler/SSL settings |
| `AUTH0_DOMAIN` | Same tenant as the frontend |
| `AUTH0_AUDIENCE` | Same audience as the frontend |
| `CORS_ORIGINS` | Exact approved HTTPS browser origin(s), comma-separated; no trailing slash or wildcard |
| `DEVISE_PENDING_SECRET` | Privately generated stable secret, at least 32 characters; back up with encrypted records |
| `DEVISE_GATEWAY_PUBLIC_HOST` | Optional additional/custom domain hostname, without scheme or path; Vercel deployment/branch/production host variables are accepted automatically |

**Do not manually set `DEVISE_API_URL`.** Vercel injects it into the calling
gateway function from the service binding. The standalone local launcher uses
that variable for its explicitly configured local API, outside Vercel Services.
Do not put `DATABASE_ADMIN_URL` or a local authentication secret on the web
project. A browser Supabase key/service-role key is not required by this API.

Register the final HTTPS URL(s) in Auth0's SPA allowed callback/logout/web-origin
settings. Provision and migrate the database with private operator credentials,
then provision verified user memberships using the commands in
`planning/DEPLOYMENT.md`. The `/health` route intentionally returns 503 if the
database/authentication setup is missing. A successful build alone does not make
login, device enrollment, or database access operational.

## Import steps

1. Review `vercel.json` and confirm the table above. Publish the reviewed files
   to the GitHub branch selected in the import screen.
2. In the screenshot's import screen, retain Root Directory `./` and **Services**.
   Click **Refresh** after GitHub has the configuration. Do not import the
   detected desktop monitor as a service or select **Import single project**.
3. Expand **Environment Variables** and enter the settings above. Supply the
   actual identity/database values before expecting live workspace access.
4. Import/deploy the multi-service project. Inspect each service's build logs.
5. Check `/`, a refreshed `/dashboard` deep link, `/mcp`, `/health`,
   `/api/me`, and `/gateway/health`. An unauthenticated `/api/me` should return an
   API authentication error, never SPA HTML. GET `/gateway/mcp` returns 405;
   authenticated JSON-RPC POST is the supported transport.
6. Verify real Auth0 login, tenant-scoped API access, and a consenting device's
   enrollment/heartbeat against the final domain.

## Local checks and limitations

Run the frontend/gateway checks before starting services:

```powershell
npm run typecheck --prefix frontend
npm test --prefix frontend -- --maxWorkers=1
npm run build --prefix frontend
npm test --prefix mcp-gateway
```

Use a current Services-capable CLI from the repository root:

```powershell
npx --yes vercel@59.11.1 dev --local --listen 127.0.0.1:3090
```

`vercel dev` runs all services and injects binding URLs. For a live local smoke
check, explicitly provide the browser settings and server credentials above in
the process environment. Keep `DEVISE_API_URL` unset so the CLI injects it.
Private `.env.local` created by the existing local launcher contains development
settings, so do not reuse it as production configuration. The original
`npm run dev:local` remains the Windows pilot launcher.

The gateway forwards authenticated requests to the trusted API; the API does
not call the gateway (which would create a loop). Its upstream execution adapter
currently allows only the local loopback fixture. Leave
`DEVISE_MCP_UPSTREAM_URL` unset on Vercel: real vendor MCP execution is unavailable
until a separately reviewed integration exists. The cloud dashboard/API can
still serve their supported database-backed routes. Retention maintenance,
hosted database grants, real login and clean-device acceptance remain operator
checks described in `planning/DEPLOYMENT.md`.

### Verification on 2026-11-07

- Root configuration passed validation against the current official Vercel JSON
  schema. CLI 59.11.1 accepted it, detected all three services, and selected
  `app.ts` for the gateway. Installed CLI 50.32.5 rejected the new service rewrite
  syntax, so use the pinned command above or upgrade the CLI.
- Frontend typecheck/build and 44 tests passed. Lint reported 0 errors and 12
  pre-existing warnings. Five gateway tests passed, including runtime binding
  resolution, missing-binding refusal, private URL path preservation, public
  host checks and prefixed MCP/continuation/health routing.
- The API unconfigured-health test passed. Six native HTTP smoke checks passed:
  API health 503 with configuration absent, API identity 401 without credentials,
  gateway health 503 carrying the actual API 503, gateway GET MCP 405, gateway
  unauthenticated POST MCP 401, and old gateway `/mcp` path 404. These used an
  explicit local test API URL, not Vercel's private binding network.
- Combined `vercel dev --local` could not complete on native Windows. The CLI's
  generated Python launcher embeds `X:\Devise_v1\api\index.py` without escaping
  backslashes; Python interprets `\a` as a control character and raises
  `OSError: [Errno 22] Invalid argument`. WSL/Linux or a fixed CLI is needed to
  complete that check. No hosted build, automatic private binding network,
  Auth0 login or hosted database was verified.
- Removed checked-in legacy compiled gateway `server.js`/declaration/map files:
  they shadowed current TypeScript and referenced obsolete dependencies. Builds
  still emit current JavaScript to the ignored `dist/` directory.

References: [Services](https://vercel.com/docs/services),
[routing](https://vercel.com/docs/services/routing),
[bindings](https://vercel.com/docs/services/bindings).
