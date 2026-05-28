import styled from "@emotion/styled";
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

export type BoxProps = BasePrimitiveProps;
export type FlexProps = BasePrimitiveProps & FlexboxProps & GapProps;
export type GridPrimitiveProps = BasePrimitiveProps & GridProps & GapProps;
export type StackProps = FlexProps;
export type InlineProps = FlexProps;
export type TextProps = BasePrimitiveProps & TypographyProps;
export type HeadingProps = TextProps;

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

export const Text = styled.p<TextProps>(
  {
    margin: 0
  },
  textSystem
);

export const Heading = styled.h2<HeadingProps>(
  {
    margin: 0
  },
  textSystem
);
