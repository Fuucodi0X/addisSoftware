import type { Song } from "../../../store/songsSlice";
import { Button } from "../../../ui/Button";
import { SongArtwork } from "./SongArtwork";

interface PreviewChromeProps {
  apiBaseUrl: string;
  song: Song | null;
}

export const PreviewChrome = ({ apiBaseUrl, song }: PreviewChromeProps) => (
  <aside className="preview-panel" aria-label="Song Preview">
    <div className="preview-status">
      <span className="status-pill">Frontend online</span>
      <span className="preview-label">Preview</span>
    </div>

    {song ? (
      <div className="preview-chrome" aria-live="polite">
        <SongArtwork song={song} className="preview-artwork" />
        <div className="preview-copy">
          <strong>{song.title}</strong>
          <span>{song.artist}</span>
          <small>
            {song.album} / {song.genre} / {song.duration}
          </small>
        </div>
        <div className="preview-controls" aria-hidden="true">
          <Button variant="ghost">Back</Button>
          <Button variant="solid">Preview</Button>
          <Button variant="ghost">Next</Button>
        </div>
        <div className="preview-motion" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>
    ) : (
      <div className="preview-empty">
        <strong>Song Preview</strong>
        <span>Select a Song from the catalog to refresh the preview chrome.</span>
      </div>
    )}

    <dl className="service-details">
      <div>
        <dt>API root</dt>
        <dd>{apiBaseUrl}</dd>
      </div>
      <div>
        <dt>Health</dt>
        <dd>/health</dd>
      </div>
    </dl>
  </aside>
);
