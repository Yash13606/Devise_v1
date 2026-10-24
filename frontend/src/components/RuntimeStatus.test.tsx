import { beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

const config = vi.hoisted(() => ({ isDemo: false, isConfigured: false, issues: ["VITE_AUTH0_DOMAIN"] }));
vi.mock("@/lib/runtimeConfig", () => ({ runtimeConfig: config, liveDataMessage: "Live monitoring is unavailable." }));
import { PreviewNotice, ReadOnlyPreview, SetupRequired } from "./RuntimeStatus";

beforeEach(() => { cleanup(); config.isDemo = false; config.isConfigured = false; config.issues = ["VITE_AUTH0_DOMAIN"]; });

describe("pilot status", () => {
  it("names missing keys and a working way back without exposing values", () => {
    render(<MemoryRouter><SetupRequired /></MemoryRouter>);
    expect(screen.getByRole("heading", { name: "Live configuration is required" })).toBeInTheDocument();
    expect(screen.getByText("VITE_AUTH0_DOMAIN")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Return to the website" })).toHaveAttribute("href", "/");
  });

  it("labels demo as read-only and distinguishes it from live monitoring", () => {
    config.isDemo = true;
    render(<PreviewNotice />);
    expect(screen.getByRole("status")).toHaveTextContent("read-only sample screens");
    expect(screen.getByRole("status")).toHaveTextContent("No live monitoring or saved changes");
  });

  it("prevents preview buttons and custom click handlers from pretending to save", () => {
    config.isDemo = true;
    const save = vi.fn();
    render(<ReadOnlyPreview><button onClick={save}>Save subscription</button><div onClick={save}>Custom save</div></ReadOnlyPreview>);
    expect(screen.getByRole("button", { name: "Save subscription" })).toBeDisabled();
    fireEvent.click(screen.getByText("Custom save"));
    expect(save).not.toHaveBeenCalled();
  });
});
