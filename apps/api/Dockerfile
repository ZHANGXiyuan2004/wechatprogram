FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable

FROM base AS deps
COPY package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY apps/api/package.json apps/api/package.json
COPY packages/shared-types/package.json packages/shared-types/package.json
COPY packages/ai-gateway/package.json packages/ai-gateway/package.json
RUN corepack prepare pnpm@9.15.4 --activate && pnpm install --frozen-lockfile=false

FROM deps AS build
COPY . .
RUN pnpm --filter @asrllm/shared-types build && \
    pnpm --filter @asrllm/ai-gateway build && \
    pnpm --filter @asrllm/api build

FROM node:20-alpine AS runtime
WORKDIR /app
RUN corepack enable
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY --from=build /app/apps/api/package.json ./apps/api/package.json
EXPOSE 3000
CMD ["node", "apps/api/dist/main.js"]
