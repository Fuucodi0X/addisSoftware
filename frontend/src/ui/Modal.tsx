import type { ReactNode } from "react";
import styled from "@emotion/styled";
import { X } from "lucide-react";
import { IconButton } from "./Button";

interface ModalProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
  labelledBy: string;
  size?: "form" | "confirm";
  tone?: "neutral" | "danger";
}

const Backdrop = styled.div(({ theme }) => ({
  alignItems: "center",
  background: theme.colors.surface.overlay,
  display: "flex",
  inset: 0,
  justifyContent: "center",
  padding: theme.space[6],
  position: "fixed",
  zIndex: 40
}));

const Panel = styled.section<{ $size: "form" | "confirm"; $tone: "neutral" | "danger" }>(({ theme, $size, $tone }) => ({
  background: theme.colors.surface.panel,
  border: `1px solid ${$tone === "danger" ? theme.colors.intent.dangerSoft : theme.colors.border.default}`,
  borderRadius: theme.radii.sm,
  boxShadow: theme.shadows.panel,
  color: theme.colors.text.primary,
  maxHeight: "min(86vh, 760px)",
  maxWidth: $size === "confirm" ? 440 : 680,
  overflow: "auto",
  width: "100%"
}));

const Header = styled.div<{ $tone: "neutral" | "danger" }>(({ theme, $tone }) => ({
  alignItems: "center",
  background: $tone === "danger" ? theme.colors.intent.dangerSoft : theme.colors.surface.panelSubtle,
  borderBottom: `1px solid ${theme.colors.border.default}`,
  display: "flex",
  gap: theme.space[4],
  justifyContent: "space-between",
  padding: `${theme.space[6]}px ${theme.space[7]}px`,

  h2: {
    color: $tone === "danger" ? theme.colors.intent.danger : theme.colors.text.primary,
    fontFamily: theme.fonts.heading,
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.fontWeights.bold,
    lineHeight: theme.lineHeights.heading,
    margin: 0
  }
}));

export const Modal = ({ title, children, onClose, labelledBy, size = "form", tone = "neutral" }: ModalProps) => (
  <Backdrop role="presentation">
    <Panel
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
      $size={size}
      $tone={tone}
    >
      <Header $tone={tone}>
        <h2 id={labelledBy}>{title}</h2>
        <IconButton size="sm" variant="ghost" tone={tone} onClick={onClose} aria-label={`Close ${title}`}>
          <X aria-hidden="true" />
        </IconButton>
      </Header>
      {children}
    </Panel>
  </Backdrop>
);
