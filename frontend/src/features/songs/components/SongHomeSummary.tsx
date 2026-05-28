import styled from "@emotion/styled";
import type { Song, SongLibraryStats } from "../../../store/songsSlice";
import { InCatalogArtistsPanel } from "./InCatalogArtistsPanel";
import { SongHeroPanel } from "./SongHeroPanel";

interface SongHomeSummaryProps {
  activeSong: Song | null;
  artists: SongLibraryStats["artists"];
  onSelectFeaturedSong: (song: Song) => void;
  onShowStats: () => void;
}

export const SongHomeSummary = ({ activeSong, artists, onSelectFeaturedSong, onShowStats }: SongHomeSummaryProps) => (
  <TopGrid>
    <SongHeroPanel activeSong={activeSong} onSelectFeaturedSong={onSelectFeaturedSong} />
    <InCatalogArtistsPanel artists={artists} onShowStats={onShowStats} />
  </TopGrid>
);

const TopGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 7fr) minmax(320px, 5fr);
  gap: 24px;

  @media (max-width: ${({ theme }) => theme.breakpoints[2]}) {
    grid-template-columns: 1fr;
  }
`;
