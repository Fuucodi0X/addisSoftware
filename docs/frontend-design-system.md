# Frontend Design-System Raw-Value Rules

The Song Library frontend uses a token-governed design system. Raw visual values belong in the theme or inside reusable UI component internals, not in Song Library feature components.

## Allowed Layers

- `frontend/src/design/**`: owns raw tokens, semantic theme values, global CSS variables, and design primitives.
- `frontend/src/ui/**`: may use raw values only when defining reusable component internals or semantic variants.
- `frontend/src/features/**`: should compose primitives and UI components with theme tokens such as `theme.colors`, `theme.space`, `theme.radii`, `theme.shadows`, and `theme.breakpoints`.

Feature code should not introduce raw hex colors, arbitrary shadow strings, arbitrary breakpoint literals, or one-off radii. Add or extend a semantic token first when a feature needs a new visual value.

## Primitive API

Use `Box`, `Flex`, `Grid`, `Stack`, and `Inline` for simple feature layout. `gap`, `rowGap`, and `columnGap` accept Styled System responsive values and resolve numeric values through `theme.space`, so `gap={6}` uses the shared spacing token rather than a local pixel value.

Use `Text` and `Heading` for common typography. `Text` supports `variant="body" | "supporting" | "caption" | "label" | "code"` and semantic `tone` values such as `primary`, `secondary`, `muted`, `accent`, `success`, `warning`, and `danger`. `Heading` supports `variant="page" | "section" | "subsection" | "card"` with the same tone vocabulary. Keep semantic HTML explicit with Emotion's `as` prop when needed, for example `<Heading as="h1" variant="page">Song Library</Heading>`.

## Emotion and Primitive Boundary

Song Library feature components should start with primitives and reusable UI components. Use primitives when the component only needs simple layout, spacing, grid or flex composition, sizing, positioning, borders, shadows, or typography that can be expressed with token-aware props. Examples include workspace shells, catalogue headers, metric grids, filter rows, empty-state stacks, and small text groups.

Use semantic reusable UI components when the element has shared product behavior or a controlled visual contract. `Button`, `IconButton`, `Panel`, `Badge`, `Input`, `Modal`, and the reusable table components should remain the default for common actions, forms, overlays, status labels, panels, and ordinary tables. If a Song Library screen needs another common control shape, add or extend a reusable UI component with a semantic prop such as `variant`, `tone`, `size`, `density`, or `responsive` instead of spreading broad style props through feature code.

Direct Emotion styled components remain appropriate when the styling is part of a complex component recipe rather than simple composition. Use direct Emotion for complex states, pseudo-selectors, nested selectors, responsive recipes, table-specific behavior, custom controls, animation, and dynamic visual surfaces. Current examples include the Song Catalog table's responsive column behavior and nested cell selectors, Genre scroller scrollbar handling, selected Song row states, focused Song footer controls, range input styling, and data-driven progress fill width.

Direct Emotion does not make raw values acceptable in feature code. Feature-owned styled components should still read from `theme` or existing CSS variables for colors, spacing, radii, shadows, and breakpoints. Runtime values may be interpolated when they come from Song Library state or layout state, such as a progress percentage, measured size, open/closed state, or selected-row state.

When choosing a layer, use this order:

1. Compose primitives for straightforward layout and typography.
2. Use semantic UI components for common controls and repeated product surfaces.
3. Use direct Emotion for component-specific recipes that need selectors, states, responsive reshaping, custom browser control styling, animation, or runtime-driven visuals.

## Dynamic Runtime Values

Dynamic runtime values may remain dynamic when they are calculated from data or layout state. Examples include progress widths, measured heights, responsive grid counts, and drag positions. Prefer CSS variables when the value is shared between nested elements or reused across multiple CSS properties:

```tsx
<div style={{ "--song-progress": `${completion}%` } as React.CSSProperties} />
```

Dynamic values should still use tokens for color, radius, shadow, and breakpoint decisions around the calculation.

## Lightweight Check

Run the raw-value check before review:

```sh
pnpm check:design-values
```

The check scans `frontend/src/features/**` for raw hex colors, hardcoded media-query breakpoints, arbitrary shadow literals, and numeric border radii. It intentionally does not scan `frontend/src/design/**` or `frontend/src/ui/**`, so legitimate design-system internals are not blocked.

Reviewers should ask for a theme token or reusable UI variant when a feature change needs a new visual value. If a value is truly runtime-derived, keep it close to the behavior and document the reason in the PR.
