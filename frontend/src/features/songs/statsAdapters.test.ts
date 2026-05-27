import { describe, expect, it } from "vitest";
import type { SongLibraryStats } from "../../store/songsSlice";
import { getStatsAdapters } from "./statsAdapters";

describe("getStatsAdapters", () => {
  it("maps stats into dashboard ratios and top catalogue metadata", () => {
    const stats: SongLibraryStats = {
      totals: {
        songs: 9,
        artists: 3,
        albums: 6,
        genres: 2
      },
      songsByGenre: [
        { genre: "Ethio-jazz", songs: 6 },
        { genre: "Soul", songs: 3 }
      ],
      artists: [{ artist: "Mulatu Astatke", albums: 3, songs: 6 }],
      songsByAlbum: [{ album: "Ethiopiques", songs: 4 }]
    };

    expect(getStatsAdapters(stats)).toEqual({
      albumEntries: [["Ethiopiques", 4]],
      averageAlbumsPerArtist: "2.0",
      averageSongsPerAlbum: "1.5",
      averageSongsPerArtist: "3.0",
      genreEntries: [
        ["Ethio-jazz", 6],
        ["Soul", 3]
      ],
      topArtist: { artist: "Mulatu Astatke", albums: 3, songs: 6 },
      topGenre: { genre: "Ethio-jazz", songs: 6 }
    });
  });

  it("returns zero ratios and null leaders for empty statistics", () => {
    const stats: SongLibraryStats = {
      totals: {
        songs: 0,
        artists: 0,
        albums: 0,
        genres: 0
      },
      songsByGenre: [],
      artists: [],
      songsByAlbum: []
    };

    expect(getStatsAdapters(stats)).toMatchObject({
      averageAlbumsPerArtist: "0",
      averageSongsPerAlbum: "0",
      averageSongsPerArtist: "0",
      topArtist: null,
      topGenre: null
    });
  });
});
