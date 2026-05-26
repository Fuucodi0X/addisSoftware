import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "./App";

describe("App", () => {
  it("renders the Song Library shell", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "Song Library" })).toBeTruthy();
    expect(screen.getByText("Frontend online")).toBeTruthy();
  });
});
