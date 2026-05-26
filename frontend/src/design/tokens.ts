export const rawTokens = {
  palette: {
    zinc: {
      50: "#fafafa",
      100: "#f4f4f5",
      200: "#e4e4e7",
      300: "#d4d4d8",
      400: "#a1a1aa",
      500: "#71717a",
      600: "#52525b",
      700: "#3f3f46",
      800: "#27272a",
      900: "#18181b",
      950: "#09090b"
    },
    ivory: {
      50: "#fffdf8",
      100: "#fcf9f5",
      200: "#f5eee4"
    },
    amber: {
      100: "#fef3c7",
      500: "#f59e0b",
      600: "#d97706"
    },
    violet: {
      100: "#ede9fe",
      400: "#a78bfa",
      500: "#8b5cf6",
      600: "#7c3aed"
    },
    emerald: {
      100: "#d1fae5",
      500: "#10b981",
      600: "#059669"
    },
    rose: {
      100: "#ffe4e6",
      500: "#f43f5e",
      600: "#e11d48"
    },
    cyan: {
      100: "#cffafe",
      500: "#06b6d4"
    },
    white: "#ffffff",
    black: "#000000"
  },
  space: [0, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80],
  radii: {
    none: 0,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 18,
    xl: 24,
    full: 999
  },
  fontSizes: {
    xs: "0.68rem",
    sm: "0.76rem",
    md: "0.9rem",
    lg: "1rem",
    xl: "1.35rem",
    "2xl": "2rem",
    "3xl": "clamp(2.2rem, 6vw, 5.8rem)"
  },
  fontWeights: {
    regular: 500,
    medium: 700,
    bold: 850,
    black: 950
  },
  lineHeights: {
    tight: 1,
    heading: 1.04,
    body: 1.5
  },
  shadows: {
    panel: "0 22px 70px rgba(24, 24, 27, 0.12)",
    raised: "0 14px 32px rgba(24, 24, 27, 0.16)",
    focus: "0 0 0 4px rgba(139, 92, 246, 0.22)"
  },
  breakpoints: ["520px", "760px", "980px", "1180px"]
} as const;
