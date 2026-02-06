#!/bin/bash
set -euo pipefail

echo "=== PileTrack Development Setup ==="

# Check prerequisites
command -v node >/dev/null 2>&1 || { echo "Node.js is required. Install from https://nodejs.org"; exit 1; }
command -v pnpm >/dev/null 2>&1 || { echo "Installing pnpm..."; corepack enable && corepack prepare pnpm@latest --activate; }
command -v docker >/dev/null 2>&1 || { echo "Docker is required for local databases"; exit 1; }

echo "1/5 Installing dependencies..."
pnpm install

echo "2/5 Starting Docker services..."
docker compose -f docker/docker-compose.yml up -d

echo "3/5 Waiting for PostgreSQL..."
sleep 5

echo "4/5 Setting up database..."
cp packages/backend/.env.example packages/backend/.env 2>/dev/null || true
pnpm db:generate
pnpm db:migrate
pnpm db:seed

echo "5/5 Building shared package..."
pnpm --filter @piletrack/shared build

echo ""
echo "=== Setup Complete ==="
echo "Run 'pnpm dev' to start development servers"
