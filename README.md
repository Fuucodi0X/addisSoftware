# Song Library

Song Library is a full-stack MERN catalogue for managing Song records and viewing global Song Library statistics.

## Tech Stack

- Backend: Node.js, Express, TypeScript, Mongoose, MongoDB
- Frontend: Vite, React, TypeScript, Redux Toolkit, Redux Saga, Emotion, Styled System
- Workspace and tooling: pnpm workspaces, Vitest, Docker Compose
- Deployment targets: Render for backend, Vercel for frontend

## Workspace Shape

- `backend/`: Song API service package (`@addis-song-library/backend`)
- `frontend/`: Song Library UI package (`@addis-song-library/frontend`)
- `docker-compose.yml`: local backend + MongoDB runtime only

## Quick Start

1. Install prerequisites: Node.js `>=22`, pnpm `>=10`, and Docker (optional for local MongoDB).
2. Install dependencies:

```sh
pnpm install
```

3. Create local env files:

```sh
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

4. Start backend and frontend in separate terminals:

```sh
pnpm --filter @addis-song-library/backend dev
pnpm --filter @addis-song-library/frontend dev
```

5. Seed Song records after MongoDB is available:

```sh
pnpm --filter @addis-song-library/backend seed
```

The seed command upserts curated Ethiopian-focused Songs and preserves existing records. Production startup also runs the compiled seed before starting the backend so deployed databases get the same baseline Song catalogue.

## Common Commands

```sh
pnpm dev
pnpm typecheck
pnpm test
pnpm build
pnpm check:design-values
```

## Docker Compose (Local Only)

Docker Compose is intentionally scoped to local development infrastructure and is not part of production deployment:

```sh
docker compose up --build
```

- Backend health: `http://localhost:4000/health`
- Song list: `http://localhost:4000/api/songs`

## Deployment Pointers

- Render deployment notes: [backend/README.md](backend/README.md)
- Vercel deployment notes: [frontend/README.md](frontend/README.md)

## Manual Verification Checklist

- [ ] Install dependencies with `pnpm install`.
- [ ] Start MongoDB (Docker Compose or local MongoDB instance).
- [ ] Run `pnpm --filter @addis-song-library/backend seed` for local/manual setup. Production `pnpm --filter @addis-song-library/backend start` runs the compiled seed automatically.
- [ ] Start backend with `pnpm --filter @addis-song-library/backend dev`.
- [ ] Start frontend with `pnpm --filter @addis-song-library/frontend dev`.
- [ ] Confirm Song list loads without page refresh.
- [ ] Create a Song and verify it appears immediately.
- [ ] Edit a Song and verify changes appear immediately.
- [ ] Delete a Song and verify removal appears immediately.
- [ ] Search Songs by title, artist, album, or genre.
- [ ] Filter Songs by genre.
- [ ] Change Song catalog pages and verify pagination metadata.
- [ ] Open statistics view and confirm totals/distributions load.
- [ ] Perform create/update/delete and confirm statistics refresh.
- [ ] Perform create/update/delete and confirm no full browser page reload is needed.
