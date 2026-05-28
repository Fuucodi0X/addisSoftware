import styled from "@emotion/styled";
import { BarChart3, Moon, Sun } from "lucide-react";
import { IconButton } from "../../../ui/Button";

type AppTab = "home" | "stats";
type ColorMode = "light" | "dark";
type ColorPreference = "system" | ColorMode;

interface SongWorkspaceSidebarProps {
  activeTab: AppTab;
  mode: ColorMode;
  onGoHome: () => void;
  onToggleMode: () => void;
  onToggleStats: () => void;
  preference: ColorPreference;
}

export const SongWorkspaceSidebar = ({
  activeTab,
  mode,
  onGoHome,
  onToggleMode,
  onToggleStats,
  preference
}: SongWorkspaceSidebarProps) => (
  <Sidebar id="sidebar-panel" aria-label="Primary">
    <BrandButton id="sidebar-home-btn" type="button" aria-label="Show home page" onClick={onGoHome}>
      <span />
      <span />
      <span />
    </BrandButton>
    <SidebarSpacer aria-hidden="true" />
    <SidebarControls>
      <StatsToggleButton
        id="sidebar-stats-btn"
        type="button"
        title="Show stats page"
        aria-label="Show stats page"
        aria-pressed={activeTab === "stats"}
        shape="circle"
        size="md"
        variant="soft"
        onClick={onToggleStats}
      >
        <BarChart3 size={17} />
      </StatsToggleButton>
      <IconButton
        id="theme-toggle-btn"
        type="button"
        title={`Switch to ${mode === "dark" ? "light" : "dark"} theme`}
        aria-label={`Switch to ${mode === "dark" ? "light" : "dark"} theme`}
        aria-pressed={preference !== "system"}
        shape="circle"
        size="md"
        variant="soft"
        onClick={onToggleMode}
      >
        {mode === "dark" ? <Sun size={17} /> : <Moon size={17} />}
      </IconButton>
    </SidebarControls>
  </Sidebar>
);

const Sidebar = styled.aside`
  width: 72px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 24px 14px;
  border-right: 1px solid var(--app-border-subtle);
  background: var(--app-panel);
  flex-shrink: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints[2]}) {
    width: 100%;
    height: 64px;
    flex-direction: row;
    border-right: 0;
    border-bottom: 1px solid var(--app-border-subtle);
    padding: 12px;
  }
`;

const BrandButton = styled.button`
  width: 40px;
  height: 40px;
  border: 0;
  border-radius: ${({ theme }) => theme.radii.full}px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  background: var(--app-brand);
  box-shadow: var(--app-shadow-brand-control);

  span {
    height: 2px;
    width: 16px;
    border-radius: ${({ theme }) => theme.radii.full}px;
    background: var(--app-on-brand);
  }

  span:nth-of-type(2) {
    width: 19px;
  }
`;

const SidebarSpacer = styled.div`
  width: 40px;
  height: 40px;
`;

const SidebarControls = styled.div`
  display: grid;
  gap: 12px;
  justify-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints[2]}) {
    display: flex;
    gap: 10px;
  }
`;

const StatsToggleButton = styled(IconButton)`
  position: relative;

  &[aria-pressed="true"] {
    background: var(--app-brand-subtle);
    border-color: var(--app-brand);
    box-shadow:
      inset 0 0 0 1px var(--app-brand-border),
      var(--app-shadow-soft);
  }

  &[aria-pressed="true"]:hover {
    background: var(--app-brand-subtle);
  }

  &[aria-pressed="true"]::after {
    content: "";
    position: absolute;
    right: ${({ theme }) => theme.space[1]}px;
    top: ${({ theme }) => theme.space[1]}px;
    width: ${({ theme }) => theme.space[2]}px;
    height: ${({ theme }) => theme.space[2]}px;
    border: 2px solid var(--app-panel);
    border-radius: ${({ theme }) => theme.radii.full}px;
    background: var(--app-success);
  }
`;
