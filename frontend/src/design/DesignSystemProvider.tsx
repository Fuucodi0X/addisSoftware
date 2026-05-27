import { ThemeProvider } from "@emotion/react";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { GlobalStyles } from "./GlobalStyles";
import { darkTheme, lightTheme, type ThemeMode, type ThemePreference } from "./theme";

interface DesignSystemProviderProps {
  children: ReactNode;
}

interface ColorSchemeContextValue {
  mode: ThemeMode;
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
  toggleMode: () => void;
}

const storageKey = "addis-song-library-theme";
const systemQuery = "(prefers-color-scheme: dark)";

const ColorSchemeContext = createContext<ColorSchemeContextValue | null>(null);

const getSystemMode = (): ThemeMode => {
  if (typeof window === "undefined" || !window.matchMedia) {
    return "light";
  }

  return window.matchMedia(systemQuery).matches ? "dark" : "light";
};

const getStoredPreference = (): ThemePreference => {
  if (typeof window === "undefined") {
    return "system";
  }

  const storedPreference = window.localStorage.getItem(storageKey);

  return storedPreference === "light" || storedPreference === "dark" || storedPreference === "system"
    ? storedPreference
    : "system";
};

export const DesignSystemProvider = ({ children }: DesignSystemProviderProps) => {
  const [preference, setPreferenceState] = useState<ThemePreference>(getStoredPreference);
  const [systemMode, setSystemMode] = useState<ThemeMode>(getSystemMode);
  const mode = preference === "system" ? systemMode : preference;
  const theme = mode === "dark" ? darkTheme : lightTheme;

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia(systemQuery);
    const syncSystemMode = () => setSystemMode(mediaQuery.matches ? "dark" : "light");

    syncSystemMode();
    mediaQuery.addEventListener("change", syncSystemMode);

    return () => mediaQuery.removeEventListener("change", syncSystemMode);
  }, []);

  const setPreference = (nextPreference: ThemePreference) => {
    setPreferenceState(nextPreference);
    window.localStorage.setItem(storageKey, nextPreference);
  };

  const contextValue = useMemo<ColorSchemeContextValue>(
    () => ({
      mode,
      preference,
      setPreference,
      toggleMode: () => setPreference(mode === "dark" ? "light" : "dark")
    }),
    [mode, preference]
  );

  return (
    <ColorSchemeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        {children}
      </ThemeProvider>
    </ColorSchemeContext.Provider>
  );
};

export const useColorScheme = () => {
  const context = useContext(ColorSchemeContext);

  if (!context) {
    throw new Error("useColorScheme must be used inside DesignSystemProvider");
  }

  return context;
};
