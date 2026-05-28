import type { ReactNode } from "react";
import { Stack } from "../../../design/primitives";
import type { Song, SongLibraryStats } from "../../../store/songsSlice";
import { SongHomeSummary } from "./SongHomeSummary";

interface SongWorkspaceHomeProps {
  activeSong: Song | null;
  artists: SongLibraryStats["artists"];
  children: ReactNode;
  onSelectFeaturedSong: (song: Song) => void;
  onShowStats: () => void;
}

export const SongWorkspaceHome = ({
  activeSong,
  artists,
  children,
  onSelectFeaturedSong,
  onShowStats
}: SongWorkspaceHomeProps) => (
  <Stack gap={8}>
    <SongHomeSummary
      activeSong={activeSong}
      artists={artists}
      onSelectFeaturedSong={onSelectFeaturedSong}
      onShowStats={onShowStats}
    />
    {children}
  </Stack>
);
