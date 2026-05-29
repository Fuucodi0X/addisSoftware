import { useTheme } from "@emotion/react";
import type { Song } from "../../../store/songsSlice";
import { CachedArtworkImage } from "./CachedArtworkImage";
import { getSongArtworkMeta } from "./songArtwork";

interface SongArtworkProps {
  song: Song;
  className?: string;
}

export const SongArtwork = ({ song, className = "song-artwork" }: SongArtworkProps) => {
  const theme = useTheme();
  const placeholder = getSongArtworkMeta(song, theme.colors.avatar.placeholderPalettes);

  if (song.artworkUrl) {
    return <CachedArtworkImage className={className} src={song.artworkUrl} alt={`${song.album} artwork`} />;
  }

  return (
    <span
      className={`${className} placeholder-artwork`}
      style={{
        backgroundColor: placeholder.palette.background,
        color: placeholder.palette.accent
      }}
      aria-hidden="true"
    >
      {placeholder.initials}
    </span>
  );
};
