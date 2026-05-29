import styled from "@emotion/styled";
import { AlertCircle } from "lucide-react";
import { Flex, Grid, Text } from "../../../design/primitives";
import { StatsDashboardShell } from "./StatsDashboardShell";

interface StatsDashboardErrorProps {
  error: string | null;
}

export const StatsDashboardLoading = () => (
  <StatsDashboardShell>
    <LoadingBlock>
      <Spinner />
      <Text variant="supporting" tone="secondary">
        Calculating catalog telemetry...
      </Text>
    </LoadingBlock>
  </StatsDashboardShell>
);

export const StatsDashboardError = ({ error }: StatsDashboardErrorProps) => (
  <ErrorBanner>
    <AlertCircle size={20} />
    <div>
      <strong>Unable to load statistics</strong>
      <p>{error}</p>
    </div>
  </ErrorBanner>
);

const LoadingBlock = styled(Grid)`
  min-height: 260px;
  place-items: center;
  align-content: center;
  gap: 12px;
  color: var(--app-text-secondary);
  font-size: 0.84rem;
  font-weight: 800;
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

const ErrorBanner = styled(Flex)`
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
`;
