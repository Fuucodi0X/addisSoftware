import type { FormEvent } from "react";
import styled from "@emotion/styled";
import { SONG_GENRES } from "../../../store/songsSlice";
import { Button } from "../../../ui/Button";
import { Field, FormFeedback, Input, Select } from "../../../ui/Form";
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
      <FeedbackInset>
        <FormFeedback>
          {errors.map((formError) => (
            <p key={formError}>{formError}</p>
          ))}
        </FormFeedback>
      </FeedbackInset>
    ) : null}

    <SongForm className="song-form" onSubmit={onSubmit}>
      <Field htmlFor="song-title-input" label="Title" wide disabled={isMutating}>
        <Input
          value={values.title}
          onChange={(event) => onChange("title", event.target.value)}
          required
        />
      </Field>
      <Field htmlFor="song-artist-input" label="Artist" disabled={isMutating}>
        <Input
          value={values.artist}
          onChange={(event) => onChange("artist", event.target.value)}
          required
        />
      </Field>
      <Field htmlFor="song-album-input" label="Album" disabled={isMutating}>
        <Input
          value={values.album}
          onChange={(event) => onChange("album", event.target.value)}
          required
        />
      </Field>
      <Field htmlFor="song-genre-input" label="Genre" disabled={isMutating}>
        <Select
          value={values.genre}
          onChange={(event) => onChange("genre", event.target.value)}
          required
        >
          <option value="">Choose genre</option>
          {SONG_GENRES.map((genre) => (
            <option value={genre} key={genre}>
              {genre}
            </option>
          ))}
        </Select>
      </Field>
      <Field htmlFor="song-duration-input" label="Duration" disabled={isMutating}>
        <Input
          value={values.duration}
          onChange={(event) => onChange("duration", event.target.value)}
          pattern="[0-9]{1,2}:[0-5][0-9]"
          placeholder="3:45"
          required
        />
      </Field>
      <Field htmlFor="song-artwork-input" label="Artwork URL" wide disabled={isMutating}>
        <Input
          value={values.artworkUrl}
          onChange={(event) => onChange("artworkUrl", event.target.value)}
          inputMode="url"
        />
      </Field>
      <Actions className="modal-actions">
        <Button onClick={onClose} disabled={isMutating}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" disabled={isMutating}>
          {isMutating ? "Saving" : actionLabel}
        </Button>
      </Actions>
    </SongForm>
  </Modal>
);

const FeedbackInset = styled.div(({ theme }) => ({
  padding: `${theme.space[6]}px ${theme.space[7]}px 0`
}));

const SongForm = styled.form(({ theme }) => ({
  display: "grid",
  gap: theme.space[5],
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  padding: theme.space[7],

  "@media (max-width: 560px)": {
    gridTemplateColumns: "1fr"
  }
}));

const Actions = styled.div(({ theme }) => ({
  display: "flex",
  gap: theme.space[3],
  gridColumn: "1 / -1",
  justifyContent: "flex-end",

  "@media (max-width: 520px)": {
    alignItems: "stretch",
    flexDirection: "column-reverse"
  }
}));
