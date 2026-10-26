type Environment = Readonly<Record<string, string | boolean | undefined>>;

export function readRuntimeConfig(env: Environment, browserHostname = globalThis.location?.hostname ?? "") {
  const value = (key: string) => typeof env[key] === "string" ? env[key].trim() : "";
  const selectedMode = value("VITE_APP_MODE") || "live";
  const mode: "live" | "local" | "demo" = selectedMode === "demo" ? "demo" : selectedMode === "local" ? "local" : "live";
  const issues: string[] = [];
  if (!["live", "local", "demo"].includes(selectedMode)) issues.push("VITE_APP_MODE (use live, local or demo)");
  const apiUrl = value("VITE_API_URL").replace(/\/$/, "");

  const supabaseUrl = value("VITE_SUPABASE_URL");
  const supabaseKey = value("VITE_SUPABASE_ANON_KEY");
  const authDomain = value("VITE_AUTH0_DOMAIN");
  const authClientId = value("VITE_AUTH0_CLIENT_ID");
  const authAudience = value("VITE_AUTH0_AUDIENCE");
  const configured = (input: string) => !!input && !/placeholder|your[-_ ]|replace[-_ ]|change[-_ ]/i.test(input);

  const loopback = (hostname: string) => ["localhost", "127.0.0.1", "[::1]", "::1"].includes(hostname);
  if (mode !== "demo") {
    let validUrl = false;
    try {
      const url = new URL(apiUrl);
      validUrl = configured(apiUrl) && !url.username && !url.password && !url.search && !url.hash && url.pathname === "/" &&
        (mode === "local" ? loopback(url.hostname) && ["http:", "https:"].includes(url.protocol) :
          url.protocol === "https:" || (url.protocol === "http:" && loopback(url.hostname)));
    } catch { /* Report the key below, never its value. */ }
    if (!validUrl) issues.push("VITE_API_URL");
  }
  if (mode === "local" && (env.DEV !== true || !loopback(browserHostname))) issues.push("Local mode requires a Vite development server and loopback browser");
  if (mode === "live") {
    if (!configured(authDomain) || !/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(authDomain)) issues.push("VITE_AUTH0_DOMAIN");
    if (!configured(authClientId)) issues.push("VITE_AUTH0_CLIENT_ID");
    if (!configured(authAudience)) issues.push("VITE_AUTH0_AUDIENCE");
  }

  return { mode, isDemo: mode === "demo", isLocal: mode === "local", apiUrl, isConfigured: issues.length === 0, issues,
    supabaseUrl, supabaseKey, authDomain, authClientId, authAudience };
}

export const runtimeConfig = readRuntimeConfig(import.meta.env);

// Legacy direct-table consumers stay disabled. PilotWorkspace uses the trusted
// API and its own authenticated contracts; never re-enable unscoped table access.
export const liveDataAvailable = false;
export const liveDataMessage = "Configure the trusted API and authentication to use the live workspace. For this machine, npm run dev:local starts PostgreSQL and the explicit development login. Direct browser database access is disabled.";
