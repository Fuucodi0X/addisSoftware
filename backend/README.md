# Song Library Backend

Express + TypeScript API for Song Library, backed by MongoDB via Mongoose.

## Environment Variables

Create `backend/.env` from `backend/.env.example`.

- `NODE_ENV`: runtime mode (`development` by default)
- `PORT`: HTTP port (`4000` by default)
- `MONGODB_URI`: MongoDB connection URI (local default `mongodb://localhost:27017/song-library`)
- `CORS_ORIGIN`: allowed frontend origin without a trailing slash (local default `http://localhost:5173`)

## Commands

Run from repository root:

```sh
pnpm --filter @addis-song-library/backend dev
pnpm --filter @addis-song-library/backend build
pnpm --filter @addis-song-library/backend start
pnpm --filter @addis-song-library/backend typecheck
pnpm --filter @addis-song-library/backend test
pnpm --filter @addis-song-library/backend seed
```

## API Overview

Base URL (local): `http://localhost:4000`

- `GET /health`: service + MongoDB status health check
- `GET /api/songs?page=1&limit=8&q=<query>&genre=<genre>`: paginated Song list with optional search/filter
- `GET /api/songs/stats`: global Song Library aggregate statistics
- `POST /api/songs`: create Song
- `PATCH /api/songs/:id`: update Song
- `PUT /api/songs/:id`: update Song
- `DELETE /api/songs/:id`: delete Song

Song payload fields:

- Required: `title`, `artist`, `album`, `genre`, `duration`
- Optional: `artworkUrl` (string URL or `null`)

## Seed Data

`pnpm --filter @addis-song-library/backend seed` inserts or updates curated Song records.

- Uses upsert behavior keyed by `title + artist + album`
- Does not truncate or reset collections
- Can run in production because it is idempotent and preserves existing records
- The production `start` command runs the compiled seed once before starting the server

## Docker

### Local Docker Compose

Use root `docker-compose.yml` for local-only backend + MongoDB:

```sh
docker compose up --build
```

Docker Compose in this repo is development infrastructure only and is not used in production.

### Backend Dockerfile

Production container image definition lives at `backend/Dockerfile`.

## Render Deployment Notes

1. Create a Render Web Service from this repository.
2. Configure Render to build using `backend/Dockerfile`.
3. Set environment variables:
- `MONGODB_URI`: managed MongoDB connection (for example MongoDB Atlas), not Docker Compose.
- `CORS_ORIGIN`: deployed frontend origin, for example `https://your-frontend.vercel.app`.
- `NODE_ENV=production`.
4. Port behavior:
- The backend listens on `process.env.PORT` when provided.
- It falls back to `4000` for local development.
- Do not hardcode a different production port.
