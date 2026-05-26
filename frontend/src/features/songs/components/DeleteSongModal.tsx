import styled from "@emotion/styled";
import type { Song } from "../../../store/songsSlice";
import { Button } from "../../../ui/Button";
import { FormFeedback } from "../../../ui/Form";
import { Modal } from "../../../ui/Modal";

interface DeleteSongModalProps {
  error: string | null;
  isMutating: boolean;
  onClose: () => void;
  onConfirm: () => void;
  song: Song;
}

export const DeleteSongModal = ({ error, isMutating, onClose, onConfirm, song }: DeleteSongModalProps) => (
  <Modal labelledBy="delete-modal-title" onClose={onClose} size="confirm" title="Delete Song" tone="danger">
    <ConfirmBody>
      <p className="confirm-copy">
        Delete <strong>{song.title}</strong> by {song.artist} from the Song Library?
      </p>
      {error ? (
        <FormFeedback>
          <p>{error}</p>
        </FormFeedback>
      ) : null}
      <Actions className="modal-actions">
        <Button onClick={onClose} disabled={isMutating}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} disabled={isMutating}>
          {isMutating ? "Deleting" : "Delete Song"}
        </Button>
      </Actions>
    </ConfirmBody>
  </Modal>
);

const ConfirmBody = styled.div(({ theme }) => ({
  display: "grid",
  gap: theme.space[5],
  padding: theme.space[7],

  ".confirm-copy": {
    color: theme.colors.text.secondary,
    fontSize: theme.fontSizes.md,
    lineHeight: theme.lineHeights.body,
    margin: 0
  },

  strong: {
    color: theme.colors.text.primary
  }
}));

const Actions = styled.div(({ theme }) => ({
  display: "flex",
  gap: theme.space[3],
  justifyContent: "flex-end",

  "@media (max-width: 520px)": {
    alignItems: "stretch",
    flexDirection: "column-reverse"
  }
}));
