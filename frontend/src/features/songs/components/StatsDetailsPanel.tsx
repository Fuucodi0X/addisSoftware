import styled from "@emotion/styled";
import { useState } from "react";
import { Grid } from "../../../design/primitives";
import type { SongLibraryStats } from "../../../store/songsSlice";
import type { SongStatsAdapters } from "../statsAdapters";
import { DominantCatalogCard } from "./DominantCatalogCard";
import { StatsDirectory } from "./StatsDirectory";

interface StatsDetailsPanelProps {
  adapters: SongStatsAdapters;
  stats: SongLibraryStats;
}

export const StatsDetailsPanel = ({ adapters, stats }: StatsDetailsPanelProps) => {
  const [activeSubTab, setActiveSubTab] = useState<"artists" | "albums">("artists");

  return (
    <StatsDetails as="section" id="datadoor-analytics-pane">
      <DominantCatalogCard adapters={adapters} />
      <StatsDirectory
        activeSubTab={activeSubTab}
        adapters={adapters}
        onSubTabChange={setActiveSubTab}
        stats={stats}
      />
    </StatsDetails>
  );
};

const StatsDetails = styled(Grid)`
  gap: 24px;
  align-content: start;
`;
