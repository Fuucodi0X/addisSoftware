import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSongsRequested, fetchStatsRequested, type Song } from "./store/songsSlice";
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

export const App = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    error,
    genres,
    items,
    limit,
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

  useEffect(() => {
    dispatch(fetchSongsRequested());
    dispatch(fetchStatsRequested());
  }, [dispatch]);

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
            <p className="result-count" aria-live="polite">
              {totalItems === 0 ? "No results" : `${startItem}-${endItem} of ${totalItems}`}
            </p>
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
    </main>
  );
};
