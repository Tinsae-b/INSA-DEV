# Production Deployment Guide

## 🚀 Complete Production Deployment Guide for INSA Year-Book

This guide will walk you through deploying the INSA Year-Book application in a production environment using Docker, Nginx, PostgreSQL, and SSL/HTTPS.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Server Setup](#server-setup)
3. [Environment Configuration](#environment-configuration)
4. [SSL Certificate Setup](#ssl-certificate-setup)
5. [Docker Deployment](#docker-deployment)
6. [Post-Deployment](#post-deployment)
7. [Monitoring & Maintenance](#monitoring--maintenance)
8. [Troubleshooting](#troubleshooting)
9. [Backup & Restore](#backup--restore)

---

## Prerequisites

### Required Software
- **Operating System**: Ubuntu 20.04+ or similar Linux distribution
- **Docker**: Version 20.10+
- **Docker Compose**: Version 2.0+
- **Git**: For code deployment
- **Domain Name**: With DNS configured to point to your server

### Minimum Server Requirements
- **CPU**: 2 cores
- **RAM**: 4GB
- **Storage**: 20GB SSD
- **Network**: Public IP address

### Recommended Server Requirements
- **CPU**: 4 cores
- **RAM**: 8GB
- **Storage**: 50GB SSD
- **Network**: Public IP with DDoS protection

---

## Server Setup

### 1. Update System Packages

```bash
sudo apt-get update && sudo apt-get upgrade -y
```

### 2. Install Docker

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add your user to docker group
sudo usermod -aG docker $USER

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker
```

### 3. Install Docker Compose

```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose --version
```

### 4. Configure Firewall

```bash
# Allow SSH
sudo ufw allow OpenSSH

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable
sudo ufw status
```

### 5. Clone Repository

```bash
cd /opt
sudo git clone <your-repository-url> yearbook
cd yearbook/Year-Book
sudo chown -R $USER:$USER .
```

---

## Environment Configuration

### 1. Create Production Environment File

```bash
cd /opt/yearbook/Year-Book
cp env.production.example .env
```

### 2. Generate Secret Key

```bash
python3 -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### 3. Edit `.env` File

```bash
nano .env
```

**Required Configuration:**

```bash
# Django Settings
SECRET_KEY=<generated-secret-key-here>
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com,your-server-ip

# Database
POSTGRES_DB=yearbook_db
POSTGRES_USER=yearbook_user
POSTGRES_PASSWORD=<strong-random-password>

# Redis
REDIS_PASSWORD=<strong-random-password>

# CORS
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# SSL (will enable after certificate setup)
SECURE_SSL_REDIRECT=True
SECURE_HSTS_SECONDS=31536000
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True

# Frontend
NEXT_PUBLIC_API_URL=https://yourdomain.com/yearbook/api

# Admin
ADMIN_URL=your-custom-admin-url/  # Change from default 'admin/'
ADMIN_EMAIL=admin@yourdomain.com
```

### 4. Create Frontend Environment

```bash
cd astu_front
echo "NEXT_PUBLIC_API_URL=https://yourdomain.com/yearbook/api" > .env.production
```

---

## SSL Certificate Setup

### Option 1: Let's Encrypt (Recommended - Free)

#### 1. Install Certbot

```bash
sudo apt-get install certbot -y
```

#### 2. Obtain Certificate

```bash
# Stop any running services on port 80
sudo docker-compose down

# Get certificate
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com
```

#### 3. Copy Certificates

```bash
sudo mkdir -p nginx/ssl
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem nginx/ssl/
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem nginx/ssl/
sudo cp /etc/letsencrypt/live/yourdomain.com/chain.pem nginx/ssl/
sudo chmod 644 nginx/ssl/*.pem
```

#### 4. Setup Auto-Renewal

```bash
# Test renewal
sudo certbot renew --dry-run

# Add to crontab
echo "0 12 * * * /usr/bin/certbot renew --quiet --deploy-hook 'cd /opt/yearbook/Year-Book && docker-compose restart nginx'" | sudo crontab -
```

### Option 2: Commercial SSL Certificate

1. Purchase SSL certificate from provider
2. Place files in `nginx/ssl/` directory:
   - `fullchain.pem` (certificate + chain)
   - `privkey.pem` (private key)
   - `chain.pem` (intermediate certificates)

### 5. Enable SSL in Nginx

```bash
cd nginx/conf.d
cp ssl.conf.example ssl.conf

# Edit ssl.conf and update domain name
sed -i 's/yourdomain.com/your-actual-domain.com/g' ssl.conf

# Move or rename default.conf to disable HTTP-only config
mv default.conf default.conf.disabled
```

---

## Docker Deployment

### 1. Build Images

```bash
cd /opt/yearbook/Year-Book
docker-compose build --no-cache
```

### 2. Start Services

```bash
docker-compose up -d
```

### 3. Check Container Status

```bash
docker-compose ps
```

All services should show "Up" and "healthy" status.

### 4. Run Database Migrations

```bash
docker-compose exec backend python manage.py migrate
```

### 5. Collect Static Files

```bash
docker-compose exec backend python manage.py collectstatic --noinput
```

### 6. Create Superuser

```bash
docker-compose exec backend python manage.py createsuperuser
```

Follow prompts to create admin account.

### 7. Verify Deployment

```bash
# Check health endpoints
curl http://localhost/health
curl http://localhost/yearbook/api/health/

# Check logs
docker-compose logs -f
```

---

## Post-Deployment

### 1. Security Checklist

Run Django security check:
```bash
docker-compose exec backend python manage.py check --deploy
```

Address any warnings or errors.

### 2. Test Application

- [ ] Visit https://yourdomain.com
- [ ] Test API: https://yourdomain.com/yearbook/api/
- [ ] Access admin: https://yourdomain.com/<your-admin-url>/
- [ ] Test certificate download
- [ ] Test memory board uploads
- [ ] Check SSL certificate: https://www.ssllabs.com/ssltest/

### 3. Configure Backups

```bash
# Make scripts executable (Linux/Mac)
chmod +x scripts/*.sh

# Test backup
./scripts/backup.sh

# Setup daily backups via cron
echo "0 2 * * * cd /opt/yearbook/Year-Book && ./scripts/backup.sh >> /var/log/yearbook-backup.log 2>&1" | crontab -
```

### 4. Setup Monitoring (Optional)

Install monitoring tools:

```bash
# Install monitoring stack (Prometheus + Grafana)
# Or use external services like:
# - Sentry (error tracking)
# - UptimeRobot (uptime monitoring)
# - CloudWatch (AWS)
# - Google Cloud Monitoring
```

---

## Monitoring & Maintenance

### Daily Monitoring

```bash
# Check container status
docker-compose ps

# Check logs for errors
docker-compose logs --tail=100 backend
docker-compose logs --tail=100 frontend

# Check disk usage
df -h

# Check database size
docker-compose exec db psql -U yearbook_user -d yearbook_db -c "SELECT pg_size_pretty(pg_database_size('yearbook_db'));"
```

### Weekly Maintenance

```bash
# Update containers
cd /opt/yearbook/Year-Book
git pull origin main
docker-compose build
docker-compose up -d

# Clean up old Docker images
docker image prune -a -f

# Check security logs
docker-compose exec backend cat security.log | tail -100
```

### Monthly Tasks

- Review and rotate logs
- Update dependencies
- Review backup integrity
- Security audit
- Performance optimization

### Viewing Logs

```bash
# All logs
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f nginx

# Nginx access logs
docker-compose exec nginx tail -f /var/log/nginx/access.log

# Django security logs
docker-compose exec backend tail -f security.log
```

---

## Troubleshooting

### Common Issues

#### 1. Containers Won't Start

```bash
# Check logs
docker-compose logs

# Recreate containers
docker-compose down
docker-compose up -d --force-recreate
```

#### 2. Database Connection Errors

```bash
# Check database is running
docker-compose ps db

# Check database logs
docker-compose logs db

# Restart database
docker-compose restart db
```

#### 3. Static Files Not Loading

```bash
# Recollect static files
docker-compose exec backend python manage.py collectstatic --noinput --clear

# Check Nginx volume mapping
docker-compose exec nginx ls -la /static
```

#### 4. SSL Certificate Issues

```bash
# Check certificate expiry
sudo certbot certificates

# Renew manually
sudo certbot renew --force-renewal

# Update nginx configuration
docker-compose restart nginx
```

#### 5. Out of Disk Space

```bash
# Clean Docker system
docker system prune -a --volumes -f

# Remove old backups
find ./backups -name "*.sql" -mtime +30 -delete
```

#### 6. High Memory Usage

```bash
# Check resource usage
docker stats

# Restart services
docker-compose restart

# Reduce worker count in docker-compose.yml
# Edit backend command: --workers 2 (instead of 4)
```

---

## Backup & Restore

### Manual Backup

```bash
# Run backup script
./scripts/backup.sh
```

This creates:
- Database dump: `backups/db_backup_YYYYMMDD_HHMMSS.sql`
- Media files: `backups/media_backup_YYYYMMDD_HHMMSS.tar.gz`

### Automated Backups

Backups run daily at 2 AM via cron job. Check logs:

```bash
tail -f /var/log/yearbook-backup.log
```

### Restore from Backup

```bash
# List available backups
ls -lh backups/

# Restore (replace date with your backup)
./scripts/restore.sh 20250113_120000
```

### Off-site Backup (Recommended)

```bash
# Setup AWS S3 backup (example)
aws s3 sync ./backups s3://your-bucket/yearbook-backups/

# Or use rsync to remote server
rsync -avz ./backups/ user@backup-server:/backups/yearbook/
```

---

## Scaling & Performance

### Horizontal Scaling

To handle more traffic, you can:

1. **Increase Worker Processes**
   - Edit `docker-compose.yml`
   - Change `--workers 4` to `--workers 8`

2. **Add More Backend Containers**
   ```yaml
   backend:
     deploy:
       replicas: 3
   ```

3. **Use Load Balancer**
   - Add HAProxy or AWS ELB
   - Distribute traffic across multiple servers

### Performance Optimization

1. **Enable Redis Caching**
   - Already configured in docker-compose.yml
   - Configure Django cache settings

2. **CDN for Static Files**
   - Use CloudFlare or AWS CloudFront
   - Update `STATIC_URL` in settings

3. **Database Optimization**
   - Regular VACUUM
   - Index optimization
   - Connection pooling

---

## Security Best Practices

✅ **Completed in this setup:**
- SSL/HTTPS encryption
- Secure headers (CSP, HSTS, X-Frame-Options)
- Rate limiting
- File upload validation
- CSRF protection
- SQL injection prevention
- XSS protection
- Secure session management

⚠️ **Additional recommendations:**
- Regular security updates
- Fail2ban for intrusion prevention
- Web Application Firewall (WAF)
- Regular security audits
- Penetration testing

---

## Quick Reference Commands

```bash
# Deploy/Update
./scripts/deploy.sh production

# Backup
./scripts/backup.sh

# Restore
./scripts/restore.sh <backup_date>

# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Stop all services
docker-compose down

# Start services
docker-compose up -d

# Database shell
docker-compose exec db psql -U yearbook_user yearbook_db

# Django shell
docker-compose exec backend python manage.py shell

# Create superuser
docker-compose exec backend python manage.py createsuperuser
```

---

## Support & Contact

For issues or questions:
- **Email**: support@insa.gov.et
- **Documentation**: [Internal Wiki Link]
- **Emergency Contact**: [24/7 Support Number]

---

**Last Updated**: January 2025  
**Version**: 1.0.0

---

## Appendix

### A. Environment Variables Reference

See `env.production.example` for complete list.

### B. Port Reference

- **80**: HTTP (redirects to HTTPS)
- **443**: HTTPS
- **5432**: PostgreSQL (internal only)
- **6379**: Redis (internal only)

### C. Docker Volumes

- `postgres_data`: Database files
- `redis_data`: Cache data
- `static_volume`: Django static files
- `media_volume`: User uploads
- `logs_volume`: Application logs

---

**Good luck with your deployment! 🚀**


