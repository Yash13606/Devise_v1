import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/lib/AuthContext", () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
  useAuth: () => ({ user: { uid: "demo-user" }, loading: false }),
}));
vi.mock("@/lib/runtimeConfig", () => ({
  runtimeConfig: { isDemo: true, isConfigured: true, issues: [] }, liveDataAvailable: false, liveDataMessage: "Unavailable",
}));
const scan = vi.hoisted(() => vi.fn(() => <div>Active scanner</div>));
vi.mock("./pages/UnderstandDashboard", () => ({ UnderstandDashboard: scan }));
import App from "./App";

describe("read-only demo routes", () => {
  it("never mounts the active scanner in demo mode", () => {
    vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    window.history.replaceState({}, "", "/understand");
    render(<App />);
    expect(screen.getByRole("heading", { name: "Code scanning is unavailable in this preview" })).toBeInTheDocument();
    expect(scan).not.toHaveBeenCalled();
  });
});
