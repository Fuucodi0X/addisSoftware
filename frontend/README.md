# Song Library Frontend

Vite + React + TypeScript Song Library interface with Redux Toolkit and Redux Saga for server-state orchestration.

## Environment Variables

Create `frontend/.env` from `frontend/.env.example`.

- `VITE_API_BASE_URL`: backend base URL (local default `http://localhost:4000`)

## Commands

Run from repository root:

```sh
pnpm --filter @addis-song-library/frontend dev
pnpm --filter @addis-song-library/frontend build
pnpm --filter @addis-song-library/frontend preview
pnpm --filter @addis-song-library/frontend typecheck
pnpm --filter @addis-song-library/frontend test
pnpm --filter @addis-song-library/frontend check:design-values
```

## Frontend Architecture

- `src/App.tsx`: app wiring and providers (design system + Redux store)
- `src/features/songs/`: Song Library feature orchestration, catalog views, statistics views, and mutation forms
- `src/store/`: Redux slice and saga API effect flow
- `src/ui/`: reusable UI primitives
- `src/design/`: theme tokens, primitives, and design-system providers

Behavior notes:

- API calls are handled in Redux Saga (`src/store/songsSaga.ts`)
- Components dispatch actions and avoid direct `fetch` calls
- Song statistics are fetched globally and are not page-filtered summaries

## Vercel Deployment Notes

1. Create a Vercel project from this repository.
2. Set project Root Directory to `frontend`.
3. Keep framework preset as Vite.
4. Add environment variable:
`VITE_API_BASE_URL=<your-render-backend-url>`
5. Deploy.

After deployment, verify Song create/update/delete/search/filter/pagination against the deployed backend URL.
