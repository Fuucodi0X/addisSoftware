import { ErrorState, LoadingState } from "../../../ui/StatusFeedback";
import { StatsDashboardShell } from "./StatsDashboardShell";

interface StatsDashboardErrorProps {
  error: string | null;
}

export const StatsDashboardLoading = () => (
  <StatsDashboardShell>
    <LoadingState>Calculating catalog telemetry...</LoadingState>
  </StatsDashboardShell>
);

export const StatsDashboardError = ({ error }: StatsDashboardErrorProps) => (
  <ErrorState title="Unable to load statistics">{error}</ErrorState>
);
