# Recreate Prototype UI With Emotion And Styled System

The production frontend must visually reproduce the interface in `prototype2`, but it must be implemented with Emotion and Styled System rather than copying the prototype's Tailwind classes. This keeps the prototype as the visual contract while making the production UI conform to the chosen styling system and preserving Song Library catalogue language instead of playback-oriented prototype terminology.

## Consequences

The prototype should be read for layout, spacing, visual hierarchy, controls, and interaction patterns, not as production code to paste directly. Tailwind should not be added to the production frontend for this UI port.

The implementation should include a visual feedback loop: run the production frontend in a browser, capture desktop and mobile screenshots with the available Chrome CLI, compare them against the intended prototype interface, and iterate until the interface matches. The Song form must include a visible required Duration input because Duration is stored Song metadata.
