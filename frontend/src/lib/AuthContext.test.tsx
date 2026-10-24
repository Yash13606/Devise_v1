import { beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

const config = vi.hoisted(() => ({ isDemo: false, isConfigured: false }));
const realAuth = vi.hoisted(() => vi.fn());
vi.mock("./runtimeConfig", () => ({ runtimeConfig: config }));
vi.mock("@auth0/auth0-react", () => ({ useAuth0: realAuth }));
import { AuthProvider, useAuth } from "./AuthContext";

function Session() {
  const { user, isDemoMode } = useAuth();
  return <p>{user?.displayName ?? "Signed out"} · {isDemoMode ? "demo" : "live"}</p>;
}

beforeEach(() => {
  cleanup();
  localStorage.clear();
  config.isDemo = false;
  config.isConfigured = false;
  realAuth.mockReset();
});

describe("explicit demo authentication", () => {
  it("never creates a demo administrator from missing live configuration", () => {
    localStorage.setItem("devise_mock_user", JSON.stringify({ displayName: "Old demo admin" }));
    render(<AuthProvider><Session /></AuthProvider>);
    expect(screen.getByText("Signed out · live")).toBeInTheDocument();
    expect(realAuth).not.toHaveBeenCalled();
  });

  it("supports explicitly selected demo mode even with corrupt old demo storage", () => {
    config.isDemo = true;
    config.isConfigured = true;
    localStorage.setItem("devise_mock_user", "invalid-json");
    render(<AuthProvider><Session /></AuthProvider>);
    expect(screen.getByText("Demo Administrator · demo")).toBeInTheDocument();
    expect(realAuth).not.toHaveBeenCalled();
  });
});
