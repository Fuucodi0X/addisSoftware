import styled from "@emotion/styled";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { AppTheme } from "../design/theme";

export type ButtonVariant = "solid" | "soft" | "outline" | "ghost";
export type ButtonTone = "neutral" | "accent" | "danger" | "success" | "warning";
export type ButtonSize = "sm" | "md" | "lg";
type LegacyButtonVariant = "primary" | "secondary" | "danger";

type NativeButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color">;

export interface ButtonProps extends NativeButtonProps {
  children: ReactNode;
  size?: ButtonSize;
  tone?: ButtonTone;
  variant?: ButtonVariant | LegacyButtonVariant;
}

export type IconButtonShape = "rounded" | "circle";

export interface IconButtonProps extends Omit<ButtonProps, "children"> {
  "aria-label": string;
  children: ReactNode;
  shape?: IconButtonShape;
}

interface ButtonRecipe {
  background: string;
  border: string;
  color: string;
  hoverBackground: string;
  hoverBorder: string;
  hoverColor: string;
  shadow: string;
}

const legacyVariantDefaults: Record<LegacyButtonVariant, { variant: ButtonVariant; tone: ButtonTone }> = {
  danger: { variant: "solid", tone: "danger" },
  primary: { variant: "solid", tone: "neutral" },
  secondary: { variant: "outline", tone: "neutral" }
};

const buttonSizes: Record<
  ButtonSize,
  {
    blockPadding: number;
    fontSize: "sm" | "md" | "lg";
    gap: number;
    iconSize: number;
    inlinePadding: number;
    minHeight: number;
  }
> = {
  sm: {
    blockPadding: 2,
    fontSize: "sm",
    gap: 2,
    iconSize: 16,
    inlinePadding: 4,
    minHeight: 32
  },
  md: {
    blockPadding: 3,
    fontSize: "md",
    gap: 3,
    iconSize: 18,
    inlinePadding: 5,
    minHeight: 40
  },
  lg: {
    blockPadding: 4,
    fontSize: "lg",
    gap: 4,
    iconSize: 20,
    inlinePadding: 6,
    minHeight: 48
  }
};

const resolveButtonState = (variant: ButtonProps["variant"], tone: ButtonTone) => {
  if (variant === "primary" || variant === "secondary" || variant === "danger") {
    return legacyVariantDefaults[variant];
  }

  return {
    variant: variant ?? "outline",
    tone
  };
};

const getToneColors = ({ theme, tone }: { theme: AppTheme; tone: ButtonTone }) => {
  const toneColors = {
    accent: {
      fill: theme.colors.action.accent,
      fillHover: theme.colors.action.accentHover,
      soft: theme.palette.violet[100],
      softHover: theme.palette.violet[400],
      text: theme.colors.text.accent
    },
    danger: {
      fill: theme.colors.intent.danger,
      fillHover: theme.palette.rose[500],
      soft: theme.colors.intent.dangerSoft,
      softHover: theme.palette.rose[100],
      text: theme.colors.intent.danger
    },
    neutral: {
      fill: theme.colors.action.primary,
      fillHover: theme.colors.action.primaryHover,
      soft: theme.colors.surface.panelSubtle,
      softHover: theme.palette.zinc[100],
      text: theme.colors.text.primary
    },
    success: {
      fill: theme.colors.intent.success,
      fillHover: theme.palette.emerald[500],
      soft: theme.colors.intent.successSoft,
      softHover: theme.palette.emerald[100],
      text: theme.colors.intent.success
    },
    warning: {
      fill: theme.colors.intent.warning,
      fillHover: theme.palette.amber[500],
      soft: theme.colors.intent.warningSoft,
      softHover: theme.palette.amber[100],
      text: theme.colors.intent.warning
    }
  } satisfies Record<ButtonTone, { fill: string; fillHover: string; soft: string; softHover: string; text: string }>;

  return toneColors[tone];
};

const getButtonRecipe = ({
  theme,
  tone,
  variant
}: {
  theme: AppTheme;
  tone: ButtonTone;
  variant: ButtonVariant;
}): ButtonRecipe => {
  const toneColors = getToneColors({ theme, tone });

  const recipes = {
    ghost: {
      background: "transparent",
      border: "transparent",
      color: toneColors.text,
      hoverBackground: toneColors.soft,
      hoverBorder: "transparent",
      hoverColor: toneColors.text,
      shadow: "none"
    },
    outline: {
      background: theme.colors.surface.panel,
      border: theme.colors.border.default,
      color: toneColors.text,
      hoverBackground: toneColors.soft,
      hoverBorder: tone === "neutral" ? theme.colors.border.strong : toneColors.text,
      hoverColor: toneColors.text,
      shadow: "none"
    },
    soft: {
      background: toneColors.soft,
      border: toneColors.soft,
      color: toneColors.text,
      hoverBackground: toneColors.softHover,
      hoverBorder: toneColors.softHover,
      hoverColor: toneColors.text,
      shadow: "none"
    },
    solid: {
      background: toneColors.fill,
      border: toneColors.fill,
      color: theme.colors.text.inverse,
      hoverBackground: toneColors.fillHover,
      hoverBorder: toneColors.fillHover,
      hoverColor: theme.colors.text.inverse,
      shadow: tone === "neutral" ? theme.shadows.raised : "none"
    }
  } satisfies Record<ButtonVariant, ButtonRecipe>;

  return recipes[variant];
};

const StyledButton = styled.button<{
  $size: ButtonSize;
  $tone: ButtonTone;
  $variant: ButtonVariant;
}>(({ theme, $size, $tone, $variant }) => {
  const size = buttonSizes[$size];
  const recipe = getButtonRecipe({ theme, tone: $tone, variant: $variant });

  return {
    alignItems: "center",
    background: recipe.background,
    border: `1px solid ${recipe.border}`,
    borderRadius: theme.radii.sm,
    boxShadow: recipe.shadow,
    color: recipe.color,
    display: "inline-flex",
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes[size.fontSize],
    fontWeight: theme.fontWeights.medium,
    gap: theme.space[size.gap],
    justifyContent: "center",
    lineHeight: theme.lineHeights.tight,
    minHeight: size.minHeight,
    padding: `${theme.space[size.blockPadding]}px ${theme.space[size.inlinePadding]}px`,
    textDecoration: "none",
    transition: "background-color 160ms ease, border-color 160ms ease, color 160ms ease, box-shadow 160ms ease, transform 160ms ease",
    userSelect: "none",
    whiteSpace: "nowrap",

    "& > svg": {
      flex: "0 0 auto",
      height: size.iconSize,
      width: size.iconSize
    },

    "&:hover:not(:disabled)": {
      background: recipe.hoverBackground,
      borderColor: recipe.hoverBorder,
      color: recipe.hoverColor,
      transform: $variant === "ghost" ? undefined : "translateY(-1px)"
    },

    "&:focus-visible": {
      boxShadow: `${recipe.shadow === "none" ? "" : `${recipe.shadow}, `}${theme.colors.focus.shadow}`,
      outline: "none"
    },

    "&:disabled": {
      background: $variant === "ghost" ? "transparent" : theme.palette.zinc[100],
      borderColor: $variant === "ghost" ? "transparent" : theme.colors.border.default,
      boxShadow: "none",
      color: theme.colors.text.muted,
      cursor: "not-allowed",
      transform: "none"
    }
  };
});

const StyledIconButton = styled(StyledButton)<{ $size: ButtonSize }>(({ $size }) => {
  const size = buttonSizes[$size];

  return {
    aspectRatio: "1 / 1",
    minWidth: size.minHeight,
    padding: 0
  };
});

const StyledRoundIconButton = styled(StyledIconButton)(({ theme }) => ({
  borderRadius: theme.radii.full
}));

export const Button = ({ children, size = "md", tone = "neutral", type = "button", variant, ...props }: ButtonProps) => {
  const resolved = resolveButtonState(variant, tone);

  return (
    <StyledButton $size={size} $tone={resolved.tone} $variant={resolved.variant} type={type} {...props}>
      {children}
    </StyledButton>
  );
};

export const IconButton = ({
  children,
  shape = "rounded",
  size = "md",
  tone = "neutral",
  type = "button",
  variant = "ghost",
  ...props
}: IconButtonProps) => {
  const resolved = resolveButtonState(variant, tone);
  const Component = shape === "circle" ? StyledRoundIconButton : StyledIconButton;

  return (
    <Component $size={size} $tone={resolved.tone} $variant={resolved.variant} type={type} {...props}>
      {children}
    </Component>
  );
};
