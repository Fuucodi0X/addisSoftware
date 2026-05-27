# Token-Governed Frontend Design System

The frontend will use a token-governed design system rather than hardcoded visual values scattered through feature components. Design tokens live in a shared theme, Emotion `styled` defines reusable component identity and states, and Styled System is used for token-aware layout primitives rather than as an open-ended styling API on every component.

## Consequences

The public styling vocabulary is semantic-first: app components should prefer tokens such as `text.muted`, `surface.panel`, `action.primary.bg`, and `intent.danger.bg` over raw palette values. Raw scales still exist underneath for implementation and escape hatches.

The frontend is split into three styling layers: design primitives (`Box`, `Flex`, `Grid`, `Stack`, `Inline`, `Text`) may accept Styled System props; reusable UI components (`Button`, `IconButton`, `Panel`, `Badge`, `Input`, `Modal`, `Table`) expose controlled semantic variants; Song Library feature components compose those primitives and UI components with little raw styling.

Reusable UI components use closed semantic variant APIs rather than arbitrary style props in normal app code. Broad Styled System props are reserved for design primitives; UI components should expose props such as `variant`, `tone`, and `size`.

Migration should happen in vertical slices. The first slice should establish the theme and primitives, then rebuild the modal/button flow before extracting larger Song Library feature sections from `App.tsx`.

Raw visual values should be treated as design-system internals. Feature components should not introduce raw hex colors, arbitrary shadows, arbitrary breakpoints, or one-off radii; those values belong in the theme or in reusable UI component variant definitions. `styles.css` should remain limited to small global browser defaults, and Emotion `Global` styles should move into design infrastructure.

The application should be wrapped in a single Emotion `ThemeProvider`, preferably at the app entrypoint, so the theme is infrastructure rather than feature-local state.

Raw-value governance is documented in `docs/frontend-design-system.md`. The lightweight `pnpm check:design-values` script scans extracted Song Library feature code for raw hex colors, arbitrary shadow literals, hardcoded media-query breakpoints, and one-off radii while leaving design-system internals free to define tokens and reusable component variants.
