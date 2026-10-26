import { afterEach, describe, expect, it, vi } from "vitest";
import { createPilotApi, PilotApiError } from "./pilotApi";

afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers(); });

describe("scoped pilot API", () => {
  it("uses the current access token and organization on each request", async () => {
    let org = "org-a";
    let token = "first";
    const requests: RequestInit[] = [];
    vi.stubGlobal("fetch", async (_url: string, init: RequestInit) => {
      requests.push(init);
      return new Response(JSON.stringify({ events: 3 }), { status: 200 });
    });
    const api = createPilotApi("http://localhost:8000", async () => token, () => org);
    expect(await api.request("/api/stats")).toEqual({ events: 3 });
    org = "org-b"; token = "second";
    await api.request("/api/devices");
    expect(new Headers(requests[0].headers).get("Authorization")).toBe("Bearer first");
    expect(new Headers(requests[1].headers).get("X-Organization-ID")).toBe("org-b");
    expect(new Headers(requests[1].headers).get("Authorization")).toBe("Bearer second");
  });

  it("surfaces server denial and expires the session on 401", async () => {
    let expired = false;
    vi.stubGlobal("fetch", async () => new Response(JSON.stringify({ detail: "Session expired" }), { status: 401 }));
    const api = createPilotApi("http://localhost:8000", async () => "token", () => "org", () => { expired = true; });
    await expect(api.request("/api/events")).rejects.toMatchObject({ message: "Session expired", status: 401 });
    expect(expired).toBe(true);
  });

  it("reports disconnection and never invents sample records", async () => {
    vi.stubGlobal("fetch", async () => { throw new TypeError("Failed to fetch"); });
    const api = createPilotApi("http://localhost:8000", async () => "token", () => "org");
    await expect(api.request("/api/events")).rejects.toBeInstanceOf(PilotApiError);
    await expect(api.request("/api/events")).rejects.toMatchObject({ status: 0 });
  });

  it("refuses unscoped tenant calls before network access", async () => {
    vi.stubGlobal("fetch", () => { throw new Error("Must not reach network"); });
    const api = createPilotApi("http://localhost:8000", async () => "token", () => "");
    await expect(api.request("/api/stats")).rejects.toThrow("Select an organization");
  });

  it("binds an in-flight request to its original organization while a token refresh waits", async () => {
    let organization = "a";
    let resolveToken: (value: string) => void = () => {};
    const token = new Promise<string>(resolve => { resolveToken = resolve; });
    let observedOrg = "";
    vi.stubGlobal("fetch", async (_url: string, init: RequestInit) => {
      observedOrg = new Headers(init.headers).get("X-Organization-ID") ?? "";
      return new Response("{}", { status: 200 });
    });
    const api = createPilotApi("http://localhost:8000", () => token, () => organization);
    const request = api.request("/api/enrollments", { method: "POST", body: { name: "Device A" } });
    organization = "b";
    resolveToken("token");
    await request;
    expect(observedOrg).toBe("a");
  });

  it("turns a hung API request into a visible timeout", async () => {
    vi.useFakeTimers();
    vi.stubGlobal("fetch", (_url: string, init: RequestInit) => new Promise((_resolve, reject) => {
      init.signal?.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")));
    }));
    const api = createPilotApi("http://localhost:8000", async () => "token", () => "a");
    const result = api.request("/api/stats");
    const failure = expect(result).rejects.toMatchObject({ status: 0, message: expect.stringContaining("timed out") });
    await vi.advanceTimersByTimeAsync(15001);
    await failure;
  });
});
