import type { SongRecord } from "./model.js";

export interface SongResponse {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  duration: string;
  artworkUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export const toSongResponse = (song: SongRecord): SongResponse => ({
  id: song._id.toString(),
  title: song.title,
  artist: song.artist,
  album: song.album,
  genre: song.genre,
  duration: song.duration,
  artworkUrl: song.artworkUrl ?? null,
  createdAt: song.createdAt.toISOString(),
  updatedAt: song.updatedAt.toISOString()
});
