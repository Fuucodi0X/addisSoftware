import styled from "@emotion/styled";
import type { ReactNode } from "react";
import { Box, Grid } from "../../../design/primitives";

interface StatsDashboardShellProps {
  children: ReactNode;
  id?: string;
}

export const StatsDashboardShell = ({ children, id }: StatsDashboardShellProps) => (
  <StatsShell as="section" id={id}>
    {children}
  </StatsShell>
);

export const StatsDashboardGrid = ({ children }: { children: ReactNode }) => <StatsGrid>{children}</StatsGrid>;

const StatsShell = styled(Box)`
  border: 1px solid var(--app-border);
  border-radius: ${({ theme }) => theme.radii.xl}px;
  background: var(--app-panel);
  padding: 28px;
  box-shadow: var(--app-shadow-soft);
`;

const StatsGrid = styled(Grid)`
  grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
  align-items: start;
  gap: 34px;

  @media (max-width: ${({ theme }) => theme.breakpoints[2]}) {
    grid-template-columns: 1fr;
  }
`;
