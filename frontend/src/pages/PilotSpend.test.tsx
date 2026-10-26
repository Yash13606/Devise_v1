import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createPilotApi } from "@/lib/pilotApi";
import { PilotSpend } from "./PilotSpend";

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

it("keeps totals separate by currency and exposes periods with unknown usage", async () => {
  vi.stubGlobal("fetch", async () => new Response(JSON.stringify({ total: 0, records: [], totals: [
    { currency: "USD", period_start: "2026-10-01", period_end: "2026-10-31", amount_minor: 1250 },
    { currency: "JPY", period_start: "2026-10-01", period_end: "2026-10-31", amount_minor: 300 },
  ], usage_available: false }), { status: 200 }));
  const api = createPilotApi("http://localhost:8000", async () => "token", () => "a");
  render(<QueryClientProvider client={new QueryClient()}><PilotSpend api={api} prefix={["pilot", "a"]} admin={false} /></QueryClientProvider>);
  expect(await screen.findByText("$12.50")).toBeInTheDocument();
  expect(screen.getByText("¥300")).toBeInTheDocument();
  expect(screen.getByText(/Usage and verified savings are unavailable/)).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Import CSV" })).not.toBeInTheDocument();
});

it("imports CSV through the scoped API and displays accepted and duplicate counts", async () => {
  let imported: unknown;
  vi.stubGlobal("fetch", async (url: string, init: RequestInit) => {
    if (url.endsWith("/csv")) { imported = JSON.parse(String(init.body)); return new Response(JSON.stringify({ accepted: 1, duplicates: 2 }), { status: 200 }); }
    return new Response(JSON.stringify({ total: 0, records: [], totals: [], usage_available: false }), { status: 200 });
  });
  const api = createPilotApi("http://localhost:8000", async () => "token", () => "a");
  render(<QueryClientProvider client={new QueryClient()}><PilotSpend api={api} prefix={["pilot", "a"]} admin /></QueryClientProvider>);
  fireEvent.change(screen.getByLabelText("CSV records"), { target: { value: "source_id,kind,vendor\nsource-1,invoice,Acme" } });
  fireEvent.click(screen.getByRole("button", { name: "Import CSV" }));
  expect(await screen.findByText("Accepted 1 · Duplicates 2")).toBeInTheDocument();
  expect(imported).toEqual({ csv: "source_id,kind,vendor\nsource-1,invoice,Acme" });
});

it("can read later pages without changing currency period totals", async () => {
  vi.stubGlobal("fetch", async (url: string) => new Response(JSON.stringify({ total: 201, records: [{ id: "one", source_id: "source", kind: "invoice", vendor: new URL(url).searchParams.get("offset") === "200" ? "Later vendor" : "First vendor", amount_minor: 100, currency: "USD", period_start: "2026-10-01", period_end: "2026-10-31", source: "invoice" }], totals: [], usage_available: false }), { status: 200 }));
  const api = createPilotApi("http://localhost:8000", async () => "token", () => "a");
  render(<QueryClientProvider client={new QueryClient()}><PilotSpend api={api} prefix={["pilot", "a"]} admin={false} /></QueryClientProvider>);
  expect(await screen.findByText("First vendor")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Next records" }));
  expect(await screen.findByText("Later vendor")).toBeInTheDocument();
});
