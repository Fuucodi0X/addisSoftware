import styled from "@emotion/styled";
import { Activity, BarChart2, Layers } from "lucide-react";
import type { SongStatsAdapters } from "../statsAdapters";

interface StatsRatioListProps {
  adapters: SongStatsAdapters;
}

export const StatsRatioList = ({ adapters }: StatsRatioListProps) => (
  <RatioList>
    <RatioRow>
      <BarChart2 size={15} />
      <span>Songs per Artist</span>
      <strong>{adapters.averageSongsPerArtist}</strong>
    </RatioRow>
    <RatioRow>
      <Layers size={15} />
      <span>Songs per Album</span>
      <strong>{adapters.averageSongsPerAlbum}</strong>
    </RatioRow>
    <RatioRow>
      <Activity size={15} />
      <span>Albums per Artist</span>
      <strong>{adapters.averageAlbumsPerArtist}</strong>
    </RatioRow>
  </RatioList>
);

const RatioList = styled.div`
  display: grid;
  gap: 10px;
  border-top: 1px solid var(--app-border);
  padding-top: 18px;
`;

const RatioRow = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  border: 1px solid var(--app-border);
  border-radius: ${({ theme }) => theme.radii.md}px;
  background: var(--app-panel-subtle);
  padding: 10px;
  color: var(--app-text-secondary);
  font-size: 0.76rem;
  font-weight: 800;

  strong {
    border: 1px solid var(--app-border);
    border-radius: ${({ theme }) => theme.radii.sm}px;
    background: var(--app-panel);
    color: var(--app-text);
    padding: 3px 8px;
    font-family: "JetBrains Mono", monospace;
  }
`;
