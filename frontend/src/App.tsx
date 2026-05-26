import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSongsRequested, type Song } from "./store/songsSlice";
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
  const { error, items, status, totalItems } = useSelector((state: RootState) => state.songs);

  useEffect(() => {
    dispatch(fetchSongsRequested());
  }, [dispatch]);

  const shellStats = [
    { label: "Songs", value: String(totalItems) },
    { label: "Artists", value: String(new Set(items.map((song) => song.artist)).size) },
    { label: "Albums", value: String(new Set(items.map((song) => song.album)).size) },
    { label: "Genres", value: String(new Set(items.map((song) => song.genre)).size) }
  ];

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

        <div className="queue">
          <div>
            <p className="eyebrow">Next surface</p>
            <h2>Song catalogue</h2>
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
              <div className="table-message">No Songs have been seeded yet.</div>
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
        </div>
      </section>
    </main>
  );
};
