import styled from "@emotion/styled";
import { Flex, Grid, Inline, Stack, Text } from "../../../design/primitives";
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
      <HeaderLabel as="strong" variant="label" tone="secondary">
        Songs Classification by Genre
      </HeaderLabel>
      <HeaderLabel as="span" variant="label" tone="secondary">
        Spectrum Distribution
      </HeaderLabel>
    </DistributionHeader>
    <StackedBar role="presentation">
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
          <Text as="strong" variant="supporting" tone="secondary">
            {genre}
          </Text>
          <em>{count}</em>
        </LegendItem>
      ))}
    </LegendGrid>
  </Distribution>
);

const Distribution = styled(Stack)`
  gap: 12px;
`;

const DistributionHeader = styled(Inline)`
  justify-content: space-between;
  gap: 12px;
`;

const HeaderLabel = styled(Text)`
  font-size: 0.66rem;
  font-weight: 900;
`;

const StackedBar = styled(Flex)`
  min-height: 18px;
  overflow: hidden;
  border: 1px solid var(--app-border);
  border-radius: ${({ theme }) => theme.radii.sm}px;
  background: var(--app-panel-subtle);
`;

const StackSegment = styled.div`
  min-width: 2px;
`;

const LegendGrid = styled(Grid)`
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px 16px;
`;

const LegendItem = styled(Grid)`
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid var(--app-panel-subtle);
  padding-bottom: 6px;
  color: var(--app-text-secondary);
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
    font-size: 0.68rem;
  }
`;

const EmptyText = styled(Text)`
  font-size: 0.78rem;
  font-weight: 650;
  font-style: italic;
`;
