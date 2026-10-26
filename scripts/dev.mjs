import { spawn, spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

export function previewEnvironment(command, env) {
  return { ...env, VITE_APP_MODE: command === "demo" ? "demo" : env.VITE_APP_MODE || "live" };
}

export function localEnvironment(env) {
  if (env.APP_ENV === "production") throw new Error("Local startup cannot replace production settings.");
  return { ...env, VITE_APP_MODE: "local", VITE_API_URL: "http://127.0.0.1:8000",
    DEVISE_MCP_UPSTREAM_URL: env.DEVISE_MCP_UPSTREAM_URL || "http://127.0.0.1:9010/mcp" };
}

export function serviceStatus(service, env) {
  const keys = service === "gateway" ? ["DEVISE_API_URL"] : [];
  const missing = keys.filter(key => !env[key] || /placeholder|your[-_ ]|dummy/i.test(env[key]));
  return { ready: false, missing, reason: service === "gateway"
    ? "Requires a healthy trusted API and configured upstream; use the local integration check to prove execution."
    : "Requires device enrollment and explicit monitoring consent. Run the agent status command to check this device." };
}

function settings(directory) {
  const loaded = {};
  for (const name of [".env", ".env.local"]) {
    const path = join(directory, name);
    if (!existsSync(path)) continue;
    for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
      const match = line.match(/^\s*(?:export\s+)?([A-Z][A-Z0-9_]*)\s*=\s*(.*?)\s*$/);
      if (match) loaded[match[1]] = match[2].replace(/^(['"])(.*)\1$/, "$2");
    }
  }
  return { ...loaded, ...process.env };
}

function run(executable, args, cwd = root, env = process.env) {
  return new Promise((resolveExit, reject) => {
    const child = spawn(executable, args, { cwd, env, stdio: "inherit", windowsHide: true });
    const stop = () => child.kill();
    process.once("SIGINT", stop);
    process.once("SIGTERM", stop);
    child.once("error", reject);
    child.once("exit", code => {
      process.removeListener("SIGINT", stop);
      process.removeListener("SIGTERM", stop);
      resolveExit(code ?? 1);
    });
  });
}

const python = () => process.env.DEVISE_PYTHON ||
  (existsSync(join(root, ".venv", "Scripts", "python.exe")) ? join(root, ".venv", "Scripts", "python.exe") : "python");

async function localStack() {
  const env = localEnvironment(settings(root));
  const setup = await run(python(), ["scripts/local.py", "setup"], root, env);
  if (setup) return setup;
  const loaded = localEnvironment(settings(root));
  const vite = join(root, "frontend", "node_modules", "vite", "bin", "vite.js");
  if (!existsSync(vite)) throw new Error("Run npm ci --prefix frontend first.");
  const tsc = join(root, "mcp-gateway", "node_modules", "typescript", "bin", "tsc");
  if (!existsSync(tsc)) throw new Error("Run npm ci --prefix mcp-gateway first.");
  const built = await run(process.execPath, [tsc], join(root, "mcp-gateway"));
  if (built) return built;
  const runtime = { ...loaded };
  delete runtime.DATABASE_ADMIN_URL;
  const gateway = { ...process.env, APP_ENV: "development", DEVISE_API_URL: "http://127.0.0.1:8000",
    CORS_ORIGINS: "http://127.0.0.1:8081,http://localhost:8081" };
  const definitions = [
    [python(), ["-m", "uvicorn", "api.index:app", "--host", "127.0.0.1", "--port", "8000", "--log-level", "debug"], root, runtime],
    [process.execPath, [vite, "--host", "127.0.0.1", "--port", "8081", "--strictPort"], join(root, "frontend"), { ...process.env, VITE_APP_MODE: "local", VITE_API_URL: "http://127.0.0.1:8000" }],
    [python(), ["scripts/mcp_fixture.py"], root, process.env],
    [process.execPath, [join(root, "mcp-gateway", "dist", "server.js")], root, gateway],
    [python(), ["-m", "scripts.maintenance"], root, loaded],
  ];
  const children = [];
  const stop = () => children.forEach(child => {
    if (child.exitCode !== null || !child.pid) return;
    // Windows venv launchers can own a second Python process. Stop only this
    // launcher's children, including their descendants, so no service is orphaned.
    if (process.platform === "win32") spawnSync("taskkill", ["/PID", String(child.pid), "/T", "/F"], { stdio: "ignore", windowsHide: true });
    else child.kill();
  });
  const results = definitions.map(([executable, args, cwd, env]) => new Promise((resolveExit, reject) => {
    const child = spawn(executable, args, { cwd, env, stdio: "inherit", windowsHide: true });
    children.push(child);
    child.once("error", error => { stop(); reject(error); });
    child.once("exit", code => resolveExit(code ?? 1));
  }));
  process.once("SIGINT", stop);
  process.once("SIGTERM", stop);
  console.log("Devise local development: http://127.0.0.1:8081/dashboard | API http://127.0.0.1:8000");
  console.log("Real PostgreSQL and development identities. Controlled MCP fixture9010/gateway3001 and request cleanup are local test services.");
  console.log("Agent monitoring is not started automatically. Ctrl+C stops this application's services; database data is retained.");
  try { return await Promise.race(results); }
  finally { stop(); await Promise.allSettled(results); }
}

async function main(command) {
  if (command === "local") return localStack();
  if (["setup-local", "stop-local", "status-local"].includes(command)) {
    return run(python(), ["scripts/local.py", { "setup-local": "setup", "stop-local": "stop", "status-local": "status" }[command]]);
  }
  if (["preview", "demo"].includes(command)) {
    const vite = join(root, "frontend", "node_modules", "vite", "bin", "vite.js");
    if (!existsSync(vite)) throw new Error("Frontend dependencies are missing. Run npm ci --prefix frontend first.");
    console.log("Devise UI preview: http://127.0.0.1:8081 (no agent or gateway is started).");
    return run(process.execPath, [vite, "--host", "127.0.0.1", "--port", "8081", "--strictPort"],
      join(root, "frontend"), previewEnvironment(command, settings(join(root, "frontend"))));
  }
  if (command === "check") {
    try {
      const response = await fetch("http://127.0.0.1:8000/health", { signal: AbortSignal.timeout(3000) });
      console.log(`Local API readiness: HTTP ${response.status}`);
    } catch { console.log("Local API is not reachable. Start npm run dev:local."); }
    for (const service of ["agent", "gateway"]) {
      const directory = service === "gateway" ? join(root, "mcp-gateway") : join(root, "devise-agent", "devise-eye");
      const status = serviceStatus(service, settings(directory));
      console.log(`${service}: ${status.reason}`);
      if (status.missing.length) console.log(`Missing settings: ${status.missing.join(", ")}`);
    }
    return 0;
  }
  if (command === "agent") {
    return run(python(), ["pilot_agent.py", "run", "--consent"], join(root, "devise-agent", "devise-eye"));
  }
  if (command === "gateway") {
    return run(process.execPath, [join(root, "mcp-gateway", "node_modules", "ts-node", "dist", "bin.js"), "server.ts"], join(root, "mcp-gateway"), settings(root));
  }
  if (command === "fixture") {
    return run(python(), ["scripts/mcp_fixture.py"], root, settings(root));
  }
  if (command === "api") {
    console.log("API development on 127.0.0.1:8000; configuration and database readiness are checked by /health.");
    return run(python(), ["-m", "uvicorn", "api.index:app", "--host", "127.0.0.1", "--port", "8000", "--reload", "--log-level", "debug"], root, settings(root));
  }
  if (command === "install") {
    if (!process.env.DEVISE_PYTHON && !existsSync(join(root, ".venv", "Scripts", "python.exe"))) {
      throw new Error("Create .venv first, or set DEVISE_PYTHON to an isolated interpreter. Setup will not install into a default global Python.");
    }
    const npmCli = process.env.npm_execpath;
    if (!npmCli) throw new Error("Use npm run install:all to run setup.");
    for (const directory of ["frontend", "mcp-gateway"]) {
      const code = await run(process.execPath, [npmCli, "ci"], join(root, directory));
      if (code) return code;
    }
    return run(python(), ["-m", "pip", "install", "--require-hashes", "-r", "requirements-dev.lock"]);
  }
  throw new Error(`Unknown development command: ${command}`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(process.argv[2] || "preview").then(code => { process.exitCode = code; }).catch(error => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
