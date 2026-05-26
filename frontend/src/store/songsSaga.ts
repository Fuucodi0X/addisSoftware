import { call, put, select, takeLatest } from "redux-saga/effects";
import {
  createSongRequested,
  deleteSongRequested,
  fetchSongsFailed,
  fetchSongsRequested,
  fetchSongsSucceeded,
  fetchStatsFailed,
  fetchStatsRequested,
  fetchStatsSucceeded,
  songMutationFailed,
  songMutationSucceeded,
  updateSongRequested,
  type SongMutationPayload,
  type SongLibraryStats,
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

const fetchSongStats = async (): Promise<SongLibraryStats> => {
  const response = await fetch(`${apiBaseUrl}/api/songs/stats`);

  if (!response.ok) {
    throw new Error(`Song stats API returned ${response.status}`);
  }

  return (await response.json()) as SongLibraryStats;
};

const parseMutationError = async (response: Response, fallback: string) => {
  try {
    const body = (await response.json()) as { message?: string; errors?: string[] };
    return body.errors?.length ? body.errors.join(" ") : body.message ?? fallback;
  } catch {
    return fallback;
  }
};

const writeSong = async (
  method: "POST" | "PATCH",
  song: SongMutationPayload,
  id?: string
): Promise<void> => {
  const response = await fetch(`${apiBaseUrl}/api/songs${id ? `/${id}` : ""}`, {
    method,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(song)
  });

  if (!response.ok) {
    throw new Error(await parseMutationError(response, `Song API returned ${response.status}`));
  }
};

const deleteSong = async (id: string): Promise<void> => {
  const response = await fetch(`${apiBaseUrl}/api/songs/${id}`, { method: "DELETE" });

  if (!response.ok) {
    throw new Error(await parseMutationError(response, `Song API returned ${response.status}`));
  }
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

function* refetchAfterMutation(page: number) {
  yield put(fetchSongsRequested({ page }));
  yield put(fetchStatsRequested());
}

function* createSongWorker(action: ReturnType<typeof createSongRequested>) {
  try {
    const query: SongQueryParams = yield select((state: RootState) => state.songs.query);
    yield call(writeSong, "POST", action.payload);
    yield put(songMutationSucceeded());
    yield* refetchAfterMutation(query.page);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create Song";
    yield put(songMutationFailed(message));
  }
}

function* updateSongWorker(action: ReturnType<typeof updateSongRequested>) {
  try {
    const query: SongQueryParams = yield select((state: RootState) => state.songs.query);
    yield call(writeSong, "PATCH", action.payload.song, action.payload.id);
    yield put(songMutationSucceeded());
    yield* refetchAfterMutation(query.page);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update Song";
    yield put(songMutationFailed(message));
  }
}

function* deleteSongWorker(action: ReturnType<typeof deleteSongRequested>) {
  try {
    const state: RootState["songs"] = yield select((rootState: RootState) => rootState.songs);
    const nextPage = state.items.length === 1 && state.query.page > 1 ? state.query.page - 1 : state.query.page;

    yield call(deleteSong, action.payload.id);
    yield put(songMutationSucceeded());
    yield* refetchAfterMutation(nextPage);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to delete Song";
    yield put(songMutationFailed(message));
  }
}

function* fetchStatsWorker() {
  try {
    const stats: SongLibraryStats = yield call(fetchSongStats);
    yield put(fetchStatsSucceeded(stats));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load Song statistics";
    yield put(fetchStatsFailed(message));
  }
}

export function* songsSaga() {
  yield takeLatest(createSongRequested.type, createSongWorker);
  yield takeLatest(updateSongRequested.type, updateSongWorker);
  yield takeLatest(deleteSongRequested.type, deleteSongWorker);
  yield takeLatest(fetchSongsRequested.type, fetchSongsWorker);
  yield takeLatest(fetchStatsRequested.type, fetchStatsWorker);
}
