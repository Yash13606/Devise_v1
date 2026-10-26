# Local setup and recovery

Use Windows, Node24, Python3.12 and PostgreSQL18 binaries. The default native route is verified on this machine. Docker Compose is an alternative template; its container route has not been exercised here because Docker Desktop is stopped.

## First setup

Create `.venv` with Python3.12, install `requirements-dev.lock` with `--require-hashes`, and run `npm ci --prefix frontend` and `npm ci --prefix mcp-gateway`. If Python3.12 is managed by uv, `uv venv --python 3.12 .venv` is equivalent. `npm run install:all` installs the locked Node/Python dependencies after an isolated interpreter exists. Never install into an unrelated/global Python environment.

`npm run local:setup` prepares the database only. `npm start` also starts application services. PostgreSQL binaries are found on PATH or under Program Files/PostgreSQL; set `DEVISE_POSTGRES_BIN` to an explicit bin directory if necessary. `DEVISE_PYTHON` can select another isolated interpreter.

Native setup creates its own `.local/postgres` cluster, SCRAM credentials and `devise_owner` operator account; runtime `devise_app` is NOSUPERUSER/NOBYPASSRLS and has limited table grants. It binds127.0.0.1:55432. The existing PostgreSQL Windows service and its credentials are not used. Two databases separate application data (`devise_local`) and destructive test fixtures (`devise_test`).

Generated `.local/database.json`, `.env.local`, DPAPI state, queues, reports and package outputs are private/gitignored. Setup refuses changed existing environment settings and database port/provider mismatches. Do not copy these files into Git, chat, frontend settings or a release ZIP. Logs report IDs, counts and error codes rather than tokens/request content.

## Services

| Service | Address | Purpose |
|---|---|---|
| Frontend | http://127.0.0.1:8081/dashboard | Local workspace and development login |
| API | http://127.0.0.1:8000/health | Trusted authorization, persistence and execution |
| MCP adapter | http://127.0.0.1:3001/mcp | Stateless JSON HTTP, human bearer + organization header |
| Controlled upstream | http://127.0.0.1:9010/mcp | Synthetic echo fixture with execution counter |
| PostgreSQL | 127.0.0.1:55432 | Separate project-owned cluster |

`npm start` builds the Node adapter, applies migrations/seeds idempotently, and starts all application services plus periodic request-content expiry maintenance. A missing dependency/occupied port is an error; startup does not silently change ports. The frontend and adapter receive only their needed environment settings. The API web process excludes the database operator URL; maintenance has operator access only in this explicit local stack.

No monitor starts automatically. Use [PILOT.md](../devise-agent/devise-eye/PILOT.md) to enroll, explicitly consent, pause/resume, inspect status, revoke and forget. Default credentials use per-user Windows DPAPI. Stop the collector before forgetting. Keep any failed encrypted queue until delivery is recovered or an explicit local-forget action is intended.

## Docker alternative on a new checkout

Start Docker Desktop yourself. Before initializing a native cluster, run:

```powershell
.venv\Scripts\python.exe scripts/local.py setup --provider docker
npm start
```

This creates private `.local/compose.env` from generated credentials and invokes `compose.yaml`; PostgreSQL18's data volume is mounted at `/var/lib/postgresql`. The runtime role and both databases are then bootstrapped. Do not run native and Docker databases on the same port. Provider switching after initialization is refused to preserve existing data. `local:stop/status` uses the selected provider. The Docker route/template is prepared but unverified on this machine.

## Stop, restart, and failures

Ctrl+C stops only this launcher's application child processes (including Windows venv descendants). PostgreSQL stays running with data retained. Run `npm run local:stop` if you also want to stop that project database; never delete `.local/postgres` to resolve a startup error.

For API503, inspect database status, migrations and the restricted runtime role. For API401, refresh/sign in again or check device revocation. For API403, select a membership and role that actually permits the action. Conflicting event/source/request IDs return409 and must not be retried with changed payloads under the same ID. An unknown MCP execution outcome must not be reissued under a new ID automatically.

`npm run preflight` reports readiness without credential values. PostgreSQL startup diagnostics are in `.local/setup.log` and `.local/postgres.log`. Request payloads are not diagnostic logs. Keep local access restricted; development login is a test harness, not an authentication substitute for deployment.

Run migrations before a new version and back up before schema changes. There is no automatic destructive reset command. Operator-only database backups/restores, clean-device installation and customer release acceptance must be exercised separately before production use.
