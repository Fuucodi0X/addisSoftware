import { describe, expect, it } from "vitest";
import {
  getCreateSongFormValues,
  getSongFormValues,
  getSongModalActionLabel,
  getSongModalTitle,
  getSongPayload,
  type SongFormValues,
  type SongModalState
} from "./songMutationForm";
import type { Song } from "../../store/songsSlice";

const validValues = (overrides?: Partial<SongFormValues>): SongFormValues => ({
  title: "  Ambassel  ",
  artist: " Aster Aweke ",
  album: " Kabu ",
  genre: " Pop ",
  duration: " 3:45 ",
  artworkUrl: "  https://example.test/artwork.jpg  ",
  ...overrides
});

const song: Song = {
  id: "song-1",
  title: "Tizita",
  artist: "Mulatu Astatke",
  album: "Ethiopiques",
  genre: "Ethio-jazz",
  duration: "4:08",
  artworkUrl: null,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z"
};

describe("songMutationForm", () => {
  it("builds trimmed create and update mutation payloads", () => {
    expect(getSongPayload(validValues())).toEqual({
      payload: {
        title: "Ambassel",
        artist: "Aster Aweke",
        album: "Kabu",
        genre: "Pop",
        duration: "3:45",
        artworkUrl: "https://example.test/artwork.jpg"
      }
    });

    expect(getSongPayload(validValues({ artworkUrl: "   " }))).toEqual({
      payload: {
        title: "Ambassel",
        artist: "Aster Aweke",
        album: "Kabu",
        genre: "Pop",
        duration: "3:45",
        artworkUrl: null
      }
    });
  });

  it("returns validation errors for required fields, genre, duration, and artwork limits", () => {
    const result = getSongPayload(
      validValues({
        title: " ",
        genre: "Fusion",
        duration: "345",
        artworkUrl: "x".repeat(2049)
      })
    );

    expect(result.payload).toBeUndefined();
    expect(result.errors).toEqual([
      "title is required.",
      "genre must be one of: Ethio-jazz, Pop, Contemporary, Soul, Traditional.",
      "duration must use M:SS or MM:SS format.",
      "artworkUrl must be 2048 characters or fewer."
    ]);
  });

  it("adapts Song records and modal labels for create and edit flows", () => {
    const editModal: SongModalState = { mode: "edit", song };

    expect(getCreateSongFormValues(999).artworkUrl).toMatch(/^https:\/\/images\.unsplash\.com\//);
    expect(getSongFormValues(song)).toEqual({
      title: "Tizita",
      artist: "Mulatu Astatke",
      album: "Ethiopiques",
      genre: "Ethio-jazz",
      duration: "4:08",
      artworkUrl: ""
    });
    expect(getSongModalTitle(null)).toBe("Add Song to Catalog");
    expect(getSongModalActionLabel(null)).toBe("Save Song");
    expect(getSongModalTitle(editModal)).toBe("Edit Song Metadata");
    expect(getSongModalActionLabel(editModal)).toBe("Update Record");
  });
});
