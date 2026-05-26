import type { Song } from "../../../store/songsSlice";
import { getSongArtworkMeta } from "./songArtwork";

interface SongArtworkProps {
  song: Song;
  className?: string;
}

export const SongArtwork = ({ song, className = "song-artwork" }: SongArtworkProps) => {
  const placeholder = getSongArtworkMeta(song);

  if (song.artworkUrl) {
    return <img className={className} src={song.artworkUrl} alt={`${song.album} artwork`} />;
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
