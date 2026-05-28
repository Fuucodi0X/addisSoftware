import styled from "@emotion/styled";
import { AlertCircle } from "lucide-react";
import type { ReactNode } from "react";
import type { SongLibraryStats } from "../../../store/songsSlice";
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
    return (
      <LoadingBlock>
        <Spinner />
        <p>Retrieving Song Library records...</p>
      </LoadingBlock>
    );
  }

  if (error) {
    return (
      <ErrorBanner>
        <AlertCircle size={20} />
        <div>
          <strong>Connection Error</strong>
          <p>{error}</p>
          <button type="button" onClick={onRetryCatalog}>
            Re-fetch catalog
          </button>
        </div>
      </ErrorBanner>
    );
  }

  if (activeTab === "stats") {
    return <StatsDashboard error={statsError} stats={stats} status={statsStatus} />;
  }

  return children;
};

const LoadingBlock = styled.div`
  min-height: 260px;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 12px;
  color: var(--app-text-secondary);
  font-size: 0.84rem;
  font-weight: 800;

  p {
    margin: 0;
  }
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid var(--app-border);
  border-top-color: var(--app-brand);
  border-radius: ${({ theme }) => theme.radii.full}px;
  animation: spin 800ms linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ErrorBanner = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  border: 1px solid var(--app-brand-border);
  border-radius: ${({ theme }) => theme.radii.lg}px;
  background: var(--app-brand-soft);
  color: var(--app-brand-hover);
  padding: 16px;

  p {
    margin: 3px 0 0;
    color: var(--app-brand);
    font-size: 0.78rem;
  }

  button {
    border: 0;
    background: transparent;
    color: var(--app-brand-text);
    padding: 8px 0 0;
    font-size: 0.72rem;
    font-weight: 850;
    text-decoration: underline;
  }
`;
