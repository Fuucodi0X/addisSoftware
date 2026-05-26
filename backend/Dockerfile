FROM node:22-alpine

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/package.json
RUN pnpm install --filter @addis-song-library/backend... --frozen-lockfile

COPY backend/tsconfig.json ./backend/tsconfig.json
COPY backend/src ./backend/src

WORKDIR /app/backend

EXPOSE 4000

CMD ["pnpm", "start"]
