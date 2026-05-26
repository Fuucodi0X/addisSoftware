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
}

interface SongsState {
  items: Song[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: SongsState = {
  items: [],
  page: 1,
  limit: 50,
  totalItems: 0,
  totalPages: 0,
  status: "idle",
  error: null
};

const songsSlice = createSlice({
  name: "songs",
  initialState,
  reducers: {
    fetchSongsRequested(state) {
      state.status = "loading";
      state.error = null;
    },
    fetchSongsSucceeded(state, action: PayloadAction<SongListEnvelope>) {
      state.items = action.payload.items;
      state.page = action.payload.page;
      state.limit = action.payload.limit;
      state.totalItems = action.payload.totalItems;
      state.totalPages = action.payload.totalPages;
      state.status = "succeeded";
    },
    fetchSongsFailed(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    }
  }
});

export const { fetchSongsFailed, fetchSongsRequested, fetchSongsSucceeded } = songsSlice.actions;
export const songsReducer = songsSlice.reducer;
