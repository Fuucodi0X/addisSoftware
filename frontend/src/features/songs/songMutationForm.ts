import { SONG_GENRES, type Song, type SongMutationPayload } from "../../store/songsSlice";

export const fallbackArtwork =
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=240&auto=format&fit=crop&q=80";

export const artworkPresets = [
  fallbackArtwork,
  "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=240&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=240&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=240&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=240&auto=format&fit=crop&q=80"
];

export interface SongFormValues {
  title: string;
  artist: string;
  album: string;
  genre: string;
  duration: string;
  artworkUrl: string;
}

export type SongModalState = { mode: "create"; song?: undefined } | { mode: "edit"; song: Song };

export interface SongFormState {
  values: SongFormValues;
  errors: string[];
}

export interface SongPayloadResult {
  payload?: SongMutationPayload;
  errors?: string[];
}

export const emptySongForm: SongFormValues = {
  title: "",
  artist: "",
  album: "",
  genre: "",
  duration: "",
  artworkUrl: artworkPresets[0]
};

const songFieldLimits = {
  title: 120,
  artist: 120,
  album: 120,
  genre: 80,
  duration: 5,
  artworkUrl: 2048
};

const durationPattern = /^\d{1,2}:[0-5]\d$/;

export const getSongFormValues = (song?: Song): SongFormValues => ({
  title: song?.title ?? "",
  artist: song?.artist ?? "",
  album: song?.album ?? "",
  genre: song?.genre ?? "",
  duration: song?.duration ?? "",
  artworkUrl: song?.artworkUrl ?? ""
});

export const getCreateSongFormValues = (presetIndex: number): SongFormValues => ({
  ...emptySongForm,
  artworkUrl: artworkPresets[presetIndex] ?? artworkPresets[0]
});

export const getSongModalTitle = (modal: SongModalState | null) =>
  modal?.mode === "edit" ? "Edit Song Metadata" : "Add Song to Catalog";

export const getSongModalActionLabel = (modal: SongModalState | null) =>
  modal?.mode === "edit" ? "Update Record" : "Save Song";

export const getClearedSongFormState = (): SongFormState => ({
  values: emptySongForm,
  errors: []
});

export const getSongPayload = (values: SongFormValues): SongPayloadResult => {
  const trimmed = {
    title: values.title.trim(),
    artist: values.artist.trim(),
    album: values.album.trim(),
    genre: values.genre.trim(),
    duration: values.duration.trim(),
    artworkUrl: values.artworkUrl.trim()
  };
  const errors: string[] = [];

  for (const field of ["title", "artist", "album", "genre", "duration"] as const) {
    if (!trimmed[field]) {
      errors.push(`${field} is required.`);
    } else if (trimmed[field].length > songFieldLimits[field]) {
      errors.push(`${field} must be ${songFieldLimits[field]} characters or fewer.`);
    }
  }

  const genre = SONG_GENRES.find((allowedGenre) => allowedGenre === trimmed.genre);

  if (trimmed.genre && !genre) {
    errors.push(`genre must be one of: ${SONG_GENRES.join(", ")}.`);
  }

  if (trimmed.duration && !durationPattern.test(trimmed.duration)) {
    errors.push("duration must use M:SS or MM:SS format.");
  }

  if (trimmed.artworkUrl.length > songFieldLimits.artworkUrl) {
    errors.push(`artworkUrl must be ${songFieldLimits.artworkUrl} characters or fewer.`);
  }

  if (!genre || errors.length > 0) {
    return { errors };
  }

  return {
    payload: {
      title: trimmed.title,
      artist: trimmed.artist,
      album: trimmed.album,
      genre,
      duration: trimmed.duration,
      artworkUrl: trimmed.artworkUrl || null
    }
  };
};
