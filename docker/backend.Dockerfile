FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN apk add --no-cache openssl

FROM base AS deps
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/backend/package.json ./packages/backend/
COPY packages/shared/package.json ./packages/shared/
RUN pnpm install --frozen-lockfile --filter @piletrack/backend --filter @piletrack/shared

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/backend/node_modules ./packages/backend/node_modules
COPY --from=deps /app/packages/shared/node_modules ./packages/shared/node_modules
COPY . .
RUN pnpm --filter @piletrack/shared build
RUN pnpm --filter @piletrack/backend db:generate
RUN pnpm --filter @piletrack/backend build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache openssl
RUN addgroup --system --gid 1001 appgroup && adduser --system --uid 1001 appuser
COPY --from=builder --chown=appuser:appgroup /app/packages/backend/dist ./dist
COPY --from=builder --chown=appuser:appgroup /app/packages/backend/prisma ./prisma
COPY --from=builder --chown=appuser:appgroup /app/packages/backend/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app/packages/backend/package.json ./
RUN npm install prisma@6 --save-dev --ignore-scripts 2>/dev/null; exit 0
USER appuser
EXPOSE 3001
CMD ["sh", "-c", "npx prisma migrate deploy --schema=./prisma/schema.prisma && node dist/index.js"]
