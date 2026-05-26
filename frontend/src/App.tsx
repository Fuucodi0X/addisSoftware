import { type FormEvent, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearSongMutationState,
  createSongRequested,
  deleteSongRequested,
  fetchSongsRequested,
  fetchStatsRequested,
  SONG_GENRES,
  updateSongRequested,
  type Song,
  type SongMutationPayload
} from "./store/songsSlice";
import type { AppDispatch, RootState } from "./store/store";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

const placeholderPalettes = [
  { background: "#244f3a", accent: "#f0c04a" },
  { background: "#2b5876", accent: "#f7a072" },
  { background: "#8f3f2f", accent: "#f5d7a1" },
  { background: "#403d58", accent: "#9bd3ae" }
];

const hashText = (value: string) =>
  Array.from(value).reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) % 997, 7);

const getPlaceholder = (song: Song) => {
  const seed = hashText(`${song.artist}-${song.album}-${song.title}`);
  return {
    palette: placeholderPalettes[seed % placeholderPalettes.length],
    initials: song.artist
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("")
  };
};

const emptySongForm = {
  title: "",
  artist: "",
  album: "",
  genre: "",
  artworkUrl: ""
};

type SongFormValues = typeof emptySongForm;
type SongModalState = { mode: "create"; song?: undefined } | { mode: "edit"; song: Song };

const songFieldLimits = {
  title: 120,
  artist: 120,
  album: 120,
  genre: 80,
  artworkUrl: 2048
};

const getSongFormValues = (song?: Song): SongFormValues => ({
  title: song?.title ?? "",
  artist: song?.artist ?? "",
  album: song?.album ?? "",
  genre: song?.genre ?? "",
  artworkUrl: song?.artworkUrl ?? ""
});

const getSongPayload = (values: SongFormValues): { payload?: SongMutationPayload; errors?: string[] } => {
  const trimmed = {
    title: values.title.trim(),
    artist: values.artist.trim(),
    album: values.album.trim(),
    genre: values.genre.trim(),
    artworkUrl: values.artworkUrl.trim()
  };
  const errors: string[] = [];

  for (const field of ["title", "artist", "album", "genre"] as const) {
    if (!trimmed[field]) {
      errors.push(`${field} is required.`);
    } else if (trimmed[field].length > songFieldLimits[field]) {
      errors.push(`${field} must be ${songFieldLimits[field]} characters or fewer.`);
    }
  }

  const genre = SONG_GENRES.find((allowedGenre) => allowedGenre === trimmed.genre);

  if (trimmed.genre && !genre) {
    errors.push(`genre must be one of: ${SONG_GENRES.join(", ")}.`);
  }

  if (trimmed.artworkUrl.length > songFieldLimits.artworkUrl) {
    errors.push(`artworkUrl must be ${songFieldLimits.artworkUrl} characters or fewer.`);
  }

  if (!genre) {
    return { errors };
  }

  if (errors.length > 0) {
    return { errors };
  }

  return {
    payload: {
      title: trimmed.title,
      artist: trimmed.artist,
      album: trimmed.album,
      genre,
      artworkUrl: trimmed.artworkUrl || null
    }
  };
};

export const App = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [songModal, setSongModal] = useState<SongModalState | null>(null);
  const [songToDelete, setSongToDelete] = useState<Song | null>(null);
  const [formValues, setFormValues] = useState<SongFormValues>(emptySongForm);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const {
    error,
    genres,
    items,
    limit,
    mutationError,
    mutationStatus,
    page,
    query,
    stats,
    statsError,
    statsStatus,
    status,
    totalItems,
    totalPages
  } = useSelector((state: RootState) => state.songs);
  const isFiltered = Boolean(query.q.trim() || query.genre.trim());
  const startItem = totalItems === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, totalItems);
  const canGoBack = page > 1 && status !== "loading";
  const canGoForward = page < totalPages && status !== "loading";
  const maxGenreSongs = Math.max(...stats.songsByGenre.map((item) => item.songs), 1);
  const isMutating = mutationStatus === "loading";
  const modalTitle = songModal?.mode === "edit" ? "Edit Song" : "Add Song";
  const modalActionLabel = songModal?.mode === "edit" ? "Save changes" : "Add Song";
  const modalErrors = useMemo(
    () => (mutationError ? [...formErrors, mutationError] : formErrors),
    [formErrors, mutationError]
  );

  useEffect(() => {
    dispatch(fetchSongsRequested());
    dispatch(fetchStatsRequested());
  }, [dispatch]);

  useEffect(() => {
    if (mutationStatus === "succeeded") {
      setSongModal(null);
      setSongToDelete(null);
      setFormValues(emptySongForm);
      setFormErrors([]);
      dispatch(clearSongMutationState());
    }
  }, [dispatch, mutationStatus]);

  const shellStats = [
    { label: "Songs", value: String(stats.totals.songs) },
    { label: "Artists", value: String(stats.totals.artists) },
    { label: "Albums", value: String(stats.totals.albums) },
    { label: "Genres", value: String(stats.totals.genres) }
  ];

  const handleSearchChange = (value: string) => {
    dispatch(fetchSongsRequested({ q: value, page: 1 }));
  };

  const handleGenreChange = (value: string) => {
    dispatch(fetchSongsRequested({ genre: value, page: 1 }));
  };

  const handlePageChange = (nextPage: number) => {
    dispatch(fetchSongsRequested({ page: nextPage }));
  };

  const openCreateModal = () => {
    dispatch(clearSongMutationState());
    setFormErrors([]);
    setFormValues(emptySongForm);
    setSongModal({ mode: "create" });
  };

  const openEditModal = (song: Song) => {
    dispatch(clearSongMutationState());
    setFormErrors([]);
    setFormValues(getSongFormValues(song));
    setSongModal({ mode: "edit", song });
  };

  const closeSongModal = () => {
    if (isMutating) {
      return;
    }

    dispatch(clearSongMutationState());
    setSongModal(null);
    setFormValues(emptySongForm);
    setFormErrors([]);
  };

  const openDeleteModal = (song: Song) => {
    dispatch(clearSongMutationState());
    setSongToDelete(song);
  };

  const closeDeleteModal = () => {
    if (isMutating) {
      return;
    }

    dispatch(clearSongMutationState());
    setSongToDelete(null);
  };

  const handleFormChange = (field: keyof SongFormValues, value: string) => {
    setFormValues((current) => ({ ...current, [field]: value }));
  };

  const handleSongSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!songModal) {
      return;
    }

    const result = getSongPayload(formValues);

    if (result.errors || !result.payload) {
      setFormErrors(result.errors ?? ["Song payload is invalid."]);
      return;
    }

    setFormErrors([]);

    if (songModal.mode === "edit") {
      dispatch(updateSongRequested({ id: songModal.song.id, song: result.payload }));
      return;
    }

    dispatch(createSongRequested(result.payload));
  };

  const handleDeleteConfirm = () => {
    if (songToDelete) {
      dispatch(deleteSongRequested({ id: songToDelete.id }));
    }
  };

  return (
    <main className="app-shell">
      <section className="hero" aria-labelledby="page-title">
        <div className="hero-copy">
          <p className="eyebrow">Catalogue workspace</p>
          <h1 id="page-title">Song Library</h1>
          <p className="lede">
            A focused MERN shell for managing Song records, catalogue filters, and aggregate statistics.
          </p>
        </div>

        <div className="service-panel" aria-label="Service status">
          <span className="status-pill">Frontend online</span>
          <dl>
            <div>
              <dt>API root</dt>
              <dd>{apiBaseUrl}</dd>
            </div>
            <div>
              <dt>Health</dt>
              <dd>/health</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="workspace" aria-label="Song Library overview">
        <div className="stat-grid">
          {shellStats.map((stat) => (
            <article className="stat-card" key={stat.label}>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
            </article>
          ))}
        </div>

        <section className="stats-dashboard" aria-labelledby="stats-title">
          <div className="stats-heading">
            <div>
              <p className="eyebrow">Global statistics</p>
              <h2 id="stats-title">Library dashboard</h2>
            </div>
            <span className="scope-pill">All Songs</span>
          </div>

          {statsStatus === "loading" ? (
            <p className="stats-message" role="status">
              Loading Song Library statistics
            </p>
          ) : null}

          {statsStatus === "failed" ? <p className="stats-message error-state">{statsError}</p> : null}

          {statsStatus !== "failed" ? (
            <div className="stats-panels">
              <section className="breakdown-panel" aria-labelledby="genre-breakdown-title">
                <h3 id="genre-breakdown-title">Songs by Genre</h3>
                <div className="bar-list">
                  {stats.songsByGenre.length === 0 ? (
                    <p className="empty-stat">No genre statistics yet.</p>
                  ) : null}
                  {stats.songsByGenre.map((item) => (
                    <div className="bar-row" key={item.genre}>
                      <span>{item.genre}</span>
                      <div className="bar-track" aria-hidden="true">
                        <span style={{ width: `${Math.max((item.songs / maxGenreSongs) * 100, 6)}%` }} />
                      </div>
                      <strong>{item.songs}</strong>
                    </div>
                  ))}
                </div>
              </section>

              <section className="breakdown-panel" aria-labelledby="artist-breakdown-title">
                <h3 id="artist-breakdown-title">Artists</h3>
                <div className="compact-list">
                  {stats.artists.length === 0 ? <p className="empty-stat">No artist statistics yet.</p> : null}
                  {stats.artists.slice(0, 6).map((item) => (
                    <div className="compact-row" key={item.artist}>
                      <span>{item.artist}</span>
                      <strong>
                        {item.songs} Songs / {item.albums} Albums
                      </strong>
                    </div>
                  ))}
                </div>
              </section>

              <section className="breakdown-panel" aria-labelledby="album-breakdown-title">
                <h3 id="album-breakdown-title">Songs by Album</h3>
                <div className="compact-list">
                  {stats.songsByAlbum.length === 0 ? (
                    <p className="empty-stat">No album statistics yet.</p>
                  ) : null}
                  {stats.songsByAlbum.slice(0, 6).map((item) => (
                    <div className="compact-row" key={item.album}>
                      <span>{item.album}</span>
                      <strong>{item.songs} Songs</strong>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          ) : null}
        </section>

        <div className="queue">
          <div className="catalog-heading">
            <div>
              <p className="eyebrow">Catalog controls</p>
              <h2>Song catalogue</h2>
            </div>
            <div className="catalog-actions">
              <p className="result-count" aria-live="polite">
                {totalItems === 0 ? "No results" : `${startItem}-${endItem} of ${totalItems}`}
              </p>
              <button className="primary-action" type="button" onClick={openCreateModal}>
                Add Song
              </button>
            </div>
          </div>

          <div className="catalog-controls" aria-label="Song catalog filters">
            <label>
              <span>Search</span>
              <input
                type="search"
                value={query.q}
                onChange={(event) => handleSearchChange(event.target.value)}
                placeholder="Title, artist, album, genre"
              />
            </label>
            <label>
              <span>Genre</span>
              <select value={query.genre} onChange={(event) => handleGenreChange(event.target.value)}>
                <option value="">All genres</option>
                {genres.map((genre) => (
                  <option value={genre} key={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="song-table" role="table" aria-label="Persisted Songs">
            <div className="song-row song-row-header" role="row">
              <span role="columnheader">Song</span>
              <span role="columnheader">Artist</span>
              <span role="columnheader">Album</span>
              <span role="columnheader">Genre</span>
              <span role="columnheader">Actions</span>
            </div>

            {status === "loading" ? (
              <div className="table-message" role="status">
                Loading Songs
              </div>
            ) : null}

            {status === "failed" ? <div className="table-message error-state">{error}</div> : null}

            {status === "succeeded" && items.length === 0 ? (
              <div className="table-message">
                {isFiltered
                  ? "No Songs match the current search and genre filters."
                  : "No Songs have been seeded yet."}
              </div>
            ) : null}

            {items.map((song) => {
              const placeholder = getPlaceholder(song);

              return (
                <article className="song-row" role="row" key={song.id}>
                  <div className="song-cell title-cell" role="cell">
                    {song.artworkUrl ? (
                      <img className="artwork" src={song.artworkUrl} alt={`${song.album} artwork`} />
                    ) : (
                      <span
                        className="artwork placeholder-artwork"
                        style={{
                          backgroundColor: placeholder.palette.background,
                          color: placeholder.palette.accent
                        }}
                        aria-hidden="true"
                      >
                        {placeholder.initials}
                      </span>
                    )}
                    <strong>{song.title}</strong>
                  </div>
                  <span role="cell">{song.artist}</span>
                  <span role="cell">{song.album}</span>
                  <span role="cell">{song.genre}</span>
                  <span className="row-actions" role="cell">
                    <button type="button" onClick={() => openEditModal(song)}>
                      Edit
                    </button>
                    <button className="danger-ghost" type="button" onClick={() => openDeleteModal(song)}>
                      Delete
                    </button>
                  </span>
                </article>
              );
            })}
          </div>

          <div className="pagination" aria-label="Song catalog pagination">
            <button type="button" onClick={() => handlePageChange(page - 1)} disabled={!canGoBack}>
              Previous
            </button>
            <span>
              Page {Math.max(page, 1)} of {Math.max(totalPages, 1)}
            </span>
            <button type="button" onClick={() => handlePageChange(page + 1)} disabled={!canGoForward}>
              Next
            </button>
          </div>
        </div>
      </section>

      {songModal ? (
        <div className="modal-backdrop" role="presentation">
          <section className="modal-panel song-form-modal" role="dialog" aria-modal="true" aria-labelledby="song-modal-title">
            <div className="modal-heading">
              <h2 id="song-modal-title">{modalTitle}</h2>
              <button className="icon-button" type="button" onClick={closeSongModal} aria-label="Close Song form">
                x
              </button>
            </div>

            {modalErrors.length > 0 ? (
              <div className="form-errors" role="alert">
                {modalErrors.map((formError) => (
                  <p key={formError}>{formError}</p>
                ))}
              </div>
            ) : null}

            <form className="song-form" onSubmit={handleSongSubmit}>
              <label>
                <span>Title</span>
                <input
                  value={formValues.title}
                  onChange={(event) => handleFormChange("title", event.target.value)}
                  maxLength={songFieldLimits.title}
                  required
                />
              </label>
              <label>
                <span>Artist</span>
                <input
                  value={formValues.artist}
                  onChange={(event) => handleFormChange("artist", event.target.value)}
                  maxLength={songFieldLimits.artist}
                  required
                />
              </label>
              <label>
                <span>Album</span>
                <input
                  value={formValues.album}
                  onChange={(event) => handleFormChange("album", event.target.value)}
                  maxLength={songFieldLimits.album}
                  required
                />
              </label>
              <label>
                <span>Genre</span>
                <select
                  value={formValues.genre}
                  onChange={(event) => handleFormChange("genre", event.target.value)}
                  required
                >
                  <option value="">Choose genre</option>
                  {SONG_GENRES.map((genre) => (
                    <option value={genre} key={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
              </label>
              <label className="wide-field">
                <span>Artwork URL</span>
                <input
                  value={formValues.artworkUrl}
                  onChange={(event) => handleFormChange("artworkUrl", event.target.value)}
                  maxLength={songFieldLimits.artworkUrl}
                  inputMode="url"
                />
              </label>
              <div className="modal-actions">
                <button type="button" onClick={closeSongModal} disabled={isMutating}>
                  Cancel
                </button>
                <button className="primary-action" type="submit" disabled={isMutating}>
                  {isMutating ? "Saving" : modalActionLabel}
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}

      {songToDelete ? (
        <div className="modal-backdrop" role="presentation">
          <section className="modal-panel confirm-modal" role="dialog" aria-modal="true" aria-labelledby="delete-modal-title">
            <div className="modal-heading">
              <h2 id="delete-modal-title">Delete Song</h2>
              <button className="icon-button" type="button" onClick={closeDeleteModal} aria-label="Close delete confirmation">
                x
              </button>
            </div>
            <p>
              Delete <strong>{songToDelete.title}</strong> by {songToDelete.artist} from the Song Library?
            </p>
            {mutationError ? (
              <div className="form-errors" role="alert">
                <p>{mutationError}</p>
              </div>
            ) : null}
            <div className="modal-actions">
              <button type="button" onClick={closeDeleteModal} disabled={isMutating}>
                Cancel
              </button>
              <button className="danger-action" type="button" onClick={handleDeleteConfirm} disabled={isMutating}>
                {isMutating ? "Deleting" : "Delete Song"}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  );
};
