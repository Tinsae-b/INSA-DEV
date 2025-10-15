#!/bin/bash

# =============================================================================
# Backup Script for INSA Year-Book
# =============================================================================
# Creates backups of database and media files
#
# Usage: ./scripts/backup.sh
# =============================================================================

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}INSA Year-Book Backup Script${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Create backup directory if it doesn't exist
mkdir -p "${BACKUP_DIR}"

echo -e "${YELLOW}Step 1: Backing up database...${NC}"
docker-compose exec -T db pg_dump -U yearbook_user yearbook_db > "${BACKUP_DIR}/db_backup_${DATE}.sql"

echo -e "${YELLOW}Step 2: Backing up media files...${NC}"
tar -czf "${BACKUP_DIR}/media_backup_${DATE}.tar.gz" -C astu_yearbook media/

echo -e "${YELLOW}Step 3: Cleaning up old backups (keeping last 30 days)...${NC}"
find "${BACKUP_DIR}" -name "*.sql" -mtime +30 -delete
find "${BACKUP_DIR}" -name "*.tar.gz" -mtime +30 -delete

echo ""
echo -e "${GREEN}Backup completed successfully!${NC}"
echo -e "Database backup: ${BACKUP_DIR}/db_backup_${DATE}.sql"
echo -e "Media backup: ${BACKUP_DIR}/media_backup_${DATE}.tar.gz"
echo ""


