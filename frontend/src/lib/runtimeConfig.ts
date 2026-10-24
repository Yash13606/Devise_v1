type Environment = Readonly<Record<string, string | boolean | undefined>>;

export function readRuntimeConfig(env: Environment) {
  const value = (key: string) => typeof env[key] === "string" ? env[key].trim() : "";
  const selectedMode = value("VITE_APP_MODE") || "live";
  const mode: "live" | "demo" = selectedMode === "demo" ? "demo" : "live";
  const issues: string[] = [];
  if (!["live", "demo"].includes(selectedMode)) issues.push("VITE_APP_MODE (use live or demo)");

  const supabaseUrl = value("VITE_SUPABASE_URL");
  const supabaseKey = value("VITE_SUPABASE_ANON_KEY");
  const authDomain = value("VITE_AUTH0_DOMAIN");
  const authClientId = value("VITE_AUTH0_CLIENT_ID");
  const authAudience = value("VITE_AUTH0_AUDIENCE");
  const configured = (input: string) => !!input && !/placeholder|your[-_ ]|replace[-_ ]|change[-_ ]/i.test(input);

  if (mode === "live") {
    let validUrl = false;
    try {
      const url = new URL(supabaseUrl);
      validUrl = configured(supabaseUrl) && (url.protocol === "https:" ||
        (url.protocol === "http:" && ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)));
    } catch { /* Report the key below, never its value. */ }
    if (!validUrl) issues.push("VITE_SUPABASE_URL");
    if (!configured(supabaseKey)) issues.push("VITE_SUPABASE_ANON_KEY");
    if (!configured(authDomain) || !/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(authDomain)) issues.push("VITE_AUTH0_DOMAIN");
    if (!configured(authClientId)) issues.push("VITE_AUTH0_CLIENT_ID");
    if (!configured(authAudience)) issues.push("VITE_AUTH0_AUDIENCE");
  }

  return { mode, isDemo: mode === "demo", isConfigured: issues.length === 0, issues,
    supabaseUrl, supabaseKey, authDomain, authClientId, authAudience };
}

export const runtimeConfig = readRuntimeConfig(import.meta.env);

// Enable only when M1 replaces unscoped direct-table access with authorized contracts.
export const liveDataAvailable = false;
export const liveDataMessage = "Live data is not available in this pilot preview. Device enrollment and organization access must be connected before monitoring can start.";
