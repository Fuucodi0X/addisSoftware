import { rawTokens } from "./tokens";

export const theme = {
  ...rawTokens,
  colors: {
    surface: {
      canvas: rawTokens.palette.zinc[100],
      app: rawTokens.palette.ivory[50],
      panel: rawTokens.palette.white,
      panelSubtle: rawTokens.palette.ivory[100],
      inverse: rawTokens.palette.zinc[900],
      overlay: "rgba(24, 24, 27, 0.62)"
    },
    text: {
      primary: rawTokens.palette.zinc[900],
      secondary: rawTokens.palette.zinc[600],
      muted: rawTokens.palette.zinc[400],
      inverse: rawTokens.palette.white,
      accent: rawTokens.palette.violet[600]
    },
    border: {
      subtle: rawTokens.palette.zinc[100],
      default: rawTokens.palette.zinc[200],
      strong: rawTokens.palette.zinc[300],
      inverse: rawTokens.palette.zinc[700]
    },
    action: {
      primary: rawTokens.palette.zinc[900],
      primaryHover: rawTokens.palette.black,
      secondary: rawTokens.palette.white,
      accent: rawTokens.palette.violet[500],
      accentHover: rawTokens.palette.violet[600]
    },
    intent: {
      success: rawTokens.palette.emerald[600],
      successSoft: rawTokens.palette.emerald[100],
      warning: rawTokens.palette.amber[600],
      warningSoft: rawTokens.palette.amber[100],
      danger: rawTokens.palette.rose[600],
      dangerSoft: rawTokens.palette.rose[100],
      info: rawTokens.palette.cyan[500],
      infoSoft: rawTokens.palette.cyan[100]
    },
    focus: {
      ring: rawTokens.palette.violet[500],
      shadow: rawTokens.shadows.focus
    },
    chart: {
      primary: rawTokens.palette.zinc[900],
      accent: rawTokens.palette.violet[500],
      success: rawTokens.palette.emerald[500],
      warning: rawTokens.palette.amber[500],
      danger: rawTokens.palette.rose[500],
      info: rawTokens.palette.cyan[500]
    }
  },
  fonts: {
    body: '"Avenir Next", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
    heading: '"Avenir Next", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
    mono: '"JetBrains Mono", "SFMono-Regular", Consolas, monospace'
  }
} as const;

export type AppTheme = typeof theme;
