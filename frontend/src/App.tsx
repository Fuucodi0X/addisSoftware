const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

const shellStats = [
  { label: "Songs", value: "0" },
  { label: "Artists", value: "0" },
  { label: "Albums", value: "0" },
  { label: "Genres", value: "0" }
];

export const App = () => {
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
          <div className="empty-state">
            <span>Title</span>
            <span>Artist</span>
            <span>Album</span>
            <span>Genre</span>
          </div>
        </div>
      </section>
    </main>
  );
};
