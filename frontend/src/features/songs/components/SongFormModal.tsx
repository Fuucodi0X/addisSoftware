import type { FormEvent } from "react";
import styled from "@emotion/styled";
import { Check, Clock, Disc, Image, Music, Tag, User } from "lucide-react";
import { SONG_GENRES } from "../../../store/songsSlice";
import { Button } from "../../../ui/Button";
import { Field, FormFeedback, Input } from "../../../ui/Form";
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
  artworkPresets: string[];
  errors: string[];
  fallbackArtwork: string;
  isMutating: boolean;
  onChange: (field: keyof SongFormValues, value: string) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  title: string;
  values: SongFormValues;
}

export const SongFormModal = ({
  actionLabel,
  artworkPresets,
  errors,
  fallbackArtwork,
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

    <SongForm onSubmit={onSubmit}>
      <ArtworkField>
        <FieldLabel>
          <Image size={15} aria-hidden="true" /> Artwork URL
        </FieldLabel>
        <ArtworkControl>
          <ArtworkPreview src={values.artworkUrl || fallbackArtwork} alt="Artwork preview" referrerPolicy="no-referrer" />
          <ArtworkInputs>
            <Input
              id="cover-url-input"
              value={values.artworkUrl}
              onChange={(event) => onChange("artworkUrl", event.target.value)}
              placeholder="Paste artwork URL..."
              inputMode="url"
              disabled={isMutating}
            />
            <PresetRow>
              <span>Presets:</span>
              {artworkPresets.map((preset, index) => (
                <PresetButton
                  id={`cover-preset-${index}`}
                  key={preset}
                  type="button"
                  $active={values.artworkUrl === preset}
                  onClick={() => onChange("artworkUrl", preset)}
                  disabled={isMutating}
                  aria-label={`Use artwork preset ${index + 1}`}
                >
                  <img src={preset} alt="" referrerPolicy="no-referrer" />
                  {values.artworkUrl === preset ? <Check size={12} aria-hidden="true" /> : null}
                </PresetButton>
              ))}
            </PresetRow>
          </ArtworkInputs>
        </ArtworkControl>
      </ArtworkField>

      <Field
        htmlFor="title-inp"
        label={<><Music size={15} aria-hidden="true" /> Song Title *</>}
        wide
        disabled={isMutating}
      >
        <Input
          id="title-inp"
          value={values.title}
          onChange={(event) => onChange("title", event.target.value)}
          placeholder="Tizita, Ambassel..."
          required
        />
      </Field>
      <Field
        htmlFor="artist-inp"
        label={<><User size={15} aria-hidden="true" /> Artist Name *</>}
        disabled={isMutating}
      >
        <Input
          id="artist-inp"
          value={values.artist}
          onChange={(event) => onChange("artist", event.target.value)}
          placeholder="Aster Aweke..."
          required
        />
      </Field>
      <Field
        htmlFor="album-inp"
        label={<><Disc size={15} aria-hidden="true" /> Album *</>}
        disabled={isMutating}
      >
        <Input
          id="album-inp"
          value={values.album}
          onChange={(event) => onChange("album", event.target.value)}
          placeholder="Kabu, Ethiopiques..."
          required
        />
      </Field>
      <GenreField>
        <FieldLabel>
          <Tag size={15} aria-hidden="true" /> Genre Category *
        </FieldLabel>
        <GenrePicker role="group" aria-label="Genre Category">
          {SONG_GENRES.map((genre) => (
            <Button
              id={`genre-preset-btn-${genre}`}
              key={genre}
              type="button"
              size="sm"
              tone={values.genre === genre ? "danger" : "neutral"}
              variant={values.genre === genre ? "solid" : "outline"}
              onClick={() => onChange("genre", genre)}
              disabled={isMutating}
            >
              {genre}
            </Button>
          ))}
        </GenrePicker>
      </GenreField>
      <Field
        htmlFor="duration-inp"
        label={<><Clock size={15} aria-hidden="true" /> Duration *</>}
        wide
        disabled={isMutating}
      >
        <Input
          id="duration-inp"
          value={values.duration}
          onChange={(event) => onChange("duration", event.target.value)}
          pattern="[0-9]{1,2}:[0-5][0-9]"
          placeholder="3:45"
          required
        />
      </Field>
      <Actions>
        <Button id="cancel-song-btn" onClick={onClose} disabled={isMutating}>
          Cancel
        </Button>
        <Button id="submit-song-btn" variant="solid" type="submit" disabled={isMutating}>
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

  [`@media (max-width: ${theme.breakpoints[1]})`]: {
    gridTemplateColumns: "1fr"
  }
}));

const ArtworkField = styled.div(({ theme }) => ({
  display: "grid",
  gap: theme.space[3],
  gridColumn: "1 / -1"
}));

const FieldLabel = styled.span(({ theme }) => ({
  alignItems: "center",
  color: theme.colors.text.secondary,
  display: "inline-flex",
  fontSize: theme.fontSizes.sm,
  fontWeight: theme.fontWeights.medium,
  gap: theme.space[2],
  lineHeight: theme.lineHeights.tight
}));

const ArtworkControl = styled.div(({ theme }) => ({
  alignItems: "center",
  display: "grid",
  gap: theme.space[4],
  gridTemplateColumns: "auto minmax(0, 1fr)",

  [`@media (max-width: ${theme.breakpoints[0]})`]: {
    alignItems: "stretch",
    gridTemplateColumns: "1fr"
  }
}));

const ArtworkPreview = styled.img(({ theme }) => ({
  aspectRatio: "1 / 1",
  background: theme.colors.surface.panelSubtle,
  borderRadius: theme.radii.sm,
  boxShadow: theme.shadows.raised,
  objectFit: "cover",
  width: 72
}));

const ArtworkInputs = styled.div({
  minWidth: 0
});

const PresetRow = styled.div(({ theme }) => ({
  alignItems: "center",
  display: "flex",
  gap: theme.space[2],
  marginTop: theme.space[3],

  span: {
    color: theme.colors.text.secondary,
    fontSize: theme.fontSizes.sm,
    fontWeight: theme.fontWeights.medium
  }
}));

const PresetButton = styled.button<{ $active?: boolean }>(({ theme, $active }) => ({
  aspectRatio: "1 / 1",
  background: "transparent",
  border: `2px solid ${$active ? theme.colors.intent.danger : "transparent"}`,
  borderRadius: theme.radii.sm,
  display: "grid",
  overflow: "hidden",
  padding: 0,
  placeItems: "center",
  position: "relative",
  width: 28,

  img: {
    height: "100%",
    objectFit: "cover",
    width: "100%"
  },

  svg: {
    color: theme.colors.text.inverse,
    position: "absolute"
  },

  "&:disabled": {
    cursor: "not-allowed",
    opacity: 0.62
  }
}));

const GenreField = styled.div(({ theme }) => ({
  display: "grid",
  gap: theme.space[3],
  gridColumn: "1 / -1"
}));

const GenrePicker = styled.div(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: theme.space[2]
}));

const Actions = styled.div(({ theme }) => ({
  display: "flex",
  gap: theme.space[3],
  gridColumn: "1 / -1",
  justifyContent: "flex-end",

  [`@media (max-width: ${theme.breakpoints[0]})`]: {
    alignItems: "stretch",
    flexDirection: "column-reverse"
  }
}));
