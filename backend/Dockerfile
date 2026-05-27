FROM node:22-alpine AS deps

WORKDIR /app

RUN corepack enable

COPY package.json ./
RUN pnpm install --frozen-lockfile=false

FROM deps AS build

COPY tsconfig.json ./
COPY src ./src

RUN pnpm build

FROM node:22-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production

RUN corepack enable

COPY package.json ./
RUN pnpm install --prod --frozen-lockfile=false

COPY --from=build /app/dist ./dist

EXPOSE 4000

CMD ["pnpm", "start"]
