import { useMemo } from "react";
import type { SongLibraryStats } from "../../../store/songsSlice";
import { getStatsAdapters } from "../statsAdapters";
import { StatsDashboardGrid, StatsDashboardShell } from "./StatsDashboardShell";
import { StatsDashboardError, StatsDashboardLoading } from "./StatsDashboardStatus";
import { StatsDetailsPanel } from "./StatsDetailsPanel";
import { StatsOverviewPanel } from "./StatsOverviewPanel";

interface StatsDashboardProps {
  error: string | null;
  stats: SongLibraryStats;
  status: "idle" | "loading" | "succeeded" | "failed";
}

export const StatsDashboard = ({ error, stats, status }: StatsDashboardProps) => {
  const adapters = useMemo(() => getStatsAdapters(stats), [stats]);

  if (status === "loading") {
    return <StatsDashboardLoading />;
  }

  if (status === "failed") {
    return <StatsDashboardError error={error} />;
  }

  return (
    <StatsDashboardShell id="datadoor-container">
      <StatsDashboardGrid>
        <StatsOverviewPanel adapters={adapters} stats={stats} />
        <StatsDetailsPanel adapters={adapters} stats={stats} />
      </StatsDashboardGrid>
    </StatsDashboardShell>
  );
};
