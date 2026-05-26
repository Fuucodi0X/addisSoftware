import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  artworkUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SongListEnvelope {
  items: Song[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  genres: string[];
}

export interface SongLibraryStats {
  totals: {
    songs: number;
    artists: number;
    albums: number;
    genres: number;
  };
  songsByGenre: Array<{
    genre: string;
    songs: number;
  }>;
  artists: Array<{
    artist: string;
    songs: number;
    albums: number;
  }>;
  songsByAlbum: Array<{
    album: string;
    songs: number;
  }>;
}

export interface SongQueryParams {
  q: string;
  genre: string;
  page: number;
}

interface SongsState {
  items: Song[];
  genres: string[];
  query: SongQueryParams;
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  stats: SongLibraryStats;
  statsStatus: "idle" | "loading" | "succeeded" | "failed";
  statsError: string | null;
}

const initialState: SongsState = {
  items: [],
  genres: [],
  query: {
    q: "",
    genre: "",
    page: 1
  },
  page: 1,
  limit: 8,
  totalItems: 0,
  totalPages: 0,
  status: "idle",
  error: null,
  stats: {
    totals: {
      songs: 0,
      artists: 0,
      albums: 0,
      genres: 0
    },
    songsByGenre: [],
    artists: [],
    songsByAlbum: []
  },
  statsStatus: "idle",
  statsError: null
};

const songsSlice = createSlice({
  name: "songs",
  initialState,
  reducers: {
    fetchSongsRequested(state, action: PayloadAction<Partial<SongQueryParams> | undefined>) {
      state.query = {
        ...state.query,
        ...action.payload
      };
      state.status = "loading";
      state.error = null;
    },
    fetchSongsSucceeded(state, action: PayloadAction<SongListEnvelope>) {
      state.items = action.payload.items;
      state.genres = action.payload.genres;
      state.page = action.payload.page;
      state.limit = action.payload.limit;
      state.totalItems = action.payload.totalItems;
      state.totalPages = action.payload.totalPages;
      state.query.page = action.payload.page;
      state.status = "succeeded";
    },
    fetchSongsFailed(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
    fetchStatsRequested(state) {
      state.statsStatus = "loading";
      state.statsError = null;
    },
    fetchStatsSucceeded(state, action: PayloadAction<SongLibraryStats>) {
      state.stats = action.payload;
      state.statsStatus = "succeeded";
    },
    fetchStatsFailed(state, action: PayloadAction<string>) {
      state.statsStatus = "failed";
      state.statsError = action.payload;
    }
  }
});

export const {
  fetchSongsFailed,
  fetchSongsRequested,
  fetchSongsSucceeded,
  fetchStatsFailed,
  fetchStatsRequested,
  fetchStatsSucceeded
} = songsSlice.actions;
export const songsReducer = songsSlice.reducer;
