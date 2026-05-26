import { fireEvent, render, screen, within } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { describe, expect, it } from "vitest";
import { App } from "./App";
import { songsReducer } from "./store/songsSlice";
import type { RootState } from "./store/store";

const appState = (overrides?: Partial<RootState["songs"]>): RootState["songs"] => ({
  items: [
    {
      id: "song-1",
      title: "Tizita",
      artist: "Mulatu Astatke",
      album: "Ethiopiques",
      genre: "Ethio-jazz",
      duration: "4:08",
      artworkUrl: null,
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z"
    },
    {
      id: "song-2",
      title: "Yene Habesha",
      artist: "Aster Aweke",
      album: "Kabu",
      genre: "Soul",
      duration: "3:45",
      artworkUrl: null,
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z"
    }
  ],
  genres: ["Ethio-jazz", "Soul"],
  query: {
    q: "",
    genre: "",
    page: 1
  },
  page: 1,
  limit: 8,
  totalItems: 2,
  totalPages: 1,
  status: "succeeded",
  error: null,
  mutationStatus: "idle",
  mutationError: null,
  stats: {
    totals: {
      songs: 2,
      artists: 2,
      albums: 2,
      genres: 2
    },
    songsByGenre: [],
    artists: [],
    songsByAlbum: []
  },
  statsStatus: "succeeded",
  statsError: null,
  ...overrides
});

const renderApp = (preloadedState?: { songs: RootState["songs"] }) => {
  const store = configureStore({
    reducer: {
      songs: songsReducer
    },
    preloadedState
  });

  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
};

describe("App", () => {
  it("renders the Song Library shell", () => {
    renderApp({ songs: appState() });

    expect(screen.getByRole("heading", { name: "Song Library" })).toBeTruthy();
    expect(screen.getByText("Song Catalog")).toBeTruthy();
    expect(screen.getByRole("table", { name: "Song Catalog" })).toBeTruthy();
  });

  it("updates the local selected Song footer when a Song is selected", () => {
    renderApp({ songs: appState() });

    const songRows = screen.getAllByRole("row");
    fireEvent.click(songRows[2]);

    const footer = document.getElementById("playback-footer-player") as HTMLElement | null;

    expect(footer).toBeTruthy();
    expect(within(footer as HTMLElement).getByText("Yene Habesha")).toBeTruthy();
    expect(within(footer as HTMLElement).getByText("Aster Aweke - Soul")).toBeTruthy();
  });

  it("opens the delete confirmation modal without blanking the app", () => {
    renderApp({ songs: appState() });

    fireEvent.click(screen.getAllByRole("button", { name: /del/i })[0]);

    const dialog = screen.getByRole("dialog", { name: "Delete this song?" });

    expect(dialog).toBeTruthy();
    expect(within(dialog).getByText("Tizita")).toBeTruthy();
    expect(within(dialog).getByText("Permanent action")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Song Library" })).toBeTruthy();
  });
});
