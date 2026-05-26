import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { describe, expect, it, vi } from "vitest";
import { App } from "./App";
import { fetchSongsRequested, songsReducer } from "./store/songsSlice";
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

  return { store };
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

  it("debounces search requests while keeping the search input focused", () => {
    vi.useFakeTimers();

    try {
      const { store } = renderApp({ songs: appState() });
      const dispatchSpy = vi.spyOn(store, "dispatch");
      const searchInput = screen.getByRole("searchbox") as HTMLInputElement;

      dispatchSpy.mockClear();
      searchInput.focus();
      fireEvent.change(searchInput, { target: { value: "t" } });
      fireEvent.change(searchInput, { target: { value: "ti" } });
      fireEvent.change(searchInput, { target: { value: "tiz" } });

      expect(document.activeElement).toBe(searchInput);
      expect(dispatchSpy).not.toHaveBeenCalledWith(fetchSongsRequested({ q: "tiz", page: 1 }));

      act(() => {
        vi.advanceTimersByTime(350);
      });

      const searchRequests = dispatchSpy.mock.calls.filter(
        ([action]) =>
          action.type === fetchSongsRequested.type &&
          (action.payload as { q?: string } | undefined)?.q !== undefined
      );

      expect(searchRequests).toHaveLength(1);
      expect(dispatchSpy).toHaveBeenCalledWith(fetchSongsRequested({ q: "tiz", page: 1 }));
      expect(document.activeElement).toBe(searchInput);

      dispatchSpy.mockClear();
      fireEvent.mouseDown(screen.getByRole("button", { name: "Clear search" }));
      fireEvent.click(screen.getByRole("button", { name: "Clear search" }));

      expect(searchInput.value).toBe("");
      expect(document.activeElement).toBe(searchInput);
      expect(dispatchSpy).not.toHaveBeenCalledWith(fetchSongsRequested({ q: "", page: 1 }));

      act(() => {
        vi.advanceTimersByTime(350);
      });

      expect(dispatchSpy).toHaveBeenCalledWith(fetchSongsRequested({ q: "", page: 1 }));
      expect(document.activeElement).toBe(searchInput);
    } finally {
      vi.useRealTimers();
    }
  });

  it("keeps the catalog controls mounted when clearing an empty search result", () => {
    vi.useFakeTimers();

    try {
      const { store } = renderApp({
        songs: appState({
          items: [],
          query: {
            q: "missing",
            genre: "",
            page: 1
          },
          totalItems: 0,
          totalPages: 0
        })
      });
      const dispatchSpy = vi.spyOn(store, "dispatch");
      const searchInput = screen.getByRole("searchbox") as HTMLInputElement;

      act(() => {
        store.dispatch({
          type: "songs/fetchSongsSucceeded",
          payload: {
            items: [],
            genres: ["Ethio-jazz", "Soul"],
            page: 1,
            limit: 8,
            totalItems: 0,
            totalPages: 0
          }
        });
      });

      dispatchSpy.mockClear();
      searchInput.focus();
      fireEvent.click(screen.getByRole("button", { name: "Clear search" }));

      act(() => {
        vi.advanceTimersByTime(350);
      });

      expect(screen.getByRole("searchbox")).toBe(searchInput);
      expect(screen.getByRole("heading", { name: "Song Catalog" })).toBeTruthy();
      expect(screen.queryByText("Retrieving Song Library records...")).toBeNull();
      expect(document.activeElement).toBe(searchInput);
    } finally {
      vi.useRealTimers();
    }
  });

  it("keeps the last selected Song in the footer when search has no results", () => {
    const { store } = renderApp({ songs: appState() });

    fireEvent.click(screen.getAllByRole("row")[2]);

    act(() => {
      store.dispatch({
        type: "songs/fetchSongsSucceeded",
        payload: {
          items: [],
          genres: ["Ethio-jazz", "Soul"],
          page: 1,
          limit: 8,
          totalItems: 0,
          totalPages: 0
        }
      });
    });

    const footer = document.getElementById("playback-footer-player") as HTMLElement | null;

    expect(footer).toBeTruthy();
    expect(within(footer as HTMLElement).getByText("Yene Habesha")).toBeTruthy();
    expect(within(footer as HTMLElement).getByText("Aster Aweke - Soul")).toBeTruthy();
    expect(within(footer as HTMLElement).queryByText("Select any Song from your Library to focus it.")).toBeNull();
  });
});
