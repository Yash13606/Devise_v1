import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

export function previewEnvironment(command, env) {
  return { ...env, VITE_APP_MODE: command === "demo" ? "demo" : env.VITE_APP_MODE || "live" };
}

export function serviceStatus(service, env) {
  const keys = service === "gateway"
    ? ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "AUTH0_DOMAIN", "AUTH0_AUDIENCE"]
    : ["SUPABASE_URL", "SUPABASE_KEY"];
  const missing = keys.filter(key => !env[key] || /placeholder|your[-_ ]|dummy/i.test(env[key]));
  return { ready: false, missing, reason: service === "gateway"
    ? "Gateway execution and tenant isolation are not implemented; available after M1/M3."
    : "Scoped device enrollment and durable ingestion are not implemented; available after M1/M2." };
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

async function main(command) {
  if (["preview", "demo"].includes(command)) {
    const vite = join(root, "frontend", "node_modules", "vite", "bin", "vite.js");
    if (!existsSync(vite)) throw new Error("Frontend dependencies are missing. Run npm ci --prefix frontend first.");
    console.log("Devise UI preview: http://127.0.0.1:8081 (no agent or gateway is started).");
    return run(process.execPath, [vite, "--host", "127.0.0.1", "--port", "8081", "--strictPort"],
      join(root, "frontend"), previewEnvironment(command, settings(join(root, "frontend"))));
  }
  if (command === "check" || ["agent", "gateway"].includes(command)) {
    for (const service of command === "check" ? ["agent", "gateway"] : [command]) {
      const directory = service === "gateway" ? join(root, "mcp-gateway") : join(root, "devise-agent", "devise-eye");
      const status = serviceStatus(service, settings(directory));
      console.log(`${service}: unavailable — ${status.reason}`);
      if (status.missing.length) console.log(`Missing settings: ${status.missing.join(", ")}`);
    }
    return command === "check" ? 0 : 1;
  }
  if (command === "api") {
    console.log("Local API on 127.0.0.1:8000. Event ingestion is explicitly unavailable until M1.");
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
    for (const requirements of ["requirements.txt", "devise-agent/devise-eye/requirements.txt"]) {
      const code = await run(python(), ["-m", "pip", "install", "-r", requirements]);
      if (code) return code;
    }
    return 0;
  }
  throw new Error(`Unknown development command: ${command}`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(process.argv[2] || "preview").then(code => { process.exitCode = code; }).catch(error => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
