import type { Song } from "../../../store/songsSlice";
import { Button } from "../../../ui/Button";
import { Modal } from "../../../ui/Modal";

interface DeleteSongModalProps {
  error: string | null;
  isMutating: boolean;
  onClose: () => void;
  onConfirm: () => void;
  song: Song;
}

export const DeleteSongModal = ({ error, isMutating, onClose, onConfirm, song }: DeleteSongModalProps) => (
  <Modal labelledBy="delete-modal-title" onClose={onClose} size="confirm" title="Delete Song">
    <p className="confirm-copy">
      Delete <strong>{song.title}</strong> by {song.artist} from the Song Library?
    </p>
    {error ? (
      <div className="form-errors" role="alert">
        <p>{error}</p>
      </div>
    ) : null}
    <div className="modal-actions">
      <Button onClick={onClose} disabled={isMutating}>
        Cancel
      </Button>
      <Button variant="danger" onClick={onConfirm} disabled={isMutating}>
        {isMutating ? "Deleting" : "Delete Song"}
      </Button>
    </div>
  </Modal>
);
