import { beforeEach, describe, expect, it, vi } from "vitest";

const database = vi.hoisted(() => ({
  result: { data: [], count: 0, error: null } as {
    data: unknown[];
    count: number;
    error: { message: string } | null;
  },
  from: vi.fn(),
}));

vi.mock("@/lib/supabase", () => ({ supabase: { from: database.from } }));

import { fetchStats, updateMe, updateSettings, inviteTeamMember, resolveAlert, dismissAlert } from "./api";

beforeEach(() => {
  database.result = { data: [], count: 0, error: null };
  database.from.mockReset();
  database.from.mockReturnValue({ select: () => Promise.resolve(database.result) });
});

describe("honest dashboard evidence", () => {
  it("does not invent license counts or savings when the database is empty", async () => {
    const result = await fetchStats();
    expect(result.totalDetections).toBe(0);
    expect(result.potentialSavings).toBeUndefined();
    expect(result.zombieLicenses).toBeUndefined();
  });

  it("surfaces failed reads instead of returning apparently valid zero metrics", async () => {
    database.result.error = { message: "database unavailable" };
    await expect(fetchStats()).rejects.toThrow("database unavailable");
  });

  it.each([
    ["profile", () => updateMe({ full_name: "New name" })],
    ["settings", () => updateSettings({ monthly_budget: 200 })],
    ["invitation", () => inviteTeamMember("employee@example.test")],
    ["resolve alert", () => resolveAlert("event-1")],
    ["dismiss alert", () => dismissAlert("event-1")],
  ])("does not report a successful %s action when persistence is absent", async (_name, action) => {
    await expect(action()).rejects.toThrow(/not available|not implemented|unavailable/i);
    expect(database.from).not.toHaveBeenCalled();
  });
});
