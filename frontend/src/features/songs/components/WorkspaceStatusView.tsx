import styled from "@emotion/styled";
import type { ReactNode } from "react";
import type { SongLibraryStats } from "../../../store/songsSlice";
import { ErrorState, LoadingState } from "../../../ui/StatusFeedback";
import { StatsDashboard } from "./StatsDashboard";

type AppTab = "home" | "stats";

interface WorkspaceStatusViewProps {
  activeTab: AppTab;
  children: ReactNode;
  error: string | null;
  isInitialSongsLoading: boolean;
  onRetryCatalog: () => void;
  stats: SongLibraryStats;
  statsError: string | null;
  statsStatus: "idle" | "loading" | "succeeded" | "failed";
}

export const WorkspaceStatusView = ({
  activeTab,
  children,
  error,
  isInitialSongsLoading,
  onRetryCatalog,
  stats,
  statsError,
  statsStatus
}: WorkspaceStatusViewProps) => {
  if (isInitialSongsLoading) {
    return <LoadingState>Retrieving Song Library records...</LoadingState>;
  }

  if (error) {
    return (
      <ErrorState
        title="Connection Error"
        action={
          <RetryButton type="button" onClick={onRetryCatalog}>
            Re-fetch catalog
          </RetryButton>
        }
      >
        {error}
      </ErrorState>
    );
  }

  if (activeTab === "stats") {
    return <StatsDashboard error={statsError} stats={stats} status={statsStatus} />;
  }

  return children;
};

const RetryButton = styled.button`
  border: 0;
  background: transparent;
  color: var(--app-brand-text);
  padding: 8px 0 0;
  font-size: 0.72rem;
  font-weight: 850;
  text-decoration: underline;
`;
