import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DesignSystemProvider } from "../../../design/DesignSystemProvider";
import type { SongLibraryStats } from "../../../store/songsSlice";
import { StatsDashboard } from "./StatsDashboard";

const stats: SongLibraryStats = {
  totals: {
    songs: 6,
    artists: 2,
    albums: 3,
    genres: 2
  },
  songsByGenre: [
    { genre: "Ethio-jazz", songs: 4 },
    { genre: "Soul", songs: 2 }
  ],
  artists: [
    { artist: "Mulatu Astatke", albums: 2, songs: 4 },
    { artist: "Aster Aweke", albums: 1, songs: 2 }
  ],
  songsByAlbum: [
    { album: "Ethiopiques", songs: 3 },
    { album: "Kabu", songs: 2 },
    { album: "Sketches", songs: 1 }
  ]
};

const renderStatsDashboard = (props?: Partial<Parameters<typeof StatsDashboard>[0]>) => {
  const onBack = vi.fn();

  render(
    <DesignSystemProvider>
      <StatsDashboard error={null} onBack={onBack} stats={stats} status="succeeded" {...props} />
    </DesignSystemProvider>
  );

  return { onBack };
};

describe("StatsDashboard", () => {
  it("renders Song, Artist, Album, and Genre summaries", () => {
    const { onBack } = renderStatsDashboard();

    expect(screen.getByRole("heading", { name: "KPI Metrics Summary" })).toBeTruthy();
    expect(screen.getByText("Catalogue-level Song, Artist, Album, and Genre distribution.")).toBeTruthy();
    expect(screen.getByText("Songs")).toBeTruthy();
    expect(screen.getByText("Artists")).toBeTruthy();
    expect(screen.getByText("Albums")).toBeTruthy();
    expect(screen.getByText("Genres")).toBeTruthy();
    expect(screen.getAllByText("Ethio-jazz").length).toBeGreaterThan(0);
    expect(screen.getByText("Main Catalog Genre")).toBeTruthy();
    expect(screen.getAllByText(/Mulatu Astatke/).length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: "Back to Catalog" }));

    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("switches between Artist and Album metadata directories", () => {
    renderStatsDashboard();

    const directory = screen.getByRole("table");

    expect(within(directory).getByText("Artist Name")).toBeTruthy();
    expect(within(directory).getByText("Mulatu Astatke")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Albums (3)" }));

    expect(screen.getByRole("heading", { name: "Album Volume Directory" })).toBeTruthy();
    expect(within(directory).getByText("Album Title")).toBeTruthy();
    expect(within(directory).getByText("Ethiopiques")).toBeTruthy();
  });

  it("renders loading and error states", () => {
    const { rerender } = render(
      <DesignSystemProvider>
        <StatsDashboard error={null} onBack={vi.fn()} stats={stats} status="loading" />
      </DesignSystemProvider>
    );

    expect(screen.getByText("Calculating catalog telemetry...")).toBeTruthy();

    rerender(
      <DesignSystemProvider>
        <StatsDashboard error="Stats API returned 500" onBack={vi.fn()} stats={stats} status="failed" />
      </DesignSystemProvider>
    );

    expect(screen.getByText("Unable to load statistics")).toBeTruthy();
    expect(screen.getByText("Stats API returned 500")).toBeTruthy();
  });
});
