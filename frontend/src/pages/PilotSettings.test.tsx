import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createPilotApi } from "@/lib/pilotApi";
import { PilotSettings } from "./PilotSettings";

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
it("requires a server preview and exact confirmation before deleting expired events", async () => {
  const deleted: unknown[] = [];
  vi.stubGlobal("fetch", async (url: string, init: RequestInit) => {
    const path = new URL(url).pathname;
    const result = path === "/api/profile" ? { subject: "alice", email: "alice@test", name: "Alice" } : path === "/api/team" ? { members: [], provisioning: "operator_only", invitations_available: false }
      : path.endsWith("/preview") ? { preview_id: "preview-one", eligible_count: 3, has_more: false, cutoff: "2026-09-25T00:00:00Z", expires_at: "2026-10-25T00:05:00Z", confirmation: "DELETE EXPIRED EVENTS" }
      : path.endsWith("/delete") ? (deleted.push(JSON.parse(String(init.body))), { deleted: 3 })
      : { retention_days: 30, poll_interval_seconds: 30, heartbeat_interval_seconds: 30, monitoring_enabled: true, budget_minor: null, budget_currency: null };
    return new Response(JSON.stringify(result), { status: 200 });
  });
  const api = createPilotApi("http://localhost:8000", async () => "token", () => "a");
  render(<QueryClientProvider client={new QueryClient()}><PilotSettings api={api} prefix={["pilot", "a"]} admin /></QueryClientProvider>);
  fireEvent.click(screen.getByRole("button", { name: "Preview expired events" }));
  const confirm = await screen.findByLabelText("Deletion confirmation");
  const submit = screen.getByRole("button", { name: "Delete previewed events" });
  expect(submit).toBeDisabled();
  fireEvent.change(confirm, { target: { value: "delete" } });
  expect(submit).toBeDisabled();
  fireEvent.change(confirm, { target: { value: "DELETE EXPIRED EVENTS" } });
  fireEvent.click(submit);
  expect(await screen.findByText("Deleted 3 expired events")).toBeInTheDocument();
  expect(deleted).toEqual([{ preview_id: "preview-one", confirmation: "DELETE EXPIRED EVENTS" }]);
});
