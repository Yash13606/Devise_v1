import assert from "node:assert/strict";
import { test } from "node:test";
import { serviceStatus, previewEnvironment } from "./dev.mjs";

test("preview defaults to live instead of granting demo access", () => {
  assert.equal(previewEnvironment("preview", {}).VITE_APP_MODE, "live");
  assert.equal(previewEnvironment("demo", {}).VITE_APP_MODE, "demo");
});

test("incomplete live services list key names without leaking values", () => {
  const status = serviceStatus("gateway", { SUPABASE_SERVICE_ROLE_KEY: "secret-must-not-print" });
  assert.equal(status.ready, false);
  assert.ok(status.missing.includes("AUTH0_DOMAIN"));
  assert.ok(!JSON.stringify(status).includes("secret-must-not-print"));
});

test("credentials alone do not make unfinished enforcement or monitoring ready", () => {
  const env = { AUTH0_DOMAIN: "tenant.auth0.com", AUTH0_AUDIENCE: "audience", SUPABASE_URL: "https://tenant.supabase.co", SUPABASE_SERVICE_ROLE_KEY: "server-only", SUPABASE_KEY: "agent-key" };
  assert.equal(serviceStatus("gateway", env).ready, false);
  assert.equal(serviceStatus("agent", env).ready, false);
  assert.match(serviceStatus("agent", env).reason, /enrollment|ingestion/i);
});
