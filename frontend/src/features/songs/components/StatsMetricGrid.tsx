import styled from "@emotion/styled";
import { Disc, Music, Tag, User } from "lucide-react";
import { Box, Grid, Text } from "../../../design/primitives";
import type { SongLibraryStats } from "../../../store/songsSlice";

interface StatsMetricGridProps {
  totals: SongLibraryStats["totals"];
}

export const StatsMetricGrid = ({ totals }: StatsMetricGridProps) => (
  <MetricGrid>
    <MetricCard>
      <MetricLabel as="span" variant="label" tone="muted">
        Songs
      </MetricLabel>
      <Music size={16} />
      <strong>{totals.songs}</strong>
      <MetricCaption as="small" variant="caption" tone="muted">
        Indexed records
      </MetricCaption>
    </MetricCard>
    <MetricCard>
      <MetricLabel as="span" variant="label" tone="muted">
        Artists
      </MetricLabel>
      <User size={16} />
      <strong>{totals.artists}</strong>
      <MetricCaption as="small" variant="caption" tone="muted">
        Credited names
      </MetricCaption>
    </MetricCard>
    <MetricCard>
      <MetricLabel as="span" variant="label" tone="muted">
        Albums
      </MetricLabel>
      <Disc size={16} />
      <strong>{totals.albums}</strong>
      <MetricCaption as="small" variant="caption" tone="muted">
        Album names
      </MetricCaption>
    </MetricCard>
    <MetricCard>
      <MetricLabel as="span" variant="label" tone="muted">
        Genres
      </MetricLabel>
      <Tag size={16} />
      <strong>{totals.genres}</strong>
      <MetricCaption as="small" variant="caption" tone="muted">
        Classifications
      </MetricCaption>
    </MetricCard>
  </MetricGrid>
);

const MetricGrid = styled(Grid)`
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
`;

const MetricCard = styled(Box)`
  border: 1px solid var(--app-border);
  border-radius: ${({ theme }) => theme.radii.lg}px;
  background: var(--app-panel-subtle);
  padding: 16px;

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

`;

const MetricLabel = styled(Text)`
  display: inline;
  font-size: 0.62rem;
  letter-spacing: 0.08em;
`;

const MetricCaption = styled(Text)`
  font-size: 0.62rem;
  font-weight: 750;
`;
