import styled from "@emotion/styled";
import type { SongStatsAdapters } from "../statsAdapters";

interface StatsGenreDistributionProps {
  adapters: SongStatsAdapters;
  totalSongs: number;
}

const segmentColors = [
  "var(--app-chart-segment-1)",
  "var(--app-chart-segment-2)",
  "var(--app-chart-segment-3)",
  "var(--app-chart-segment-4)",
  "var(--app-chart-segment-5)",
  "var(--app-chart-segment-6)"
];

export const StatsGenreDistribution = ({ adapters, totalSongs }: StatsGenreDistributionProps) => (
  <Distribution>
    <DistributionHeader>
      <strong>Songs Classification by Genre</strong>
      <span>Spectrum Distribution</span>
    </DistributionHeader>
    <StackedBar>
      {adapters.genreEntries.length > 0 ? (
        adapters.genreEntries.map(([genre, count], index) => (
          <StackSegment
            key={genre}
            title={`${genre}: ${count} Songs`}
            style={{
              width: `${totalSongs > 0 ? (count / totalSongs) * 100 : 0}%`,
              background: segmentColors[index % segmentColors.length]
            }}
          />
        ))
      ) : (
        <EmptyText>No genres classified in this session</EmptyText>
      )}
    </StackedBar>
    <LegendGrid>
      {adapters.genreEntries.map(([genre, count], index) => (
        <LegendItem key={genre}>
          <span style={{ background: segmentColors[index % segmentColors.length] }} />
          <strong>{genre}</strong>
          <em>{count}</em>
        </LegendItem>
      ))}
    </LegendGrid>
  </Distribution>
);

const Distribution = styled.div`
  display: grid;
  gap: 12px;
`;

const DistributionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  color: var(--app-text-secondary);
  font-size: 0.66rem;
  font-weight: 900;
  text-transform: uppercase;
`;

const StackedBar = styled.div`
  min-height: 18px;
  overflow: hidden;
  display: flex;
  border: 1px solid var(--app-border);
  border-radius: ${({ theme }) => theme.radii.sm}px;
  background: var(--app-panel-subtle);
`;

const StackSegment = styled.div`
  min-width: 2px;
`;

const LegendGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px 16px;
`;

const LegendItem = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid var(--app-panel-subtle);
  padding-bottom: 6px;
  color: var(--app-text-secondary);
  font-size: 0.68rem;
  font-weight: 800;

  span {
    width: 10px;
    height: 10px;
    border-radius: ${({ theme }) => theme.radii.xs}px;
  }

  em {
    color: var(--app-muted);
    font-style: normal;
    font-family: "JetBrains Mono", monospace;
  }
`;

const EmptyText = styled.p`
  margin: 0;
  color: var(--app-muted);
  font-size: 0.78rem;
  font-weight: 650;
  font-style: italic;
`;
