# Song Library

Song Library is a MERN catalogue application for managing Song records and viewing aggregate catalogue statistics.

## Workspace

This repository is a pnpm workspace with two deployable service roots:

- `backend/` - Express, TypeScript, MongoDB-ready API shell for Render.
- `frontend/` - Vite, React, TypeScript app shell for Vercel.

## Local Development

```sh
pnpm install
pnpm dev
```

Run one service at a time:

```sh
pnpm --filter @addis-song-library/backend dev
pnpm --filter @addis-song-library/frontend dev
```

Run checks:

```sh
pnpm typecheck
pnpm test
pnpm build
```

## Docker Compose

Docker Compose is scoped to local backend and MongoDB development only:

```sh
docker compose up --build
```

The backend health endpoint is available at `http://localhost:4000/health`.

## Environment

Copy examples before local development:

```sh
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Root variables are for orchestration only. Backend variables configure the API and MongoDB connection string. Frontend variables configure browser-visible Vite settings such as the API base URL.
