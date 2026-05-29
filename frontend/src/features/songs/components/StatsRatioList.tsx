import styled from "@emotion/styled";
import { Activity, BarChart2, Layers } from "lucide-react";
import { Grid, Stack, Text } from "../../../design/primitives";
import type { SongStatsAdapters } from "../statsAdapters";

interface StatsRatioListProps {
  adapters: SongStatsAdapters;
}

export const StatsRatioList = ({ adapters }: StatsRatioListProps) => (
  <RatioList>
    <RatioRow>
      <BarChart2 size={15} />
      <Text as="span" variant="supporting" tone="secondary">
        Songs per Artist
      </Text>
      <RatioValue as="strong" variant="code">
        {adapters.averageSongsPerArtist}
      </RatioValue>
    </RatioRow>
    <RatioRow>
      <Layers size={15} />
      <Text as="span" variant="supporting" tone="secondary">
        Songs per Album
      </Text>
      <RatioValue as="strong" variant="code">
        {adapters.averageSongsPerAlbum}
      </RatioValue>
    </RatioRow>
    <RatioRow>
      <Activity size={15} />
      <Text as="span" variant="supporting" tone="secondary">
        Albums per Artist
      </Text>
      <RatioValue as="strong" variant="code">
        {adapters.averageAlbumsPerArtist}
      </RatioValue>
    </RatioRow>
  </RatioList>
);

const RatioList = styled(Stack)`
  gap: 10px;
  border-top: 1px solid var(--app-border);
  padding-top: 18px;
`;

const RatioRow = styled(Grid)`
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
`;

const RatioValue = styled(Text)`
  border: 1px solid var(--app-border);
  border-radius: ${({ theme }) => theme.radii.sm}px;
  background: var(--app-panel);
  padding: 3px 8px;
`;
