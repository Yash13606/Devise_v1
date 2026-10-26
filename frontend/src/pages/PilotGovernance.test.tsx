import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createPilotApi } from "@/lib/pilotApi";
import { PilotGovernance } from "./PilotGovernance";

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

it("creates a data-class redaction rule without requiring a literal secret", async () => {
  const created: Record<string, unknown>[] = [];
  vi.stubGlobal("fetch", async (url: string, init: RequestInit) => {
    const path = new URL(url).pathname;
    if (path === "/api/policies" && init.method === "POST") created.push(JSON.parse(String(init.body)));
    const body = path === "/api/policies" ? { version: 0, policies: [] } : path === "/api/reviews" ? { reviews: [] } : { entries: [] };
    return new Response(JSON.stringify(body), { status: 200 });
  });
  const api = createPilotApi("http://localhost:8000", async () => "token", () => "a");
  render(<QueryClientProvider client={new QueryClient()}><PilotGovernance api={api} prefix={["pilot", "a"]} role="admin" local /></QueryClientProvider>);
  fireEvent.change(screen.getByLabelText("Policy name"), { target: { value: "Redact credential patterns" } });
  fireEvent.change(screen.getByLabelText("Outcome"), { target: { value: "redact" } });
  fireEvent.change(screen.getByLabelText("Data class (optional)"), { target: { value: "credentials" } });
  expect(screen.getByLabelText("Literal text to match (optional)")).not.toBeRequired();
  fireEvent.click(screen.getByRole("button", { name: "Create policy" }));
  await screen.findByRole("button", { name: "Create policy" });
  expect(created).toEqual([{ name: "Redact credential patterns", outcome: "redact", data_class: "credentials", replacement: "[REDACTED]" }]);
});

it("shows latest audit outcomes, navigates older records and resets to newly arrived records", async () => {
  let newest = 205;
  const requests: string[] = [];
  vi.stubGlobal("fetch", async (url: string) => {
    const parsed = new URL(url);
    requests.push(parsed.pathname + parsed.search);
    const older = parsed.searchParams.get("before_sequence") === "6";
    const entry = { sequence: older ? 5 : newest, kind: older ? "older_outcome" : `latest_${newest}`, metadata: {}, created_at: "2026-10-26T00:00:00Z", previous_hash: "previous", entry_hash: String(older ? 5 : newest) };
    const body = parsed.pathname === "/api/policies" ? { version: 0, policies: [] } : parsed.pathname === "/api/reviews" ? { reviews: [] } : { entries: [entry], has_more: !older, next_before_sequence: older ? null : 6, order: "descending", chain_scope: "partial_window" };
    return new Response(JSON.stringify(body), { status: 200 });
  });
  const api = createPilotApi("http://localhost:8000", async () => "token", () => "a");
  render(<QueryClientProvider client={new QueryClient()}><PilotGovernance api={api} prefix={["pilot", "a"]} role="viewer" local /></QueryClientProvider>);
  expect(await screen.findByText(/#205 latest_205/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Older records" }));
  expect(await screen.findByText(/#5 older_outcome/)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Older records" })).toBeDisabled();
  newest = 206;
  fireEvent.click(screen.getByRole("button", { name: "Latest records" }));
  expect(await screen.findByText(/#206 latest_206/)).toBeInTheDocument();
  expect(requests).toContain("/api/audit?before_sequence=6");
  expect(screen.getByText(/partial history/i)).toBeInTheDocument();
});

it("requires explicit warning continuation before displaying an execution result", async () => {
  vi.stubGlobal("fetch", async (url: string) => {
    const path = new URL(url).pathname;
    const body = path === "/api/policies" ? { version: 1, policies: [] } : path === "/api/reviews" ? { reviews: [] } : path === "/api/audit" ? { entries: [] }
      : path === "/api/mcp/execute" ? { execution_id: "one", decision: "warn", status: "pending", policy_version: 1, continuation_token: "secret-once", expires_at: "2026-12-01T00:00:00Z" }
      : { execution_id: "one", decision: "warn", status: "executed", policy_version: 1, result: { jsonrpc: "2.0", id: "test", result: { content: [{ type: "text", text: "fixture-result" }] } } };
    return new Response(JSON.stringify(body), { status: 200 });
  });
  const api = createPilotApi("http://localhost:8000", async () => "token", () => "a");
  render(<QueryClientProvider client={new QueryClient()}><PilotGovernance api={api} prefix={["pilot", "a"]} role="admin" local /></QueryClientProvider>);
  fireEvent.change(screen.getByLabelText("Fixture text"), { target: { value: "sample" } });
  fireEvent.click(screen.getByRole("button", { name: "Evaluate fixture request" }));
  expect(await screen.findByRole("button", { name: "Acknowledge warning and continue" })).toBeInTheDocument();
  expect(screen.queryByText(/fixture-result/)).not.toBeInTheDocument();
  expect(screen.queryByText(/secret-once/)).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Acknowledge warning and continue" }));
  expect(await screen.findByText(/fixture-result/)).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Acknowledge warning and continue" })).not.toBeInTheDocument();
});

it("keeps policy mutations and execution unavailable to viewer memberships", async () => {
  vi.stubGlobal("fetch", async (url: string) => new Response(JSON.stringify(new URL(url).pathname === "/api/policies" ? { version: 0, policies: [] } : new URL(url).pathname === "/api/reviews" ? { reviews: [] } : { entries: [] }), { status: 200 }));
  const api = createPilotApi("http://localhost:8000", async () => "token", () => "a");
  render(<QueryClientProvider client={new QueryClient()}><PilotGovernance api={api} prefix={["pilot", "a"]} role="viewer" local /></QueryClientProvider>);
  expect(await screen.findByText("No policies configured")).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Create policy" })).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Evaluate fixture request" })).not.toBeInTheDocument();
});

it("reuses the same request ID when retrying an uncertain execution response", async () => {
  const ids: string[] = [];
  vi.stubGlobal("fetch", async (url: string, init: RequestInit) => {
    const path = new URL(url).pathname;
    if (path === "/api/mcp/execute") {
      ids.push(JSON.parse(String(init.body)).request_id);
      if (ids.length === 1) throw new TypeError("Response lost");
      return new Response(JSON.stringify({ execution_id: "one", decision: "allow", status: "succeeded", policy_version: 1 }), { status: 200 });
    }
    return new Response(JSON.stringify(path === "/api/policies" ? { version: 0, policies: [] } : path === "/api/reviews" ? { reviews: [] } : { entries: [] }), { status: 200 });
  });
  const api = createPilotApi("http://localhost:8000", async () => "token", () => "a");
  render(<QueryClientProvider client={new QueryClient()}><PilotGovernance api={api} prefix={["pilot", "a"]} role="admin" local /></QueryClientProvider>);
  fireEvent.click(screen.getByRole("button", { name: "Evaluate fixture request" }));
  fireEvent.click(await screen.findByRole("button", { name: "Retry" }));
  expect(await screen.findByText(/Status: succeeded/)).toBeInTheDocument();
  expect(ids).toHaveLength(2);
  expect(ids[0]).toBe(ids[1]);
});
