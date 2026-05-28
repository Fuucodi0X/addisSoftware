import styled from "@emotion/styled";
import type { ReactNode, Ref } from "react";
import { Box, Flex } from "../../../design/primitives";

interface SongLibraryShellProps {
  children: ReactNode;
  floatingAction: ReactNode;
  footer: ReactNode;
  scrollRef: Ref<HTMLDivElement>;
  sidebar: ReactNode;
}

export const SongLibraryShell = ({ children, floatingAction, footer, scrollRef, sidebar }: SongLibraryShellProps) => (
  <Shell>
    <AppFrame id="lunio-app-shell">
      {sidebar}
      <MainPanel id="main-content-panel">
        <ScrollPanel id="main-scroll-view" ref={scrollRef}>
          {children}
        </ScrollPanel>
        {footer}
        {floatingAction}
      </MainPanel>
    </AppFrame>
  </Shell>
);

const Shell = styled(Flex)`
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: var(--app-panel-subtle);

  @media (max-width: ${({ theme }) => theme.breakpoints[0]}) {
    padding: 0;
  }
`;

const AppFrame = styled(Flex)`
  width: min(1280px, 100%);
  height: calc(100vh - 48px);
  min-height: 760px;
  overflow: hidden;
  border: 1px solid var(--app-border);
  border-radius: ${({ theme }) => theme.radii.xl}px;
  background: var(--app-panel);
  box-shadow: var(--app-shadow-panel);

  @media (max-width: ${({ theme }) => theme.breakpoints[2]}) {
    height: 100vh;
    min-height: 100vh;
    border-radius: 0;
    flex-direction: column;
  }
`;

const MainPanel = styled(Flex)`
  min-width: 0;
  flex: 1;
  flex-direction: column;
  position: relative;
  background: var(--app-surface);
  overflow: hidden;
`;

const ScrollPanel = styled(Box)`
  flex: 1;
  min-width: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 32px;

  @media (max-width: ${({ theme }) => theme.breakpoints[2]}) {
    padding: 16px;
  }
`;
