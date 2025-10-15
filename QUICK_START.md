# Quick Start Guide - INSA Year-Book

## 🚀 Get Started in 5 Minutes

This guide will help you get the INSA Year-Book application up and running quickly for **development** or **production**.

---

## Development Setup (Local Machine)

### Prerequisites
- Docker and Docker Compose installed
- Git

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Year-Book
   ```

2. **Create environment file**
   ```bash
   cp env.development.example .env
   ```

3. **Start development environment**
   ```bash
   docker compose -f docker-compose.dev.yml up -d
   ```

4. **Run migrations**
   ```bash
   docker compose -f docker-compose.dev.yml exec backend python manage.py migrate
   ```

5. **Create admin user**
   ```bash
   docker compose -f docker-compose.dev.yml exec backend python manage.py createsuperuser
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/yearbook/api/
   - Admin Panel: http://localhost:8000/admin/

**That's it! You're ready to develop! 🎉**

---

## Production Setup (VPS/Cloud Server)

### Prerequisites
- Ubuntu 20.04+ server with public IP
- Docker and Docker Compose installed
- Domain name pointed to your server

### Quick Production Deploy

1. **Clone repository**
   ```bash
   cd /opt
   sudo git clone <repository-url> yearbook
   cd yearbook/Year-Book
   sudo chown -R $USER:$USER .
   ```

2. **Create production environment**
   ```bash
   cp env.production.example .env
   nano .env
   ```

3. **Generate secret key and update .env**
   ```bash
   python3 -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
   ```
   
   Update these in `.env`:
   - `SECRET_KEY=<generated-key>`
   - `ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com`
   - `POSTGRES_PASSWORD=<strong-password>`
   - `REDIS_PASSWORD=<strong-password>`
   - `NEXT_PUBLIC_API_URL=https://yourdomain.com/yearbook/api`

4. **Setup SSL certificate (Let's Encrypt)**
   ```bash
   sudo apt-get install certbot -y
   sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com
   
   # Copy certificates
   sudo mkdir -p nginx/ssl
   sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem nginx/ssl/
   sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem nginx/ssl/
   sudo cp /etc/letsencrypt/live/yourdomain.com/chain.pem nginx/ssl/
   sudo chmod 644 nginx/ssl/*.pem
   ```

5. **Enable SSL in Nginx**
   ```bash
   cd nginx/conf.d
   cp ssl.conf.example ssl.conf
   sed -i 's/yourdomain.com/your-actual-domain.com/g' ssl.conf
   mv default.conf default.conf.disabled
   cd ../..
   ```

6. **Deploy with script**
   ```bash
   chmod +x scripts/*.sh
   ./scripts/deploy.sh production
   ```

7. **Verify deployment**
   ```bash
   curl https://yourdomain.com/health
   docker-compose ps
   ```

**Your production site is live! 🚀**

---

## Common Commands

### Development
```bash
# Start dev environment
docker compose -f docker-compose.dev.yml up -d

# View logs
docker compose -f docker-compose.dev.yml logs -f

# Stop environment
docker compose -f docker-compose.dev.yml down

# Django shell
docker compose -f docker-compose.dev.yml exec backend python manage.py shell

# Database migrations
docker compose -f docker-compose.dev.yml exec backend python manage.py makemigrations
docker compose -f docker-compose.dev.yml exec backend python manage.py migrate
```

### Production
```bash
# Deploy/Update
./scripts/deploy.sh production

# View logs
docker compose logs -f

# Backup database and media
./scripts/backup.sh

# Restore from backup
./scripts/restore.sh <backup-date>

# Django shell
docker compose exec backend python manage.py shell

# Restart services
docker compose restart
```

---

## Troubleshooting

### Containers won't start
```bash
docker compose down
docker compose up -d --force-recreate
docker compose logs
```

### Database connection errors
```bash
docker compose restart db
docker compose logs db
```

### Static files not loading
```bash
docker compose exec backend python manage.py collectstatic --noinput --clear
docker compose restart nginx
```

### Check container health
```bash
docker compose ps
docker stats
```

---

## Next Steps

After setup:

1. **Read the full documentation**
   - [Deployment Guide](DEPLOYMENT_GUIDE.md) - Complete production deployment
   - [Production Checklist](PRODUCTION_CHECKLIST.md) - Pre-launch verification
   - [Security Checklist](astu_yearbook/SECURITY_CHECKLIST.md) - Security best practices

2. **Configure backups**
   ```bash
   # Test backup
   ./scripts/backup.sh
   
   # Setup daily backups
   echo "0 2 * * * cd /opt/yearbook/Year-Book && ./scripts/backup.sh" | crontab -
   ```

3. **Setup monitoring**
   - Health check: `curl https://yourdomain.com/health`
   - Enable error tracking (Sentry, etc.)
   - Setup uptime monitoring

4. **Customize your application**
   - Add your content in Django admin
   - Update branding and logos
   - Configure email settings

---

## Architecture Overview

```
┌─────────────────────────────────────────────┐
│            Nginx (Reverse Proxy)            │
│         - SSL/TLS Termination               │
│         - Load Balancing                    │
│         - Static File Serving               │
└──────────┬────────────────────────┬─────────┘
           │                        │
           │                        │
┌──────────▼─────────┐   ┌─────────▼──────────┐
│   Next.js Frontend │   │  Django Backend     │
│   - React UI       │   │  - REST API         │
│   - SSR/SSG        │   │  - Admin Panel      │
└────────────────────┘   └──────┬──────────────┘
                                │
                    ┌───────────┼───────────┐
                    │           │           │
          ┌─────────▼────┐ ┌───▼─────┐ ┌──▼─────┐
          │  PostgreSQL  │ │  Redis  │ │ Media  │
          │   Database   │ │  Cache  │ │ Files  │
          └──────────────┘ └─────────┘ └────────┘
```

---

## Resources

- **Main Documentation**: [README.md](README.md)
- **Deployment Guide**: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- **Production Checklist**: [PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md)
- **Security Docs**: [astu_yearbook/SECURITY_CHECKLIST.md](astu_yearbook/SECURITY_CHECKLIST.md)
- **Admin Guide**: [astu_yearbook/ADMIN_GUIDE.md](astu_yearbook/ADMIN_GUIDE.md)

---

## Support

For help:
- Check logs: `docker-compose logs -f`
- Review documentation
- Contact: support@insa.gov.et

---

**Happy deploying! 🎉**


