export interface Membership { org_id: string; org_name: string; role: string }
export interface PilotProfile { subject: string; email: string; name: string; memberships: Membership[] }
export interface PilotDevice {
  id: string; org_id: string; name: string; hostname: string; os_version: string; agent_version: string;
  last_seen: string | null; queue_depth: number; revoked_at: string | null; monitoring_enabled: boolean;
}
export interface PilotEvent {
  event_id: string; timestamp: string; tool_name: string; domain: string; category: string; vendor: string;
  risk_level: "low" | "medium" | "high"; source: string; process_name: string; evidence_method: string;
  confidence: number; org_id: string; device_id: string;
}
export interface PilotStats { events: number; tools: number; devices_online: number; devices_total: number; high_risk_events: number }

export class PilotApiError extends Error {
  constructor(message: string, public readonly status: number) { super(message); this.name = "PilotApiError"; }
}

export function createPilotApi(baseUrl: string, getToken: () => Promise<string>, getOrg: () => string, onUnauthorized?: () => void) {
  return {
    async request<T>(path: string, options: { method?: string; body?: unknown; signal?: AbortSignal; public?: boolean; unscoped?: boolean } = {}): Promise<T> {
      if (!path.startsWith("/api/")) throw new PilotApiError("Unsupported API path", 0);
      const headers = new Headers({ Accept: "application/json" });
      if (!options.public) {
        // Snapshot scope before token renewal yields; switching organizations cannot retarget an action.
        const org = options.unscoped ? "" : getOrg();
        if (!options.unscoped && !org) throw new PilotApiError("Select an organization", 0);
        const token = await getToken();
        if (!token) throw new PilotApiError("Sign in to continue", 401);
        headers.set("Authorization", `Bearer ${token}`);
        if (!options.unscoped) {
          headers.set("X-Organization-ID", org);
        }
      }
      if (options.body !== undefined) headers.set("Content-Type", "application/json");
      let response: Response;
      let data: unknown;
      const controller = new AbortController();
      let timedOut = false;
      const abort = () => controller.abort();
      if (options.signal?.aborted) throw new DOMException("Aborted", "AbortError");
      options.signal?.addEventListener("abort", abort, { once: true });
      const timeout = setTimeout(() => { timedOut = true; controller.abort(); }, 15000);
      try {
        response = await fetch(`${baseUrl}${path}`, { method: options.method ?? "GET", headers,
          body: options.body === undefined ? undefined : JSON.stringify(options.body), signal: controller.signal,
          credentials: "omit", cache: "no-store" });
        data = await response.json().catch(() => null);
      } catch (error) {
        if (timedOut) throw new PilotApiError("API request timed out. Check the service, then retry.", 0);
        if (error instanceof Error && error.name === "AbortError") throw error;
        throw new PilotApiError("API disconnected. Check the local services, then retry.", 0);
      } finally {
        clearTimeout(timeout);
        options.signal?.removeEventListener("abort", abort);
      }
      if (!response.ok) {
        if (response.status === 401) onUnauthorized?.();
        const detail = data && typeof data === "object" && "detail" in data ? data.detail : null;
        throw new PilotApiError(typeof detail === "string" ? detail : `Request failed (${response.status})`, response.status);
      }
      if (data === null) throw new PilotApiError("API returned an invalid response", response.status);
      return data as T;
    },
  };
}
export type PilotApi = ReturnType<typeof createPilotApi>;
