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
          color-scheme: ${theme.mode};
          scroll-behavior: smooth;
          --app-canvas: ${theme.colors.surface.canvas};
          --app-surface: ${theme.colors.surface.app};
          --app-panel: ${theme.colors.surface.panel};
          --app-panel-subtle: ${theme.colors.surface.panelSubtle};
          --app-panel-raised: ${theme.colors.surface.panelRaised};
          --app-text: ${theme.colors.text.primary};
          --app-text-secondary: ${theme.colors.text.secondary};
          --app-muted: ${theme.colors.text.muted};
          --app-border-subtle: ${theme.colors.border.subtle};
          --app-border: ${theme.colors.border.default};
          --app-border-strong: ${theme.colors.border.strong};
          --app-brand: ${theme.colors.brand.primary};
          --app-brand-hover: ${theme.colors.brand.primaryHover};
          --app-on-brand: ${theme.colors.brand.onPrimary};
          --app-on-brand-text: ${theme.colors.brand.onPrimaryText};
          --app-brand-soft: ${theme.colors.brand.primarySoft};
          --app-brand-subtle: ${theme.colors.brand.primarySubtle};
          --app-brand-border: ${theme.colors.brand.primaryBorder};
          --app-brand-text: ${theme.colors.brand.primaryText};
          --app-selected-row: ${theme.colors.selection.row};
          --app-selected-row-hover: ${theme.colors.selection.rowHover};
          --app-inverse: ${theme.colors.surface.inverse};
          --app-inverse-text: ${theme.colors.text.inverse};
          --app-shadow-panel: ${theme.effects.shadows.panel};
          --app-shadow-soft: ${theme.effects.shadows.soft};
          --app-shadow-raised: ${theme.effects.shadows.raised};
          --app-shadow-brand-control: ${theme.effects.shadows.brandControl};
          --app-shadow-floating-action: ${theme.effects.shadows.floatingAction};
          --app-hero-start: ${theme.colors.brand.heroStart};
          --app-hero-middle: ${theme.colors.brand.heroMiddle};
          --app-hero-end: ${theme.colors.brand.heroEnd};
          --app-hero-background: ${theme.colors.hero.background};
          --app-hero-copy: ${theme.colors.hero.copy};
          --app-hero-kicker: ${theme.colors.hero.kicker};
          --app-hero-overlay: ${theme.colors.hero.overlay};
          --app-hero-overlay-compact: ${theme.colors.hero.overlayCompact};
          --app-hero-image-opacity: ${theme.colors.hero.imageOpacity};
          --app-success: ${theme.colors.intent.success};
          --app-analytics-accent: ${theme.colors.analytics.accent};
          --app-analytics-highlight: ${theme.colors.analytics.highlight};
          --app-album-icon-background: ${theme.colors.analytics.albumIconBackground};
          --app-album-icon-text: ${theme.colors.analytics.albumIconText};
          --app-avatar-bg-1: ${theme.colors.avatar.backgrounds[0]};
          --app-avatar-bg-2: ${theme.colors.avatar.backgrounds[1]};
          --app-avatar-bg-3: ${theme.colors.avatar.backgrounds[2]};
          --app-avatar-bg-4: ${theme.colors.avatar.backgrounds[3]};
          --app-avatar-fg-1: ${theme.colors.avatar.foregrounds[0]};
          --app-avatar-fg-2: ${theme.colors.avatar.foregrounds[1]};
          --app-avatar-fg-3: ${theme.colors.avatar.foregrounds[2]};
          --app-avatar-fg-4: ${theme.colors.avatar.foregrounds[3]};
          --app-chart-segment-1: ${theme.colors.chart.segments[0]};
          --app-chart-segment-2: ${theme.colors.chart.segments[1]};
          --app-chart-segment-3: ${theme.colors.chart.segments[2]};
          --app-chart-segment-4: ${theme.colors.chart.segments[3]};
          --app-chart-segment-5: ${theme.colors.chart.segments[4]};
          --app-chart-segment-6: ${theme.colors.chart.segments[5]};
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
