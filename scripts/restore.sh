#!/bin/bash

# =============================================================================
# Restore Script for INSA Year-Book
# =============================================================================
# Restores database and media files from backup
#
# Usage: ./scripts/restore.sh <backup_date>
# Example: ./scripts/restore.sh 20250113_120000
# =============================================================================

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration
BACKUP_DIR="./backups"
BACKUP_DATE=$1

if [ -z "$BACKUP_DATE" ]; then
    echo -e "${RED}ERROR: Please provide backup date${NC}"
    echo "Usage: ./scripts/restore.sh <backup_date>"
    echo "Available backups:"
    ls -1 "${BACKUP_DIR}"/*.sql 2>/dev/null | xargs -n 1 basename | sed 's/db_backup_//' | sed 's/.sql//'
    exit 1
fi

DB_BACKUP="${BACKUP_DIR}/db_backup_${BACKUP_DATE}.sql"
MEDIA_BACKUP="${BACKUP_DIR}/media_backup_${BACKUP_DATE}.tar.gz"

# Check if backup files exist
if [ ! -f "$DB_BACKUP" ]; then
    echo -e "${RED}ERROR: Database backup not found: $DB_BACKUP${NC}"
    exit 1
fi

if [ ! -f "$MEDIA_BACKUP" ]; then
    echo -e "${YELLOW}WARNING: Media backup not found: $MEDIA_BACKUP${NC}"
    read -p "Continue without media restore? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}INSA Year-Book Restore Script${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}WARNING: This will overwrite existing data!${NC}"
read -p "Are you sure you want to continue? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

echo ""
echo -e "${YELLOW}Step 1: Restoring database...${NC}"
cat "$DB_BACKUP" | docker-compose exec -T db psql -U yearbook_user yearbook_db

if [ -f "$MEDIA_BACKUP" ]; then
    echo -e "${YELLOW}Step 2: Restoring media files...${NC}"
    tar -xzf "$MEDIA_BACKUP" -C astu_yearbook/
fi

echo ""
echo -e "${GREEN}Restore completed successfully!${NC}"
echo ""


