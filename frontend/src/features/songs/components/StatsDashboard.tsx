import type { SongLibraryStats } from "../../../store/songsSlice";

interface StatsDashboardProps {
  error: string | null;
  stats: SongLibraryStats;
  status: "idle" | "loading" | "succeeded" | "failed";
}

export const StatsDashboard = ({ error, stats, status }: StatsDashboardProps) => {
  const maxGenreSongs = Math.max(...stats.songsByGenre.map((item) => item.songs), 1);
  const topArtist = stats.artists[0];

  return (
    <section className="stats-panel" aria-labelledby="stats-title">
      <div className="stats-heading">
        <div>
          <p className="section-kicker">Global statistics</p>
          <h2 id="stats-title">Library dashboard</h2>
        </div>
        <span className="scope-pill">All Songs</span>
      </div>

      {status === "loading" ? (
        <p className="stats-message" role="status">
          Loading Song Library statistics
        </p>
      ) : null}

      {status === "failed" ? <p className="stats-message error-state">{error}</p> : null}

      <div className="stat-card-grid">
        <article className="stat-card">
          <span>Total Songs</span>
          <strong>{stats.totals.songs}</strong>
        </article>
        <article className="stat-card accent-gold">
          <span>Total Artists</span>
          <strong>{stats.totals.artists}</strong>
        </article>
        <article className="stat-card accent-violet">
          <span>Total Albums</span>
          <strong>{stats.totals.albums}</strong>
        </article>
        <article className="stat-card accent-dark">
          <span>Total Genres</span>
          <strong>{stats.totals.genres}</strong>
        </article>
      </div>

      <div className="distribution-panel">
        <div className="dominant-panel">
          <span>Leading Artist</span>
          <strong>{topArtist ? topArtist.artist : "N/A"}</strong>
          <small>{topArtist ? `${topArtist.songs} Songs / ${topArtist.albums} Albums` : "No Songs yet"}</small>
        </div>

        <section className="breakdown-panel" aria-label="Songs by Genre">
          <h3>Songs by Genre</h3>
          {stats.songsByGenre.length === 0 ? <p className="empty-stat">No genre statistics yet.</p> : null}
          {stats.songsByGenre.map((item) => (
            <div className="bar-row" key={item.genre}>
              <span>{item.genre}</span>
              <div className="bar-meter" aria-hidden="true">
                <span style={{ width: `${Math.max((item.songs / maxGenreSongs) * 100, 6)}%` }} />
              </div>
              <strong>{item.songs}</strong>
            </div>
          ))}
        </section>
      </div>
    </section>
  );
};
