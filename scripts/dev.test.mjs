import assert from "node:assert/strict";
import { test } from "node:test";
import { serviceStatus, previewEnvironment, localEnvironment } from "./dev.mjs";

test("preview defaults to live instead of granting demo access", () => {
  assert.equal(previewEnvironment("preview", {}).VITE_APP_MODE, "live");
  assert.equal(previewEnvironment("demo", {}).VITE_APP_MODE, "demo");
});

test("incomplete live services list key names without leaking values", () => {
  const status = serviceStatus("gateway", { SUPABASE_SERVICE_ROLE_KEY: "secret-must-not-print" });
  assert.equal(status.ready, false);
  assert.ok(status.missing.includes("DEVISE_API_URL"));
  assert.ok(!JSON.stringify(status).includes("secret-must-not-print"));
});

test("configuration alone does not establish an enrolled running agent", () => {
  const env = { AUTH0_DOMAIN: "tenant.auth0.com", AUTH0_AUDIENCE: "audience", SUPABASE_URL: "https://tenant.supabase.co", SUPABASE_SERVICE_ROLE_KEY: "server-only", SUPABASE_KEY: "agent-key" };
  assert.equal(serviceStatus("gateway", env).ready, false);
  assert.equal(serviceStatus("agent", env).ready, false);
  assert.match(serviceStatus("agent", env).reason, /enroll/i);
});

test("local startup is explicit and cannot replace production settings", () => {
  const env = localEnvironment({ unrelated: "kept" });
  assert.equal(env.VITE_APP_MODE, "local");
  assert.equal(env.VITE_API_URL, "http://127.0.0.1:8000");
  assert.equal(env.unrelated, "kept");
  assert.throws(() => localEnvironment({ APP_ENV: "production" }), /production/);
});
