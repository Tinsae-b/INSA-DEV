# Production Deployment Checklist

## Pre-Deployment Checklist

### Environment Setup
- [ ] `.env` file created from `env.production.example`
- [ ] New `SECRET_KEY` generated (not using default)
- [ ] `DEBUG=False` set in production
- [ ] `ALLOWED_HOSTS` configured with actual domains
- [ ] `ADMIN_URL` changed from default value
- [ ] `CORS_ALLOWED_ORIGINS` set to production URLs only
- [ ] Database credentials are strong and secure
- [ ] Redis password configured

### SSL/HTTPS Configuration
- [ ] SSL certificate obtained (Let's Encrypt or commercial)
- [ ] Certificates placed in `nginx/ssl/` directory
- [ ] `SECURE_SSL_REDIRECT=True` enabled
- [ ] `SECURE_HSTS_SECONDS=31536000` set
- [ ] `SESSION_COOKIE_SECURE=True` enabled
- [ ] `CSRF_COOKIE_SECURE=True` enabled
- [ ] SSL configuration tested with https://www.ssllabs.com/ssltest/

### Database
- [ ] PostgreSQL configured (not SQLite)
- [ ] Database backups configured
- [ ] Database credentials secured
- [ ] Database not accessible from public internet
- [ ] Initial migrations run successfully

### Security
- [ ] Run `python manage.py check --deploy` with no errors
- [ ] Security headers verified at https://securityheaders.com/
- [ ] File upload size limits configured
- [ ] Rate limiting tested
- [ ] CSRF protection verified
- [ ] All test/debug endpoints removed or secured

### Server Configuration
- [ ] Firewall configured (ports 80, 443 only)
- [ ] SSH key-based authentication enabled
- [ ] Root login disabled
- [ ] Fail2ban or similar installed
- [ ] Server OS and packages updated
- [ ] Monitoring tools installed

### Application
- [ ] Static files collected: `python manage.py collectstatic`
- [ ] Media directory permissions set correctly
- [ ] Admin superuser created
- [ ] Default admin accounts removed
- [ ] Email settings configured (if using)
- [ ] Logging configured and tested

### Docker
- [ ] All containers start successfully: `docker-compose ps`
- [ ] Health checks passing
- [ ] Resource limits configured appropriately
- [ ] Volumes configured for persistence
- [ ] Networks configured securely

### Backups
- [ ] Backup script tested: `./scripts/backup.sh`
- [ ] Automated daily backups configured
- [ ] Backup retention policy set
- [ ] Restore process tested: `./scripts/restore.sh`
- [ ] Off-site backup configured (recommended)

## Post-Deployment Verification

### Functionality Tests
- [ ] Application loads over HTTPS
- [ ] HTTP redirects to HTTPS
- [ ] Homepage displays correctly
- [ ] API endpoints responding: `/yearbook/api/`
- [ ] Admin panel accessible at custom URL
- [ ] Static files loading (CSS, JS, images)
- [ ] Media files uploading and displaying
- [ ] Certificate generation working
- [ ] Memory board functional
- [ ] All forms submitting correctly

### Performance Tests
- [ ] Page load time < 3 seconds
- [ ] API response time < 500ms
- [ ] Image optimization working
- [ ] Gzip compression enabled
- [ ] Caching headers set correctly

### Security Verification
- [ ] SSL certificate valid and trusted
- [ ] Security headers present (check browser DevTools)
- [ ] HSTS header present
- [ ] Content-Security-Policy configured
- [ ] X-Frame-Options set to DENY
- [ ] No mixed content warnings
- [ ] Session cookies marked Secure and HttpOnly
- [ ] CSRF tokens working on forms

### Monitoring Setup
- [ ] Health check endpoints responding
- [ ] Log aggregation configured
- [ ] Error tracking setup (Sentry, etc.)
- [ ] Uptime monitoring configured
- [ ] Disk space monitoring
- [ ] Database connection monitoring

## Go-Live Checklist

### Final Steps Before Launch
- [ ] DNS records updated and propagated
- [ ] SSL certificate auto-renewal tested
- [ ] All team members have necessary access
- [ ] Emergency contacts documented
- [ ] Rollback plan prepared
- [ ] Backup taken immediately before go-live

### Launch
- [ ] Enable production environment
- [ ] Monitor logs for 30 minutes: `docker-compose logs -f`
- [ ] Test critical user paths
- [ ] Verify analytics/monitoring working

### Post-Launch (First 24 Hours)
- [ ] Monitor error logs hourly
- [ ] Check server resources (CPU, memory, disk)
- [ ] Verify backup completed successfully
- [ ] Check database performance
- [ ] Review security logs
- [ ] Test all major features

## Ongoing Maintenance Checklist

### Daily
- [ ] Check container status: `docker-compose ps`
- [ ] Review error logs
- [ ] Monitor disk space
- [ ] Verify backups completed

### Weekly
- [ ] Review security logs
- [ ] Check for package updates
- [ ] Review performance metrics
- [ ] Test backup restore process (monthly rotation)

### Monthly
- [ ] Update dependencies
- [ ] Security audit
- [ ] Performance optimization review
- [ ] Clean up old Docker images
- [ ] Review and rotate logs
- [ ] Check SSL certificate expiration

### Quarterly
- [ ] Full security assessment
- [ ] Disaster recovery drill
- [ ] Capacity planning review
- [ ] User feedback review
- [ ] Code quality review

## Emergency Procedures

### If Site Goes Down
1. Check container status: `docker-compose ps`
2. Check logs: `docker-compose logs --tail=100`
3. Restart services: `docker-compose restart`
4. If persists, restore from backup
5. Contact development team

### If Database Corrupted
1. Stop application: `docker-compose down`
2. Restore from latest backup: `./scripts/restore.sh <date>`
3. Verify data integrity
4. Restart application
5. Monitor closely

### If Hacked/Compromised
1. Take site offline immediately
2. Preserve logs and evidence
3. Change all passwords and keys
4. Restore from clean backup
5. Patch vulnerabilities
6. Notify affected users
7. File incident report

## Contact Information

**Primary Contact**: ___________________________  
**Email**: ___________________________  
**Phone**: ___________________________  

**Backup Contact**: ___________________________  
**Email**: ___________________________  
**Phone**: ___________________________  

**Hosting Provider**: ___________________________  
**Support**: ___________________________  
**Emergency**: ___________________________  

---

## Sign-Off

**Deployed by**: ___________________________  
**Date**: ___________________________  
**Signature**: ___________________________  

**Verified by**: ___________________________  
**Date**: ___________________________  
**Signature**: ___________________________  

---

**Keep this checklist updated and review before each deployment!**

Last Updated: January 2025


