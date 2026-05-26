import type { Song } from "../../../store/songsSlice";
import { Button } from "../../../ui/Button";
import { SongArtwork } from "./SongArtwork";

interface SongTableProps {
  error: string | null;
  isFiltered: boolean;
  items: Song[];
  onDelete: (song: Song) => void;
  onEdit: (song: Song) => void;
  onPreview: (song: Song) => void;
  previewSongId: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
}

export const SongTable = ({
  error,
  isFiltered,
  items,
  onDelete,
  onEdit,
  onPreview,
  previewSongId,
  status
}: SongTableProps) => (
  <div className="song-table-shell">
    <table className="song-table" aria-label="Song Catalog">
      <thead>
        <tr>
          <th scope="col">Song</th>
          <th scope="col">Artist</th>
          <th scope="col">Album</th>
          <th scope="col">Genre</th>
          <th scope="col">Duration</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.map((song, index) => (
          <tr className={previewSongId === song.id ? "is-previewed" : ""} key={song.id}>
            <td>
              <div className="song-title-cell">
                <span className="song-index">{String(index + 1).padStart(2, "0")}</span>
                <SongArtwork song={song} />
                <div>
                  <strong>{song.title}</strong>
                  <small>{song.album}</small>
                </div>
              </div>
            </td>
            <td>{song.artist}</td>
            <td>{song.album}</td>
            <td>
              <span className="genre-pill">{song.genre}</span>
            </td>
            <td>{song.duration}</td>
            <td>
              <div className="row-actions">
                <Button variant="ghost" onClick={() => onPreview(song)}>
                  Preview
                </Button>
                <Button variant="ghost" onClick={() => onEdit(song)}>
                  Edit
                </Button>
                <Button variant="ghost" className="danger-link" onClick={() => onDelete(song)}>
                  Delete
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {status === "loading" ? (
      <div className="table-message" role="status">
        Loading Songs
      </div>
    ) : null}

    {status === "failed" ? <div className="table-message error-state">{error}</div> : null}

    {status === "succeeded" && items.length === 0 ? (
      <div className="table-message">
        {isFiltered ? "No Songs match the current search and genre filters." : "No Songs have been seeded yet."}
      </div>
    ) : null}
  </div>
);
