import { rawTokens } from "./tokens";

const sharedTheme = {
  ...rawTokens,
  fonts: {
    body: '"Avenir Next", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
    heading: '"Avenir Next", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
    mono: '"JetBrains Mono", "SFMono-Regular", Consolas, monospace'
  }
} as const;

export const lightTheme = {
  ...sharedTheme,
  mode: "light",
  colors: {
    surface: {
      canvas: rawTokens.palette.zinc[100],
      app: rawTokens.palette.ivory[50],
      panel: rawTokens.palette.white,
      panelSubtle: rawTokens.palette.ivory[100],
      panelRaised: rawTokens.palette.white,
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
      info: rawTokens.palette.cyan[500],
      segments: ["#111111", "#9c5aff", "#f05c3c", "#eca83d", "#3b82f6", "#22c55e"]
    },
    brand: {
      primary: "#dc2626",
      primaryHover: "#b91c1c",
      onPrimary: rawTokens.palette.white,
      onPrimaryText: rawTokens.palette.zinc[950],
      primarySoft: "#fef2f2",
      primarySubtle: "#fee2e2",
      primaryBorder: "#fecaca",
      primaryText: "#991b1b",
      heroStart: "#7f1d1d",
      heroMiddle: rawTokens.palette.zinc[900],
      heroEnd: "#050505"
    },
    hero: {
      background: "linear-gradient(135deg, #7f1d1d 0%, #18181b 54%, #050505 100%)",
      copy: rawTokens.palette.white,
      imageOpacity: "1",
      kicker: "rgba(255, 255, 255, 0.16)",
      overlay:
        "linear-gradient(90deg, rgba(127, 29, 29, 0.9) 0%, rgba(24, 24, 27, 0.88) 52%, rgba(24, 24, 27, 0.16) 76%)",
      overlayCompact:
        "linear-gradient(90deg, rgba(127, 29, 29, 0.92) 0%, rgba(24, 24, 27, 0.86) 72%, rgba(24, 24, 27, 0.36) 100%)"
    },
    selection: {
      row: "rgba(254, 242, 242, 0.78)",
      rowHover: "rgba(254, 226, 226, 0.8)"
    },
    avatar: {
      backgrounds: ["#dbeafe", "#fee2e2", "#fef3c7", "#f3e8ff"],
      foregrounds: ["#1e40af", "#991b1b", "#92400e", "#6b21a8"],
      placeholderPalettes: [
        { background: "#111111", accent: "#f05c3c" },
        { background: "#27364a", accent: "#eca83d" },
        { background: "#3f2f5f", accent: "#9c5aff" },
        { background: "#20463a", accent: "#6ee7b7" },
        { background: "#4d2f2a", accent: "#f7a072" }
      ]
    },
    analytics: {
      accent: "#f05c3c",
      highlight: "#eca83d",
      albumIconBackground: "rgba(161, 90, 255, 0.14)",
      albumIconText: "#a15aff"
    }
  },
  effects: {
    shadows: {
      panel: "0 26px 70px rgba(24, 24, 27, 0.2)",
      soft: "0 8px 24px rgba(24, 24, 27, 0.05)",
      raised: "0 14px 32px rgba(24, 24, 27, 0.16)",
      brandControl: "0 10px 22px rgba(220, 38, 38, 0.18)",
      floatingAction: "0 16px 34px rgba(220, 38, 38, 0.22)"
    }
  }
} as const;

export const darkTheme = {
  ...sharedTheme,
  mode: "dark",
  colors: {
    surface: {
      canvas: rawTokens.palette.zinc[950],
      app: "#101014",
      panel: rawTokens.palette.zinc[900],
      panelSubtle: rawTokens.palette.zinc[800],
      panelRaised: "#15151a",
      inverse: rawTokens.palette.white,
      overlay: "rgba(9, 9, 11, 0.72)"
    },
    text: {
      primary: rawTokens.palette.zinc[50],
      secondary: rawTokens.palette.zinc[300],
      muted: rawTokens.palette.zinc[400],
      inverse: rawTokens.palette.zinc[950],
      accent: rawTokens.palette.violet[400]
    },
    border: {
      subtle: "rgba(244, 244, 245, 0.08)",
      default: "rgba(244, 244, 245, 0.14)",
      strong: "rgba(244, 244, 245, 0.24)",
      inverse: rawTokens.palette.zinc[200]
    },
    action: {
      primary: rawTokens.palette.zinc[50],
      primaryHover: rawTokens.palette.white,
      secondary: rawTokens.palette.zinc[900],
      accent: rawTokens.palette.violet[400],
      accentHover: rawTokens.palette.violet[500]
    },
    intent: {
      success: "#34d399",
      successSoft: "rgba(16, 185, 129, 0.18)",
      warning: "#fbbf24",
      warningSoft: "rgba(245, 158, 11, 0.18)",
      danger: "#fb7185",
      dangerSoft: "rgba(244, 63, 94, 0.18)",
      info: "#22d3ee",
      infoSoft: "rgba(6, 182, 212, 0.18)"
    },
    focus: {
      ring: rawTokens.palette.violet[400],
      shadow: "0 0 0 4px rgba(167, 139, 250, 0.26)"
    },
    chart: {
      primary: rawTokens.palette.zinc[50],
      accent: rawTokens.palette.violet[400],
      success: "#34d399",
      warning: "#fbbf24",
      danger: "#fb7185",
      info: "#22d3ee",
      segments: ["#f4f4f5", "#a78bfa", "#fb7185", "#fbbf24", "#60a5fa", "#34d399"]
    },
    brand: {
      primary: "#ef4444",
      primaryHover: "#f87171",
      onPrimary: rawTokens.palette.white,
      onPrimaryText: rawTokens.palette.zinc[950],
      primarySoft: "rgba(239, 68, 68, 0.16)",
      primarySubtle: "rgba(239, 68, 68, 0.24)",
      primaryBorder: "rgba(248, 113, 113, 0.34)",
      primaryText: "#fecaca",
      heroStart: "#991b1b",
      heroMiddle: rawTokens.palette.zinc[950],
      heroEnd: "#000000"
    },
    hero: {
      background: "linear-gradient(135deg, #991b1b 0%, #09090b 54%, #000000 100%)",
      copy: rawTokens.palette.zinc[100],
      imageOpacity: "0.84",
      kicker: "rgba(255, 255, 255, 0.15)",
      overlay:
        "linear-gradient(90deg, rgba(153, 27, 27, 0.9) 0%, rgba(9, 9, 11, 0.88) 52%, rgba(9, 9, 11, 0.16) 76%)",
      overlayCompact:
        "linear-gradient(90deg, rgba(153, 27, 27, 0.92) 0%, rgba(9, 9, 11, 0.86) 72%, rgba(9, 9, 11, 0.36) 100%)"
    },
    selection: {
      row: "rgba(239, 68, 68, 0.16)",
      rowHover: "rgba(239, 68, 68, 0.24)"
    },
    avatar: {
      backgrounds: ["#dbeafe", "rgba(239, 68, 68, 0.24)", "#fef3c7", "#f3e8ff"],
      foregrounds: ["#1e40af", "#fecaca", "#92400e", "#6b21a8"],
      placeholderPalettes: [
        { background: "#f4f4f5", accent: "#fb7185" },
        { background: "#1e293b", accent: "#fbbf24" },
        { background: "#312e81", accent: "#c4b5fd" },
        { background: "#064e3b", accent: "#6ee7b7" },
        { background: "#431407", accent: "#fdba74" }
      ]
    },
    analytics: {
      accent: "#fb7185",
      highlight: "#fbbf24",
      albumIconBackground: "rgba(167, 139, 250, 0.18)",
      albumIconText: "#c4b5fd"
    }
  },
  effects: {
    shadows: {
      panel: "0 26px 70px rgba(0, 0, 0, 0.52)",
      soft: "0 8px 24px rgba(0, 0, 0, 0.26)",
      raised: "0 14px 32px rgba(0, 0, 0, 0.34)",
      brandControl: "0 10px 22px rgba(239, 68, 68, 0.24)",
      floatingAction: "0 16px 34px rgba(239, 68, 68, 0.28)"
    }
  }
} as const;

export const theme = lightTheme;
export type ThemeMode = "light" | "dark";
export type ThemePreference = ThemeMode | "system";
type WidenTheme<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends readonly (infer Item)[]
      ? readonly WidenTheme<Item>[]
      : T extends object
        ? { readonly [Key in keyof T]: WidenTheme<T[Key]> }
        : T;

export type AppTheme = Omit<WidenTheme<typeof lightTheme>, "mode"> & { readonly mode: ThemeMode };
