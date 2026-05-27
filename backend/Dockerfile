FROM node:22-alpine AS deps

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/package.json
RUN pnpm install --filter @addis-song-library/backend --frozen-lockfile

FROM deps AS build

COPY backend ./backend

WORKDIR /app/backend
RUN pnpm build

FROM node:22-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/package.json
RUN pnpm install --filter @addis-song-library/backend --prod --frozen-lockfile

COPY --from=build /app/backend/dist ./backend/dist

WORKDIR /app/backend

EXPOSE 4000

CMD ["pnpm", "start"]
