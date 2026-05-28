import styled from "@emotion/styled";
import { Disc, Music, Tag, User } from "lucide-react";
import type { SongLibraryStats } from "../../../store/songsSlice";

interface StatsMetricGridProps {
  totals: SongLibraryStats["totals"];
}

export const StatsMetricGrid = ({ totals }: StatsMetricGridProps) => (
  <MetricGrid>
    <MetricCard>
      <span>Songs</span>
      <Music size={16} />
      <strong>{totals.songs}</strong>
      <small>Indexed records</small>
    </MetricCard>
    <MetricCard>
      <span>Artists</span>
      <User size={16} />
      <strong>{totals.artists}</strong>
      <small>Credited names</small>
    </MetricCard>
    <MetricCard>
      <span>Albums</span>
      <Disc size={16} />
      <strong>{totals.albums}</strong>
      <small>Album names</small>
    </MetricCard>
    <MetricCard>
      <span>Genres</span>
      <Tag size={16} />
      <strong>{totals.genres}</strong>
      <small>Classifications</small>
    </MetricCard>
  </MetricGrid>
);

const MetricGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
`;

const MetricCard = styled.div`
  border: 1px solid var(--app-border);
  border-radius: ${({ theme }) => theme.radii.lg}px;
  background: var(--app-panel-subtle);
  padding: 16px;

  span {
    color: var(--app-muted);
    font-size: 0.62rem;
    font-weight: 950;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  svg {
    float: right;
    color: var(--app-analytics-accent);
  }

  strong {
    display: block;
    color: var(--app-text);
    font-family: "JetBrains Mono", monospace;
    font-size: 1.55rem;
    font-weight: 950;
  }

  small {
    color: var(--app-muted);
    font-size: 0.62rem;
    font-weight: 750;
  }
`;
