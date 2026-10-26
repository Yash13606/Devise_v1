import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("@/lib/runtimeConfig", () => ({ runtimeConfig: { isLocal: true, isConfigured: true, isDemo: false, apiUrl: "http://localhost:8000" } }));
import { AuthProvider } from "@/lib/AuthContext";
import { PilotWorkspace } from "./PilotWorkspace";
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

it("supports explicit local login, logout and a fresh login without restoring an old session", async () => {
  vi.stubGlobal("fetch", async (url: string) => {
    const path = new URL(url).pathname;
    const data = path === "/api/local/accounts" ? { accounts: [{ email: "admin@local.test", name: "Local admin" }] }
      : path === "/api/local/session" ? { access_token: "short-lived-token", token_type: "bearer", expires_in: 300 }
      : path === "/api/me" ? { subject: "local-admin", email: "admin@local.test", name: "Local admin", memberships: [{ org_id: "alpha", org_name: "Alpha", role: "admin" }] }
      : { events: 9, tools: 0, devices_online: 0, devices_total: 0, high_risk_events: 0 };
    return new Response(JSON.stringify(data), { status: 200 });
  });
  render(<QueryClientProvider client={new QueryClient()}><AuthProvider><PilotWorkspace /></AuthProvider></QueryClientProvider>);
  fireEvent.click(await screen.findByRole("button", { name: "Sign in locally" }));
  expect(await screen.findByText("9")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Sign out" }));
  expect(await screen.findByRole("heading", { name: "Sign in to your workspace" })).toBeInTheDocument();
  fireEvent.click(await screen.findByRole("button", { name: "Sign in locally" }));
  expect(await screen.findByText("9")).toBeInTheDocument();
  expect(localStorage.getItem("devise_local_token")).toBeNull();
});
