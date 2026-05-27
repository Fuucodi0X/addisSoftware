import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AppContent } from "./App";
import { DesignSystemProvider } from "./design/DesignSystemProvider";
import {
  createSongRequested,
  deleteSongRequested,
  fetchSongsFailed,
  fetchSongsRequested,
  songsReducer,
  updateSongRequested
} from "./store/songsSlice";
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
    <DesignSystemProvider>
      <Provider store={store}>
        <AppContent />
      </Provider>
    </DesignSystemProvider>
  );

  return { store };
};

const settleMountEffects = async () => {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
};

afterEach(() => {
  window.localStorage.clear();
  vi.unstubAllGlobals();
});

describe("App", () => {
  it("renders Song table rows with catalogue metadata", () => {
    renderApp({ songs: appState() });

    const table = screen.getByRole("table", { name: "Song Catalog" });

    expect(within(table).getByText("Tizita")).toBeTruthy();
    expect(within(table).getByText("Mulatu Astatke")).toBeTruthy();
    expect(within(table).getByText("Ethiopiques")).toBeTruthy();
    expect(within(table).getByText("Ethio-jazz")).toBeTruthy();
    expect(within(table).getByText("4:08")).toBeTruthy();
    expect(within(table).getByText("Yene Habesha")).toBeTruthy();
  });

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
    expect(within(dialog).getAllByText("Tizita").length).toBeGreaterThan(0);
    expect(within(dialog).getByText("Permanent action")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Song Library" })).toBeTruthy();
  });

  it("cancels the delete confirmation modal without dispatching a delete request", async () => {
    const { store } = renderApp({ songs: appState() });
    const dispatchSpy = vi.spyOn(store, "dispatch");

    await settleMountEffects();
    dispatchSpy.mockClear();
    fireEvent.click(screen.getAllByRole("button", { name: /del/i })[0]);
    fireEvent.click(within(screen.getByRole("dialog", { name: "Delete this song?" })).getByRole("button", { name: "Cancel" }));

    expect(screen.queryByRole("dialog", { name: "Delete this song?" })).toBeNull();
    expect(dispatchSpy).not.toHaveBeenCalledWith(expect.objectContaining({ type: deleteSongRequested.type }));
  });

  it("dispatches create Song requests from the add modal", async () => {
    const { store } = renderApp({ songs: appState() });
    const dispatchSpy = vi.spyOn(store, "dispatch");

    await settleMountEffects();
    dispatchSpy.mockClear();
    fireEvent.click(screen.getByTitle("Add Song"));
    fireEvent.change(screen.getByLabelText(/Song Title/), { target: { value: "  Ambassel  " } });
    fireEvent.change(screen.getByLabelText(/Artist Name/), { target: { value: " Aster Aweke " } });
    fireEvent.change(screen.getByLabelText(/Album/), { target: { value: " Kabu " } });
    fireEvent.click(screen.getByRole("button", { name: "Pop" }));
    fireEvent.change(screen.getByLabelText(/Duration/), { target: { value: " 3:45 " } });
    fireEvent.change(document.getElementById("cover-url-input") as HTMLInputElement, { target: { value: "" } });
    fireEvent.submit(screen.getByRole("button", { name: "Save Song" }).closest("form") as HTMLFormElement);

    expect(dispatchSpy).toHaveBeenCalledWith(
      createSongRequested({
        title: "Ambassel",
        artist: "Aster Aweke",
        album: "Kabu",
        genre: "Pop",
        duration: "3:45",
        artworkUrl: null
      })
    );
  });

  it("dispatches update Song requests from the edit modal", async () => {
    const { store } = renderApp({ songs: appState() });
    const dispatchSpy = vi.spyOn(store, "dispatch");

    await settleMountEffects();
    dispatchSpy.mockClear();
    fireEvent.click(screen.getAllByRole("button", { name: /edit/i })[0]);
    fireEvent.change(screen.getByLabelText(/Song Title/), { target: { value: "Tizita Updated" } });
    fireEvent.click(screen.getByRole("button", { name: "Contemporary" }));
    fireEvent.submit(screen.getByRole("button", { name: "Update Record" }).closest("form") as HTMLFormElement);

    expect(dispatchSpy).toHaveBeenCalledWith(
      updateSongRequested({
        id: "song-1",
        song: {
          title: "Tizita Updated",
          artist: "Mulatu Astatke",
          album: "Ethiopiques",
          genre: "Contemporary",
          duration: "4:08",
          artworkUrl: null
        }
      })
    );
  });

  it("renders add modal validation errors through form feedback", async () => {
    const { store } = renderApp({ songs: appState() });
    const dispatchSpy = vi.spyOn(store, "dispatch");

    await settleMountEffects();
    dispatchSpy.mockClear();
    fireEvent.click(screen.getByTitle("Add Song"));
    fireEvent.change(screen.getByLabelText(/Song Title/), { target: { value: "Ambassel" } });
    fireEvent.change(screen.getByLabelText(/Artist Name/), { target: { value: "Aster Aweke" } });
    fireEvent.change(screen.getByLabelText(/Album/), { target: { value: "Kabu" } });
    fireEvent.click(screen.getByRole("button", { name: "Pop" }));
    fireEvent.change(screen.getByLabelText(/Duration/), { target: { value: "345" } });
    fireEvent.submit(screen.getByRole("button", { name: "Save Song" }).closest("form") as HTMLFormElement);

    const feedback = screen.getByRole("alert");

    expect(within(feedback).getByText("duration must use M:SS or MM:SS format.")).toBeTruthy();
    expect(dispatchSpy).not.toHaveBeenCalledWith(expect.objectContaining({ type: createSongRequested.type }));
  });

  it("dispatches delete Song requests from the confirmation modal", async () => {
    const { store } = renderApp({ songs: appState() });
    const dispatchSpy = vi.spyOn(store, "dispatch");

    await settleMountEffects();
    dispatchSpy.mockClear();
    fireEvent.click(screen.getAllByRole("button", { name: /del/i })[1]);
    fireEvent.click(within(screen.getByRole("dialog", { name: "Delete this song?" })).getByRole("button", { name: "Delete Song" }));

    expect(dispatchSpy).toHaveBeenCalledWith(deleteSongRequested({ id: "song-2" }));
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

  it("dispatches genre filter and page requests", async () => {
    const { store } = renderApp({
      songs: appState({
        page: 1,
        totalItems: 12,
        totalPages: 2
      })
    });

    await settleMountEffects();
    fireEvent.click(document.getElementById("filter-genre-pill-Soul") as HTMLButtonElement);

    expect(store.getState().songs.query).toMatchObject({ genre: "Soul", page: 1 });

    act(() => {
      store.dispatch({
        type: "songs/fetchSongsSucceeded",
        payload: {
          items: store.getState().songs.items,
          genres: ["Ethio-jazz", "Soul"],
          page: 1,
          limit: 8,
          totalItems: 12,
          totalPages: 2
        }
      });
    });

    fireEvent.click(screen.getByRole("button", { name: "Next" }));

    expect(store.getState().songs.query).toMatchObject({ genre: "Soul", page: 2 });
  });

  it("renders loading, empty, and error catalog states", () => {
    const { store } = renderApp({
      songs: appState({
        items: [],
        status: "loading",
        totalItems: 0,
        totalPages: 0
      })
    });

    expect(screen.getByText("Retrieving Song Library records...")).toBeTruthy();

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

    expect(screen.getByText("No Songs have been added yet.")).toBeTruthy();

    act(() => {
      store.dispatch(fetchSongsFailed("Song API returned 500"));
    });

    expect(screen.getByText("Connection Error")).toBeTruthy();
    expect(screen.getByText("Song API returned 500")).toBeTruthy();
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

  it("defaults to the system theme and stores a user theme toggle", () => {
    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: query === "(prefers-color-scheme: dark)",
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn()
    }));

    renderApp({ songs: appState() });

    const toggle = screen.getByRole("button", { name: "Switch to light theme" });

    expect(window.localStorage.getItem("addis-song-library-theme")).toBeNull();

    fireEvent.click(toggle);

    expect(window.localStorage.getItem("addis-song-library-theme")).toBe("light");
    expect(screen.getByRole("button", { name: "Switch to dark theme" })).toBeTruthy();
  });
});
