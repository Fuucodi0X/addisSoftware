import { Global, css, useTheme } from "@emotion/react";

export const GlobalStyles = () => {
  const theme = useTheme();

  return (
    <Global
      styles={css`
        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }

        html,
        body,
        #root {
          min-height: 100%;
        }

        html {
          scroll-behavior: smooth;
        }

        html,
        body {
          overflow-x: hidden;
        }

        body {
          margin: 0;
          min-width: 320px;
          background: ${theme.colors.surface.canvas};
          color: ${theme.colors.text.primary};
          font-family: ${theme.fonts.body};
          text-rendering: optimizeLegibility;
        }

        button,
        input,
        select {
          font: inherit;
        }

        button {
          cursor: pointer;
        }

        :focus-visible {
          outline: 2px solid ${theme.colors.focus.ring};
          outline-offset: 2px;
        }

        * {
          scrollbar-width: none;
        }

        *::-webkit-scrollbar {
          display: none;
        }
      `}
    />
  );
};
