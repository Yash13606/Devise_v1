import { beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, fireEvent } from "@testing-library/react";

const config = vi.hoisted(() => ({ isDemo: false, isConfigured: false, isLocal: false, apiUrl: "http://localhost:8000" }));
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
  config.isLocal = false;
  config.isConfigured = false;
  realAuth.mockReset();
  vi.unstubAllGlobals();
});

function LocalSession() {
  const { user, signInLocal, signOut, getAccessToken } = useAuth();
  return <><p>{user?.email ?? "No local session"}</p>
    <button onClick={() => void signInLocal("admin@local.test")}>Local login</button>
    <button onClick={() => void signOut()}>Logout</button>
    <button onClick={() => void getAccessToken().then(token => { document.title = token; })}>Read token</button></>;
}

it("creates a local session only after explicit backend login and removes it on logout", async () => {
  config.isLocal = true; config.isConfigured = true;
  vi.stubGlobal("fetch", async () => new Response(JSON.stringify({ access_token: "scoped-token", token_type: "bearer", expires_in: 300 }), { status: 200 }));
  render(<AuthProvider><LocalSession /></AuthProvider>);
  expect(screen.getByText("No local session")).toBeInTheDocument();
  fireEvent.click(screen.getByText("Local login"));
  expect(await screen.findByText("admin@local.test")).toBeInTheDocument();
  fireEvent.click(screen.getByText("Read token"));
  await new Promise(resolve => setTimeout(resolve, 0));
  expect(document.title).toBe("scoped-token");
  fireEvent.click(screen.getByText("Logout"));
  expect(await screen.findByText("No local session")).toBeInTheDocument();
  expect(localStorage.getItem("devise_local_token")).toBeNull();
  expect(realAuth).not.toHaveBeenCalled();
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
