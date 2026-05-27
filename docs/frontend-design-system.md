# Frontend Design-System Raw-Value Rules

The Song Library frontend uses a token-governed design system. Raw visual values belong in the theme or inside reusable UI component internals, not in Song Library feature components.

## Allowed Layers

- `frontend/src/design/**`: owns raw tokens, semantic theme values, global CSS variables, and design primitives.
- `frontend/src/ui/**`: may use raw values only when defining reusable component internals or semantic variants.
- `frontend/src/features/**`: should compose primitives and UI components with theme tokens such as `theme.colors`, `theme.space`, `theme.radii`, `theme.shadows`, and `theme.breakpoints`.

Feature code should not introduce raw hex colors, arbitrary shadow strings, arbitrary breakpoint literals, or one-off radii. Add or extend a semantic token first when a feature needs a new visual value.

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
