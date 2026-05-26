import type { Song } from "../../../store/songsSlice";

const placeholderPalettes = [
  { background: "#111111", accent: "#f05c3c" },
  { background: "#27364a", accent: "#eca83d" },
  { background: "#3f2f5f", accent: "#9c5aff" },
  { background: "#20463a", accent: "#6ee7b7" },
  { background: "#4d2f2a", accent: "#f7a072" }
];

const hashText = (value: string) =>
  Array.from(value).reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) % 997, 7);

export const getSongArtworkMeta = (song: Song) => {
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
