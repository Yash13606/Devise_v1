import { describe, expect, it } from "vitest";
import { readRuntimeConfig } from "./runtimeConfig";

const liveEnvironment = {
  VITE_APP_MODE: "live",
  VITE_SUPABASE_URL: "https://example-project.supabase.co",
  VITE_SUPABASE_ANON_KEY: "public-browser-key",
  VITE_AUTH0_DOMAIN: "devise-test.auth0.com",
  VITE_AUTH0_CLIENT_ID: "browser-client",
  VITE_AUTH0_AUDIENCE: "https://api.devise.test",
};

describe("runtime configuration", () => {
  it("defaults to live and reports missing keys without granting demo access", () => {
    const config = readRuntimeConfig({});
    expect(config.mode).toBe("live");
    expect(config.isDemo).toBe(false);
    expect(config.issues).toContain("VITE_AUTH0_DOMAIN");
    expect(config.isConfigured).toBe(false);
  });

  it("requires an explicit demo choice and needs no external credentials for that preview", () => {
    const config = readRuntimeConfig({ VITE_APP_MODE: "demo" });
    expect(config.isDemo).toBe(true);
    expect(config.isConfigured).toBe(true);
  });

  it("accepts configured live credentials but rejects placeholders and malformed origins", () => {
    expect(readRuntimeConfig(liveEnvironment).isConfigured).toBe(true);
    const invalid = readRuntimeConfig({
      ...liveEnvironment,
      VITE_SUPABASE_URL: "not-a-url",
      VITE_AUTH0_DOMAIN: "placeholder.auth0.com",
    });
    expect(invalid.issues).toContain("VITE_SUPABASE_URL");
    expect(invalid.issues).toContain("VITE_AUTH0_DOMAIN");
    expect(invalid.isDemo).toBe(false);
  });

  it("rejects an unknown mode instead of interpreting it as demo", () => {
    const config = readRuntimeConfig({ ...liveEnvironment, VITE_APP_MODE: "dmeo" });
    expect(config.isDemo).toBe(false);
    expect(config.issues).toContain("VITE_APP_MODE (use live or demo)");
  });

  it("does not include configured secret values in validation errors", () => {
    const config = readRuntimeConfig({ VITE_SUPABASE_ANON_KEY: "private-test-value" });
    expect(config.issues.join(" ")).not.toContain("private-test-value");
  });
});
