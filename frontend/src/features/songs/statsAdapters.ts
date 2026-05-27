import type { SongLibraryStats } from "../../store/songsSlice";

export const getStatsAdapters = (stats: SongLibraryStats) => {
  const genreEntries = stats.songsByGenre.map((item) => [item.genre, item.songs] as const);
  const albumEntries = stats.songsByAlbum.map((item) => [item.album, item.songs] as const);
  const topArtist = stats.artists[0] ?? null;
  const topGenre = stats.songsByGenre[0] ?? null;

  return {
    albumEntries,
    averageAlbumsPerArtist:
      stats.totals.artists > 0 ? (stats.totals.albums / stats.totals.artists).toFixed(1) : "0",
    averageSongsPerAlbum:
      stats.totals.albums > 0 ? (stats.totals.songs / stats.totals.albums).toFixed(1) : "0",
    averageSongsPerArtist:
      stats.totals.artists > 0 ? (stats.totals.songs / stats.totals.artists).toFixed(1) : "0",
    genreEntries,
    topArtist,
    topGenre
  };
};

export type SongStatsAdapters = ReturnType<typeof getStatsAdapters>;
