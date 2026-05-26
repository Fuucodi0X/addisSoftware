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
  typography,
  type BorderProps,
  type ColorProps,
  type FlexboxProps,
  type GridProps,
  type LayoutProps,
  type PositionProps,
  type ShadowProps,
  type SpaceProps,
  type TypographyProps
} from "styled-system";

type BasePrimitiveProps = SpaceProps & LayoutProps & ColorProps & BorderProps & PositionProps & ShadowProps;

export type BoxProps = BasePrimitiveProps;
export type FlexProps = BasePrimitiveProps & FlexboxProps;
export type GridPrimitiveProps = BasePrimitiveProps & GridProps;
export type StackProps = FlexProps;
export type InlineProps = FlexProps;
export type TextProps = BasePrimitiveProps & TypographyProps;

const baseSystem = compose(space, layout, color, border, position, shadow);
const flexSystem = compose(baseSystem, flexbox);
const gridSystem = compose(baseSystem, grid);
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
