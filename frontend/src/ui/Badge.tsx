import styled from "@emotion/styled";
import type { HTMLAttributes, ReactNode } from "react";
import type { AppTheme } from "../design/theme";

export type BadgeTone = "neutral" | "accent" | "danger" | "success" | "warning" | "info";
export type BadgeVariant = "solid" | "soft" | "outline";
export type BadgeSize = "sm" | "md";

type NativeBadgeProps = Omit<HTMLAttributes<HTMLSpanElement>, "color">;

export interface BadgeProps extends NativeBadgeProps {
  children: ReactNode;
  size?: BadgeSize;
  tone?: BadgeTone;
  variant?: BadgeVariant;
}

interface BadgeRecipe {
  background: string;
  border: string;
  color: string;
}

const getToneColors = ({ theme, tone }: { theme: AppTheme; tone: BadgeTone }) => {
  const toneColors = {
    accent: {
      fill: theme.colors.action.accent,
      soft: theme.palette.violet[100],
      text: theme.colors.text.accent
    },
    danger: {
      fill: theme.colors.intent.danger,
      soft: theme.colors.intent.dangerSoft,
      text: theme.colors.intent.danger
    },
    info: {
      fill: theme.colors.intent.info,
      soft: theme.colors.intent.infoSoft,
      text: theme.colors.intent.info
    },
    neutral: {
      fill: theme.colors.action.primary,
      soft: theme.colors.surface.panelSubtle,
      text: theme.colors.text.secondary
    },
    success: {
      fill: theme.colors.intent.success,
      soft: theme.colors.intent.successSoft,
      text: theme.colors.intent.success
    },
    warning: {
      fill: theme.colors.intent.warning,
      soft: theme.colors.intent.warningSoft,
      text: theme.colors.intent.warning
    }
  } satisfies Record<BadgeTone, { fill: string; soft: string; text: string }>;

  return toneColors[tone];
};

const getBadgeRecipe = ({
  theme,
  tone,
  variant
}: {
  theme: AppTheme;
  tone: BadgeTone;
  variant: BadgeVariant;
}): BadgeRecipe => {
  const toneColors = getToneColors({ theme, tone });

  const recipes = {
    outline: {
      background: "transparent",
      border: tone === "neutral" ? theme.colors.border.default : toneColors.text,
      color: toneColors.text
    },
    soft: {
      background: toneColors.soft,
      border: toneColors.soft,
      color: toneColors.text
    },
    solid: {
      background: toneColors.fill,
      border: toneColors.fill,
      color: theme.colors.text.inverse
    }
  } satisfies Record<BadgeVariant, BadgeRecipe>;

  return recipes[variant];
};

const badgeSizes = {
  md: {
    fontSize: "sm",
    gap: 2,
    paddingBlock: 2,
    paddingInline: 4
  },
  sm: {
    fontSize: "xs",
    gap: 1,
    paddingBlock: 1,
    paddingInline: 3
  }
} satisfies Record<
  BadgeSize,
  { fontSize: "xs" | "sm"; gap: number; paddingBlock: number; paddingInline: number }
>;

const StyledBadge = styled.span<{ $size: BadgeSize; $tone: BadgeTone; $variant: BadgeVariant }>(
  ({ theme, $size, $tone, $variant }) => {
    const size = badgeSizes[$size];
    const recipe = getBadgeRecipe({ theme, tone: $tone, variant: $variant });

    return {
      alignItems: "center",
      background: recipe.background,
      border: `1px solid ${recipe.border}`,
      borderRadius: theme.radii.full,
      color: recipe.color,
      display: "inline-flex",
      flex: "0 0 auto",
      fontSize: theme.fontSizes[size.fontSize],
      fontWeight: theme.fontWeights.bold,
      gap: theme.space[size.gap],
      lineHeight: theme.lineHeights.tight,
      maxWidth: "100%",
      padding: `${theme.space[size.paddingBlock]}px ${theme.space[size.paddingInline]}px`,
      textTransform: "uppercase",
      whiteSpace: "nowrap"
    };
  }
);

export const Badge = ({ children, size = "md", tone = "neutral", variant = "soft", ...props }: BadgeProps) => (
  <StyledBadge $size={size} $tone={tone} $variant={variant} {...props}>
    {children}
  </StyledBadge>
);
