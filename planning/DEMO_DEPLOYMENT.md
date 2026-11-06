# Landing page and dashboard demo on Vercel

Current deployment scope: the static landing page and read-only dashboard demo.
No API keys, Auth0 tenant, PostgreSQL database, desktop agent, or gateway are
required. The root `vercel.json` deploys only the `frontend` service. The previous
three-service proposal in `VERCEL_SERVICES.md` is deferred.

## Import

- Repository: `Yash13606/Devise_v1`, branch `main`, project name `devise`.
- Keep Root Directory `./` and Application Preset **Services**. Refresh the import
  configuration after the latest commit is on GitHub. Only `frontend` should be
  listed. The single-service configuration prevents the desktop/API/gateway
  folders from being imported automatically.
- No environment variables are needed. Remove the previously entered
  `VITE_APP_MODE=live` and `VITE_API_URL=/` entries if still present. The dedicated
  `npm run build:demo` command explicitly selects demo mode even if those old
  values are left in the dashboard.
- Deploy. `/` opens the landing page; its Agent Dashboard button opens
  `/dashboard`. `/mcp` opens the MCP dashboard preview. SPA rewrites support
  directly visiting or refreshing these URLs.
- A standalone import with Root Directory `frontend` and preset **Vite** also
  uses `frontend/vercel.json` and the same demo build command.

The demo uses a local simulated session, needs no real signup, and labels its
screens as a read-only preview. The live monitoring and mutation paths remain
unavailable. The regular `npm run build` and local pilot launcher keep their
existing behavior for future backend work.

## Verify

```powershell
npm run typecheck --prefix frontend
npm test --prefix frontend -- --maxWorkers=1
npm run build:demo --prefix frontend
```

Check the deployed `/`, `/dashboard`, and `/mcp` pages before sharing the link.
