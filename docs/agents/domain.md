# Domain Docs

This repo uses a single domain context.

## Before exploring, read these

- `CONTEXT.md` at the repo root for Song Library language
- `docs/adr/` for accepted architectural decisions

If any of these files do not exist, proceed silently. Producer skills create domain docs lazily when terms or decisions are resolved.

## Use the glossary's vocabulary

Use the terms defined in `CONTEXT.md`. In particular, prefer Song Library, Song, Artist, Album, Genre, and Artwork URL. Avoid drifting into music app, streaming app, playlist app, track, or audio file language.

## Flag ADR conflicts

If proposed work contradicts an ADR, surface the conflict explicitly rather than silently overriding it.
