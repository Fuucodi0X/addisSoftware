import type { Song } from "../../../store/songsSlice";

type ArtworkPalette = {
  accent: string;
  background: string;
};

const hashText = (value: string) =>
  Array.from(value).reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) % 997, 7);

export const getSongArtworkMeta = (song: Song, placeholderPalettes: readonly ArtworkPalette[]) => {
  const seed = hashText(`${song.artist}-${song.album}-${song.title}`);

  return {
    palette: placeholderPalettes[seed % placeholderPalettes.length],
    initials: song.artist
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("")
  };
};
