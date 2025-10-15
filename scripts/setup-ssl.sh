#!/bin/bash

# =============================================================================
# SSL Setup Script for INSA Year-Book (Let's Encrypt)
# =============================================================================
# Sets up SSL certificates using Let's Encrypt and Certbot
#
# Usage: ./scripts/setup-ssl.sh <domain>
# Example: ./scripts/setup-ssl.sh yourdomain.com
# =============================================================================

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

DOMAIN=$1

if [ -z "$DOMAIN" ]; then
    echo -e "${RED}ERROR: Please provide domain name${NC}"
    echo "Usage: ./scripts/setup-ssl.sh <domain>"
    exit 1
fi

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}SSL Setup for ${DOMAIN}${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Create SSL directory
mkdir -p nginx/ssl

echo -e "${YELLOW}Step 1: Installing Certbot...${NC}"
if ! command -v certbot &> /dev/null; then
    echo "Certbot not found. Please install it:"
    echo "Ubuntu/Debian: sudo apt-get install certbot python3-certbot-nginx"
    echo "CentOS/RHEL: sudo yum install certbot python3-certbot-nginx"
    exit 1
fi

echo -e "${YELLOW}Step 2: Obtaining SSL certificate...${NC}"
sudo certbot certonly --standalone -d ${DOMAIN} -d www.${DOMAIN}

echo -e "${YELLOW}Step 3: Copying certificates to nginx/ssl...${NC}"
sudo cp /etc/letsencrypt/live/${DOMAIN}/fullchain.pem nginx/ssl/
sudo cp /etc/letsencrypt/live/${DOMAIN}/privkey.pem nginx/ssl/
sudo cp /etc/letsencrypt/live/${DOMAIN}/chain.pem nginx/ssl/
sudo chmod 644 nginx/ssl/*.pem

echo -e "${YELLOW}Step 4: Updating Nginx configuration...${NC}"
cp nginx/conf.d/ssl.conf.example nginx/conf.d/ssl.conf
sed -i "s/yourdomain.com/${DOMAIN}/g" nginx/conf.d/ssl.conf

echo -e "${YELLOW}Step 5: Setting up auto-renewal...${NC}"
echo "0 12 * * * /usr/bin/certbot renew --quiet --deploy-hook 'docker-compose restart nginx'" | sudo tee -a /etc/crontab

echo ""
echo -e "${GREEN}SSL setup completed!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Update .env file with your domain"
echo "2. Restart containers: docker-compose restart"
echo "3. Test SSL: https://${DOMAIN}"
echo ""


