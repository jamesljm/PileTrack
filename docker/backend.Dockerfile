FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN apk add --no-cache openssl

FROM base AS builder
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/backend/package.json ./packages/backend/
COPY packages/shared/package.json ./packages/shared/
RUN pnpm install --frozen-lockfile --filter @piletrack/backend --filter @piletrack/shared
COPY . .
RUN pnpm --filter @piletrack/shared build
RUN pnpm --filter @piletrack/backend db:generate
RUN pnpm --filter @piletrack/backend build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 appgroup && adduser --system --uid 1001 appuser
# Copy entire workspace structure to preserve pnpm symlinks
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app/packages/backend/node_modules ./packages/backend/node_modules
COPY --from=builder --chown=appuser:appgroup /app/packages/backend/dist ./packages/backend/dist
COPY --from=builder --chown=appuser:appgroup /app/packages/backend/prisma ./packages/backend/prisma
COPY --from=builder --chown=appuser:appgroup /app/packages/backend/package.json ./packages/backend/package.json
COPY --from=builder --chown=appuser:appgroup /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder --chown=appuser:appgroup /app/packages/shared/package.json ./packages/shared/package.json
COPY --from=builder --chown=appuser:appgroup /app/package.json ./package.json
COPY --from=builder --chown=appuser:appgroup /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
USER appuser
EXPOSE 3001
WORKDIR /app/packages/backend
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
