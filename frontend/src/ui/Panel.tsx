import styled from "@emotion/styled";
import type { HTMLAttributes, ReactNode } from "react";
import type { AppTheme } from "../design/theme";

export type PanelVariant = "flat" | "raised" | "outlined";
export type PanelTone = "neutral" | "danger" | "accent";

type NativePanelProps = Omit<HTMLAttributes<HTMLElement>, "color">;

export interface PanelProps extends NativePanelProps {
  children: ReactNode;
  tone?: PanelTone;
  variant?: PanelVariant;
}

export interface PanelSectionProps extends Omit<HTMLAttributes<HTMLDivElement>, "color"> {
  children: ReactNode;
}

interface PanelRecipe {
  background: string;
  border: string;
  color: string;
  shadow: string;
}

const getPanelRecipe = ({
  theme,
  tone,
  variant
}: {
  theme: AppTheme;
  tone: PanelTone;
  variant: PanelVariant;
}): PanelRecipe => {
  const toneStyles = {
    accent: {
      background: theme.palette.violet[100],
      border: theme.palette.violet[400],
      color: theme.colors.text.accent
    },
    danger: {
      background: theme.colors.intent.dangerSoft,
      border: theme.palette.rose[100],
      color: theme.colors.intent.danger
    },
    neutral: {
      background: theme.colors.surface.panel,
      border: theme.colors.border.default,
      color: theme.colors.text.primary
    }
  } satisfies Record<PanelTone, Omit<PanelRecipe, "shadow">>;

  const toneRecipe = toneStyles[tone];

  const variantStyles = {
    flat: {
      background: tone === "neutral" ? theme.colors.surface.panelSubtle : toneRecipe.background,
      border: "transparent",
      shadow: "none"
    },
    outlined: {
      background: theme.colors.surface.panel,
      border: toneRecipe.border,
      shadow: "none"
    },
    raised: {
      background: theme.colors.surface.panel,
      border: tone === "neutral" ? theme.colors.border.subtle : toneRecipe.border,
      shadow: theme.shadows.panel
    }
  } satisfies Record<PanelVariant, Pick<PanelRecipe, "background" | "border" | "shadow">>;

  return {
    ...variantStyles[variant],
    color: toneRecipe.color
  };
};

const StyledPanel = styled.section<{ $tone: PanelTone; $variant: PanelVariant }>(({ theme, $tone, $variant }) => {
  const recipe = getPanelRecipe({ theme, tone: $tone, variant: $variant });

  return {
    background: recipe.background,
    border: `1px solid ${recipe.border}`,
    borderRadius: theme.radii.sm,
    boxShadow: recipe.shadow,
    color: recipe.color,
    overflow: "hidden"
  };
});

const PanelHeaderShell = styled.div(({ theme }) => ({
  alignItems: "center",
  borderBottom: `1px solid ${theme.colors.border.default}`,
  display: "flex",
  gap: theme.space[4],
  justifyContent: "space-between",
  padding: `${theme.space[5]}px ${theme.space[6]}px`
}));

const PanelBodyShell = styled.div(({ theme }) => ({
  color: theme.colors.text.primary,
  padding: `${theme.space[6]}px`
}));

const PanelFooterShell = styled.div(({ theme }) => ({
  alignItems: "center",
  background: theme.colors.surface.panelSubtle,
  borderTop: `1px solid ${theme.colors.border.default}`,
  display: "flex",
  gap: theme.space[3],
  justifyContent: "flex-end",
  padding: `${theme.space[4]}px ${theme.space[6]}px`
}));

export const Panel = ({ children, tone = "neutral", variant = "raised", ...props }: PanelProps) => (
  <StyledPanel $tone={tone} $variant={variant} {...props}>
    {children}
  </StyledPanel>
);

export const PanelHeader = ({ children, ...props }: PanelSectionProps) => (
  <PanelHeaderShell {...props}>{children}</PanelHeaderShell>
);

export const PanelBody = ({ children, ...props }: PanelSectionProps) => <PanelBodyShell {...props}>{children}</PanelBodyShell>;

export const PanelFooter = ({ children, ...props }: PanelSectionProps) => (
  <PanelFooterShell {...props}>{children}</PanelFooterShell>
);
