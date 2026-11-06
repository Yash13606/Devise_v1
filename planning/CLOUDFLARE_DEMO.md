# Devise demo on Cloudflare Pages

Current hosting target: Cloudflare Pages, project `devise`, production branch
`main`. The landing page and dashboard run in explicit demo mode; no Auth0,
database, API service, gateway, or device monitor is deployed.

- Website: https://devise.pages.dev/
- Dashboard: https://devise.pages.dev/dashboard
- MCP preview: https://devise.pages.dev/mcp
- Initial deployment: https://e5a719e0.devise.pages.dev
- Source commit: `a3ed58e714f6d16d2c9b1a3484706f08caddfa40`

## Update the demo

From the repository root:

```powershell
npm run build:demo --prefix frontend
npx --yes wrangler@4.158.0 pages deploy frontend/dist --project-name devise --branch main
```

Wrangler uses the authenticated local Cloudflare account. Do not commit tokens
or copy `.env.local` into the deployment output. This is a direct upload, so a
GitHub push alone does not redeploy the Cloudflare site.

Cloudflare Pages serves `index.html` for SPA routes because the output contains
no top-level `404.html`. `/dashboard` and `/mcp` can be visited directly. The demo
build explicitly selects `VITE_APP_MODE=demo`, regardless of old Vercel settings.

The upload completed successfully. HTTP checks confirmed that `/`, `/dashboard`
and `/mcp` return the built demo entrypoint, and that the deployed JavaScript and
CSS match the local production output. Browser checks confirmed landing-page
navigation to the dashboard without login and refreshing the dashboard URL.
Direct browser checks of `/dashboard` and `/mcp` confirmed demo notices, zero
JavaScript page errors, and zero requests to the live backend or Auth0.

The earlier Vercel configuration is optional and is not required for this
Cloudflare deployment. An empty Vercel project named `devise` was created during
the previous setup, but its deployment request was rejected before building.
