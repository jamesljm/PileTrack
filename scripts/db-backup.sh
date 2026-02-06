#!/bin/bash
set -euo pipefail

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups"
BACKUP_FILE="${BACKUP_DIR}/piletrack_${TIMESTAMP}.sql.gz"

mkdir -p "$BACKUP_DIR"

echo "Backing up PileTrack database..."
docker compose -f docker/docker-compose.yml exec -T postgres \
  pg_dump -U piletrack piletrack | gzip > "$BACKUP_FILE"

echo "Backup saved to: $BACKUP_FILE"
echo "Size: $(du -h "$BACKUP_FILE" | cut -f1)"
