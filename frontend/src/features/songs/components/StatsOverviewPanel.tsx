import styled from "@emotion/styled";
import { Grid } from "../../../design/primitives";
import type { SongLibraryStats } from "../../../store/songsSlice";
import type { SongStatsAdapters } from "../statsAdapters";
import { StatsGenreDistribution } from "./StatsGenreDistribution";
import { StatsMetricGrid } from "./StatsMetricGrid";
import { StatsRatioList } from "./StatsRatioList";

interface StatsOverviewPanelProps {
  adapters: SongStatsAdapters;
  stats: SongLibraryStats;
}

export const StatsOverviewPanel = ({ adapters, stats }: StatsOverviewPanelProps) => (
  <StatsOverview as="section" id="datadoor-overview-pane">
    <StatsMetricGrid totals={stats.totals} />
    <StatsGenreDistribution adapters={adapters} totalSongs={stats.totals.songs} />
    <StatsRatioList adapters={adapters} />
  </StatsOverview>
);

const StatsOverview = styled(Grid)`
  align-content: start;
  gap: 24px;
`;
