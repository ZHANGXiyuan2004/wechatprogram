FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable

FROM base AS deps
COPY package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY apps/admin-web/package.json apps/admin-web/package.json
COPY packages/shared-types/package.json packages/shared-types/package.json
RUN corepack prepare pnpm@9.15.4 --activate && pnpm install --frozen-lockfile=false

FROM deps AS build
COPY . .
RUN pnpm --filter @asrllm/shared-types build && pnpm --filter @asrllm/admin-web build

FROM nginx:1.27-alpine AS runtime
COPY --from=build /app/apps/admin-web/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
