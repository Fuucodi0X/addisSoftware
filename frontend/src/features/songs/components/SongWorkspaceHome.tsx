import styled from "@emotion/styled";
import type { ReactNode } from "react";
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
  <HomeView>
    <SongHomeSummary
      activeSong={activeSong}
      artists={artists}
      onSelectFeaturedSong={onSelectFeaturedSong}
      onShowStats={onShowStats}
    />
    {children}
  </HomeView>
);

const HomeView = styled.div`
  display: grid;
  gap: 24px;
`;
