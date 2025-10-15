#!/bin/bash

# =============================================================================
# Production Deployment Script for INSA Year-Book
# =============================================================================
# This script automates the deployment process for production environments
#
# Usage: ./scripts/deploy.sh [environment]
# Example: ./scripts/deploy.sh production
# =============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-production}
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}INSA Year-Book Deployment Script${NC}"
echo -e "${GREEN}Environment: ${ENVIRONMENT}${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Check if .env file exists
if [ ! -f "${PROJECT_DIR}/.env" ]; then
    echo -e "${RED}ERROR: .env file not found!${NC}"
    echo -e "${YELLOW}Please create .env from env.${ENVIRONMENT}.example${NC}"
    echo "cp env.${ENVIRONMENT}.example .env"
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}ERROR: Docker is not installed!${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}ERROR: Docker Compose is not installed!${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 1: Pulling latest changes from git...${NC}"
git pull origin main || echo -e "${YELLOW}Warning: Could not pull from git${NC}"

echo ""
echo -e "${YELLOW}Step 2: Building Docker images...${NC}"
docker-compose build --no-cache

echo ""
echo -e "${YELLOW}Step 3: Stopping existing containers...${NC}"
docker-compose down

echo ""
echo -e "${YELLOW}Step 4: Starting services...${NC}"
docker-compose up -d

echo ""
echo -e "${YELLOW}Step 5: Waiting for database to be ready...${NC}"
sleep 10

echo ""
echo -e "${YELLOW}Step 6: Running database migrations...${NC}"
docker-compose exec -T backend python manage.py migrate --noinput

echo ""
echo -e "${YELLOW}Step 7: Collecting static files...${NC}"
docker-compose exec -T backend python manage.py collectstatic --noinput

echo ""
echo -e "${YELLOW}Step 8: Creating superuser (if needed)...${NC}"
echo "You can create a superuser manually with:"
echo "docker-compose exec backend python manage.py createsuperuser"

echo ""
echo -e "${YELLOW}Step 9: Checking container health...${NC}"
sleep 5
docker-compose ps

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Deployment completed successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Frontend: ${GREEN}http://localhost${NC}"
echo -e "Backend API: ${GREEN}http://localhost/yearbook/api/${NC}"
echo -e "Admin Panel: ${GREEN}http://localhost/admin/${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Check logs: docker-compose logs -f"
echo "2. Create superuser: docker-compose exec backend python manage.py createsuperuser"
echo "3. Monitor health: curl http://localhost/health"
echo ""


