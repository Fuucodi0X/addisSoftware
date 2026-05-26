import { call, put, takeLatest } from "redux-saga/effects";
import { fetchSongsFailed, fetchSongsRequested, fetchSongsSucceeded, type SongListEnvelope } from "./songsSlice";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

const fetchSongs = async (): Promise<SongListEnvelope> => {
  const response = await fetch(`${apiBaseUrl}/api/songs?page=1&limit=50`);

  if (!response.ok) {
    throw new Error(`Song API returned ${response.status}`);
  }

  return (await response.json()) as SongListEnvelope;
};

function* fetchSongsWorker() {
  try {
    const songs: SongListEnvelope = yield call(fetchSongs);
    yield put(fetchSongsSucceeded(songs));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load Songs";
    yield put(fetchSongsFailed(message));
  }
}

export function* songsSaga() {
  yield takeLatest(fetchSongsRequested.type, fetchSongsWorker);
}
