import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const auth = vi.hoisted(() => ({
  user: { uid: "alice", email: "alice@test", displayName: "Alice" }, loading: false,
  getAccessToken: async () => "token", signOut: vi.fn(), expireSession: vi.fn(),
  signInLocal: vi.fn(), signIn: vi.fn(), refreshSession: vi.fn(),
}));
vi.mock("@/lib/AuthContext", () => ({ useAuth: () => auth }));
vi.mock("@/lib/runtimeConfig", () => ({ runtimeConfig: { isLocal: true, apiUrl: "http://localhost:8000" } }));
import { PilotWorkspace } from "./PilotWorkspace";

const me = { subject: "alice", email: "alice@test", name: "Alice", memberships: [
  { org_id: "a", org_name: "Organization A", role: "admin" },
  { org_id: "b", org_name: "Organization B", role: "viewer" },
] };
let requests: { path: string; org: string | null; method: string }[];
beforeEach(() => {
  requests = [];
  vi.stubGlobal("fetch", async (url: string, init: RequestInit) => {
    const path = new URL(url).pathname;
    const org = new Headers(init.headers).get("X-Organization-ID");
    requests.push({ path, org, method: init.method ?? "GET" });
    const data = path === "/api/me" ? me : path === "/api/stats" ? { events: org === "a" ? 7 : 2, tools: 1, devices_online: 0, devices_total: 0, high_risk_events: 0 }
      : path === "/api/events" ? { total: 0, events: [] } : path === "/api/devices" ? { devices: [] } : {};
    return new Response(JSON.stringify(data), { status: 200 });
  });
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
function mount() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
  render(<QueryClientProvider client={client}><PilotWorkspace /></QueryClientProvider>);
  return client;
}

it("loads actual tenant metrics and clears administrator actions when switching organizations", async () => {
  mount();
  expect(await screen.findByText("7")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Devices" }));
  expect(await screen.findByText("No enrolled devices")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Create enrollment token" })).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText("Organization"), { target: { value: "b" } });
  await waitFor(() => expect(screen.queryByRole("button", { name: "Create enrollment token" })).not.toBeInTheDocument());
  expect(await screen.findByText(/Administrator permission is required/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Overview" }));
  expect(await screen.findByText("2")).toBeInTheDocument();
  expect(requests.filter(request => request.path === "/api/stats").map(request => request.org)).toEqual(["a", "b"]);
});

it("shows a disconnected retry screen when the API is unavailable", async () => {
  vi.stubGlobal("fetch", async () => { throw new TypeError("Network offline"); });
  mount();
  expect(await screen.findByRole("alert")).toHaveTextContent("API disconnected");
  expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  expect(screen.queryByText("Demo Administrator")).not.toBeInTheDocument();
});

it("clears cached tenant data on logout", async () => {
  const client = mount();
  expect(await screen.findByText("7")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Sign out" }));
  await waitFor(() => expect(client.getQueryCache().getAll()).toHaveLength(0));
  expect(auth.signOut).toHaveBeenCalled();
});

it("discards enrollment credentials when the organization changes", async () => {
  const originalFetch = globalThis.fetch;
  vi.stubGlobal("fetch", async (url: string, init: RequestInit) => url.endsWith("/api/enrollments")
    ? new Response(JSON.stringify({ enrollment_token: "one-time-device-secret", expires_at: "2026-12-01T00:00:00Z" }), { status: 200 })
    : originalFetch(url, init));
  const client = mount();
  expect(await screen.findByText("7")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Devices" }));
  fireEvent.change(screen.getByLabelText("Device name"), { target: { value: "Office workstation" } });
  fireEvent.click(screen.getByRole("button", { name: "Create enrollment token" }));
  expect(await screen.findByText("one-time-device-secret")).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText("Organization"), { target: { value: "b" } });
  await waitFor(() => expect(screen.queryByText("one-time-device-secret")).not.toBeInTheDocument());
  expect(client.getMutationCache().getAll().some(item => JSON.stringify(item.state.data).includes("one-time-device-secret"))).toBe(false);
});
