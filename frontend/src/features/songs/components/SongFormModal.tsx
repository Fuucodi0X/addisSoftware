import type { FormEvent } from "react";
import { SONG_GENRES } from "../../../store/songsSlice";
import { Button } from "../../../ui/Button";
import { Modal } from "../../../ui/Modal";

export interface SongFormValues {
  title: string;
  artist: string;
  album: string;
  genre: string;
  duration: string;
  artworkUrl: string;
}

interface SongFormModalProps {
  actionLabel: string;
  errors: string[];
  isMutating: boolean;
  onChange: (field: keyof SongFormValues, value: string) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  title: string;
  values: SongFormValues;
}

export const SongFormModal = ({
  actionLabel,
  errors,
  isMutating,
  onChange,
  onClose,
  onSubmit,
  title,
  values
}: SongFormModalProps) => (
  <Modal labelledBy="song-modal-title" onClose={onClose} title={title}>
    {errors.length > 0 ? (
      <div className="form-errors" role="alert">
        {errors.map((formError) => (
          <p key={formError}>{formError}</p>
        ))}
      </div>
    ) : null}

    <form className="song-form" onSubmit={onSubmit}>
      <label className="wide-field">
        <span>Title</span>
        <input value={values.title} onChange={(event) => onChange("title", event.target.value)} required />
      </label>
      <label>
        <span>Artist</span>
        <input value={values.artist} onChange={(event) => onChange("artist", event.target.value)} required />
      </label>
      <label>
        <span>Album</span>
        <input value={values.album} onChange={(event) => onChange("album", event.target.value)} required />
      </label>
      <label>
        <span>Genre</span>
        <select value={values.genre} onChange={(event) => onChange("genre", event.target.value)} required>
          <option value="">Choose genre</option>
          {SONG_GENRES.map((genre) => (
            <option value={genre} key={genre}>
              {genre}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>Duration</span>
        <input
          value={values.duration}
          onChange={(event) => onChange("duration", event.target.value)}
          pattern="[0-9]{1,2}:[0-5][0-9]"
          placeholder="3:45"
          required
        />
      </label>
      <label className="wide-field">
        <span>Artwork URL</span>
        <input value={values.artworkUrl} onChange={(event) => onChange("artworkUrl", event.target.value)} inputMode="url" />
      </label>
      <div className="modal-actions">
        <Button onClick={onClose} disabled={isMutating}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" disabled={isMutating}>
          {isMutating ? "Saving" : actionLabel}
        </Button>
      </div>
    </form>
  </Modal>
);
