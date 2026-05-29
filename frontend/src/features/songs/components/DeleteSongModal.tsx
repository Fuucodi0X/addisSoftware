import styled from "@emotion/styled";
import { AlertTriangle } from "lucide-react";
import type { Song } from "../../../store/songsSlice";
import { Button } from "../../../ui/Button";
import { FormFeedback } from "../../../ui/Form";
import { Modal } from "../../../ui/Modal";
import { CachedArtworkImage } from "./CachedArtworkImage";

interface DeleteSongModalProps {
  error: string | null;
  fallbackArtwork: string;
  isMutating: boolean;
  onClose: () => void;
  onConfirm: () => void;
  song: Song;
}

export const DeleteSongModal = ({
  error,
  fallbackArtwork,
  isMutating,
  onClose,
  onConfirm,
  song
}: DeleteSongModalProps) => (
  <Modal labelledBy="delete-modal-title" onClose={onClose} size="confirm" title="Delete this song?" tone="danger">
    <ConfirmBody>
      <DeletePreview>
        <DeleteArtwork src={song.artworkUrl ?? fallbackArtwork} alt="" referrerPolicy="no-referrer" />
        <DeleteSongMeta>
          <strong>{song.title}</strong>
          <span>{song.artist}</span>
          <small>{song.album}</small>
        </DeleteSongMeta>
      </DeletePreview>
      <ConfirmCopy>
        Delete <strong>{song.title}</strong> by {song.artist} from the Song Library?
      </ConfirmCopy>
      <DeleteWarning>
        <AlertTriangle size={16} aria-hidden="true" />
        <div>
          <strong>Permanent action</strong>
          <span>This song and its catalog metadata cannot be restored after deletion.</span>
        </div>
      </DeleteWarning>
      {error ? (
        <FormFeedback tone="danger">
          <p>{error}</p>
        </FormFeedback>
      ) : null}
      <Actions>
        <Button onClick={onClose} disabled={isMutating}>
          Cancel
        </Button>
        <Button variant="solid" tone="danger" onClick={onConfirm} disabled={isMutating}>
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

  strong: {
    color: theme.colors.text.primary
  }
}));

const ConfirmCopy = styled.p(({ theme }) => ({
  color: theme.colors.text.secondary,
  fontSize: theme.fontSizes.md,
  lineHeight: theme.lineHeights.body,
  margin: 0
}));

const DeletePreview = styled.div(({ theme }) => ({
  alignItems: "center",
  background: theme.colors.surface.panelSubtle,
  border: `1px solid ${theme.colors.border.default}`,
  borderRadius: theme.radii.sm,
  display: "grid",
  gap: theme.space[4],
  gridTemplateColumns: "auto minmax(0, 1fr)",
  padding: theme.space[4]
}));

const DeleteArtwork = styled(CachedArtworkImage)(({ theme }) => ({
  aspectRatio: "1 / 1",
  background: theme.colors.surface.panel,
  borderRadius: theme.radii.sm,
  boxShadow: theme.shadows.raised,
  objectFit: "cover",
  width: theme.space[12]
}));

const DeleteSongMeta = styled.div(({ theme }) => ({
  display: "grid",
  gap: theme.space[1],
  minWidth: 0,

  "strong, span, small": {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  },

  strong: {
    color: theme.colors.text.primary,
    fontSize: theme.fontSizes.lg,
    fontWeight: theme.fontWeights.bold
  },

  span: {
    color: theme.colors.text.secondary,
    fontSize: theme.fontSizes.md,
    fontWeight: theme.fontWeights.medium
  },

  small: {
    color: theme.colors.text.muted,
    fontSize: theme.fontSizes.sm,
    fontWeight: theme.fontWeights.medium
  }
}));

const DeleteWarning = styled.div(({ theme }) => ({
  alignItems: "start",
  background: theme.colors.intent.dangerSoft,
  border: `1px solid ${theme.colors.intent.dangerSoft}`,
  borderRadius: theme.radii.sm,
  color: theme.colors.intent.danger,
  display: "grid",
  gap: theme.space[3],
  gridTemplateColumns: "auto minmax(0, 1fr)",
  padding: theme.space[4],

  strong: {
    color: theme.colors.intent.danger,
    display: "block",
    fontSize: theme.fontSizes.sm,
    fontWeight: theme.fontWeights.bold,
    lineHeight: theme.lineHeights.tight,
    marginBottom: theme.space[1]
  },

  span: {
    color: theme.colors.text.secondary,
    display: "block",
    fontSize: theme.fontSizes.sm,
    fontWeight: theme.fontWeights.regular,
    lineHeight: theme.lineHeights.body
  }
}));

const Actions = styled.div(({ theme }) => ({
  display: "flex",
  gap: theme.space[3],
  justifyContent: "flex-end",

  [`@media (max-width: ${theme.breakpoints[0]})`]: {
    alignItems: "stretch",
    flexDirection: "column-reverse"
  }
}));
