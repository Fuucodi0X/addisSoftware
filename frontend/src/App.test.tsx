import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { describe, expect, it } from "vitest";
import { App } from "./App";
import { songsReducer } from "./store/songsSlice";

const renderApp = () => {
  const store = configureStore({
    reducer: {
      songs: songsReducer
    }
  });

  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
};

describe("App", () => {
  it("renders the Song Library shell", () => {
    renderApp();

    expect(screen.getByRole("heading", { name: "Song Library" })).toBeTruthy();
    expect(screen.getByText("Frontend online")).toBeTruthy();
    expect(screen.getByRole("table", { name: "Persisted Songs" })).toBeTruthy();
  });
});
