import styled from "@emotion/styled";
import type { Theme } from "@emotion/react";
import {
  border,
  color,
  compose,
  flexbox,
  grid,
  layout,
  position,
  shadow,
  space,
  system,
  typography,
  type BorderProps,
  type ColorProps,
  type FlexboxProps,
  type GridProps,
  type LayoutProps,
  type PositionProps,
  type ResponsiveValue,
  type ShadowProps,
  type SpaceProps,
  type TypographyProps
} from "styled-system";

type BasePrimitiveProps = SpaceProps & LayoutProps & ColorProps & BorderProps & PositionProps & ShadowProps;
type GapProps = {
  columnGap?: ResponsiveValue<number | string>;
  gap?: ResponsiveValue<number | string>;
  rowGap?: ResponsiveValue<number | string>;
};
type TextVariant = "body" | "supporting" | "caption" | "label" | "code";
type TextTone = "primary" | "secondary" | "muted" | "accent" | "inverse" | "success" | "warning" | "danger";
type HeadingVariant = "page" | "section" | "subsection" | "card";

export type BoxProps = BasePrimitiveProps;
export type FlexProps = BasePrimitiveProps & FlexboxProps & GapProps;
export type GridPrimitiveProps = BasePrimitiveProps & GridProps & GapProps;
export type StackProps = FlexProps;
export type InlineProps = FlexProps;
export type TextProps = BasePrimitiveProps &
  TypographyProps & {
    tone?: TextTone;
    variant?: TextVariant;
  };
export type HeadingProps = BasePrimitiveProps &
  TypographyProps & {
    tone?: TextTone;
    variant?: HeadingVariant;
  };

const baseSystem = compose(space, layout, color, border, position, shadow);
const gapSystem = system({
  columnGap: {
    property: "columnGap",
    scale: "space"
  },
  gap: {
    property: "gap",
    scale: "space"
  },
  rowGap: {
    property: "rowGap",
    scale: "space"
  }
});
const flexSystem = compose(baseSystem, flexbox, gapSystem);
const gridSystem = compose(baseSystem, grid, gapSystem);
const textSystem = compose(baseSystem, typography);
const primitiveShouldForwardProp = (propName: string) => propName !== "as" && propName !== "tone" && propName !== "variant";

const textToneColor = (theme: Theme, tone: TextTone) => {
  const toneColors = {
    accent: theme.colors.text.accent,
    danger: theme.colors.intent.danger,
    inverse: theme.colors.text.inverse,
    muted: theme.colors.text.muted,
    primary: theme.colors.text.primary,
    secondary: theme.colors.text.secondary,
    success: theme.colors.intent.success,
    warning: theme.colors.intent.warning
  };

  return toneColors[tone];
};

const textVariantStyles = (theme: Theme, variant: TextVariant) => {
  const variants = {
    body: {
      fontFamily: theme.fonts.body,
      fontSize: theme.fontSizes.md,
      fontWeight: theme.fontWeights.regular,
      lineHeight: theme.lineHeights.body
    },
    caption: {
      fontFamily: theme.fonts.body,
      fontSize: theme.fontSizes.xs,
      fontWeight: theme.fontWeights.regular,
      lineHeight: theme.lineHeights.body
    },
    code: {
      fontFamily: theme.fonts.mono,
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontWeights.medium,
      lineHeight: theme.lineHeights.body
    },
    label: {
      fontFamily: theme.fonts.body,
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontWeights.bold,
      lineHeight: theme.lineHeights.tight,
      textTransform: "uppercase"
    },
    supporting: {
      fontFamily: theme.fonts.body,
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontWeights.regular,
      lineHeight: theme.lineHeights.body
    }
  };

  return variants[variant];
};

const headingVariantStyles = (theme: Theme, variant: HeadingVariant) => {
  const variants = {
    card: {
      fontSize: theme.fontSizes.lg,
      lineHeight: theme.lineHeights.heading
    },
    page: {
      fontSize: theme.fontSizes["2xl"],
      lineHeight: theme.lineHeights.heading
    },
    section: {
      fontSize: theme.fontSizes.xl,
      lineHeight: theme.lineHeights.heading
    },
    subsection: {
      fontSize: theme.fontSizes.lg,
      lineHeight: theme.lineHeights.body
    }
  };

  return {
    fontFamily: theme.fonts.heading,
    fontWeight: theme.fontWeights.black,
    ...variants[variant]
  };
};

export const Box = styled.div<BoxProps>(baseSystem);

export const Flex = styled.div<FlexProps>(
  {
    display: "flex"
  },
  flexSystem
);

export const Grid = styled.div<GridPrimitiveProps>(
  {
    display: "grid"
  },
  gridSystem
);

export const Stack = styled.div<StackProps>(
  {
    display: "flex",
    flexDirection: "column"
  },
  flexSystem
);

export const Inline = styled.div<InlineProps>(
  {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap"
  },
  flexSystem
);

export const Text = styled("p", { shouldForwardProp: primitiveShouldForwardProp })<TextProps>(
  ({ theme, tone = "primary", variant = "body" }) => ({
    color: textToneColor(theme, tone),
    ...textVariantStyles(theme, variant),
    margin: 0
  }),
  textSystem
);

export const Heading = styled("h2", { shouldForwardProp: primitiveShouldForwardProp })<HeadingProps>(
  ({ theme, tone = "primary", variant = "section" }) => ({
    color: textToneColor(theme, tone),
    ...headingVariantStyles(theme, variant),
    margin: 0
  }),
  textSystem
);

export const VisuallyHidden = styled.span(
  {
    border: 0,
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    whiteSpace: "nowrap",
    width: 1
  }
);
