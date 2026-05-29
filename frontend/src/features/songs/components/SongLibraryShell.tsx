import styled from "@emotion/styled";
import type { ReactNode, Ref } from "react";
import { Flex } from "../../../design/primitives";

interface SongLibraryShellProps {
  children: ReactNode;
  floatingAction: ReactNode;
  footer: ReactNode;
  scrollRef: Ref<HTMLDivElement>;
  sidebar: ReactNode;
}

export const SongLibraryShell = ({ children, floatingAction, footer, scrollRef, sidebar }: SongLibraryShellProps) => (
  <Shell alignItems="center" bg="var(--app-panel-subtle)" justifyContent="center" minHeight="100vh" p={8}>
    <AppFrame
      id="lunio-app-shell"
      bg="var(--app-panel)"
      border="1px solid var(--app-border)"
      borderRadius="xl"
      boxShadow="var(--app-shadow-panel)"
      height="calc(100vh - 48px)"
      minHeight="760px"
      overflow="hidden"
      width="min(1280px, 100%)"
    >
      {sidebar}
      <Flex
        id="main-content-panel"
        bg="var(--app-surface)"
        flex={1}
        flexDirection="column"
        minWidth={0}
        overflow="hidden"
        position="relative"
      >
        <ScrollPanel
          id="main-scroll-view"
          ref={scrollRef}
          flex={1}
          flexDirection="column"
          minWidth={0}
          overflowX="hidden"
          overflowY="auto"
          p={9}
        >
          {children}
        </ScrollPanel>
        {footer}
        {floatingAction}
      </Flex>
    </AppFrame>
  </Shell>
);

const Shell = styled(Flex)`
  @media (max-width: ${({ theme }) => theme.breakpoints[0]}) {
    padding: 0;
  }
`;

const AppFrame = styled(Flex)`
  @media (max-width: ${({ theme }) => theme.breakpoints[2]}) {
    height: 100vh;
    min-height: 100vh;
    border-radius: 0;
    flex-direction: column;
  }
`;

const ScrollPanel = styled(Flex)`
  @media (max-width: ${({ theme }) => theme.breakpoints[2]}) {
    padding: 16px;
  }
`;
