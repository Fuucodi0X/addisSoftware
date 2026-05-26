import { ThemeProvider } from "@emotion/react";
import type { ReactNode } from "react";
import { GlobalStyles } from "./GlobalStyles";
import { theme } from "./theme";

interface DesignSystemProviderProps {
  children: ReactNode;
}

export const DesignSystemProvider = ({ children }: DesignSystemProviderProps) => (
  <ThemeProvider theme={theme}>
    <GlobalStyles />
    {children}
  </ThemeProvider>
);
