import { call, put, select, takeLatest } from "redux-saga/effects";
import {
  fetchSongsFailed,
  fetchSongsRequested,
  fetchSongsSucceeded,
  type SongListEnvelope,
  type SongQueryParams
} from "./songsSlice";
import type { RootState } from "./store";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";
const SONGS_PER_PAGE = 8;

const fetchSongs = async (query: SongQueryParams): Promise<SongListEnvelope> => {
  const searchParams = new URLSearchParams({
    page: String(query.page),
    limit: String(SONGS_PER_PAGE)
  });

  if (query.q.trim()) {
    searchParams.set("q", query.q.trim());
  }

  if (query.genre.trim()) {
    searchParams.set("genre", query.genre.trim());
  }

  const response = await fetch(`${apiBaseUrl}/api/songs?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error(`Song API returned ${response.status}`);
  }

  return (await response.json()) as SongListEnvelope;
};

function* fetchSongsWorker() {
  try {
    const query: SongQueryParams = yield select((state: RootState) => state.songs.query);
    const songs: SongListEnvelope = yield call(fetchSongs, query);
    yield put(fetchSongsSucceeded(songs));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load Songs";
    yield put(fetchSongsFailed(message));
  }
}

export function* songsSaga() {
  yield takeLatest(fetchSongsRequested.type, fetchSongsWorker);
}
