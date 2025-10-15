# Security Deployment Checklist

Use this checklist before deploying to production or when reviewing security.

## Pre-Deployment Security Checklist

### Environment Configuration
- [ ] Created `.env` file from `env.example`
- [ ] Generated new `SECRET_KEY` (not using default)
- [ ] Set `DEBUG=False` in production
- [ ] Configured `ALLOWED_HOSTS` with actual domains
- [ ] Changed `ADMIN_URL` to non-default value
- [ ] Set `CORS_ALLOWED_ORIGINS` to production URLs only
- [ ] Configured admin email for notifications

### HTTPS/SSL Configuration
- [ ] SSL certificate installed and valid
- [ ] Set `SECURE_SSL_REDIRECT=True`
- [ ] Set `SECURE_HSTS_SECONDS=31536000`
- [ ] Set `SECURE_HSTS_INCLUDE_SUBDOMAINS=True`
- [ ] Set `SESSION_COOKIE_SECURE=True`
- [ ] Set `CSRF_COOKIE_SECURE=True`
- [ ] Web server configured for HTTPS

### Database Security
- [ ] Using PostgreSQL or MySQL (not SQLite in production)
- [ ] Database credentials in environment variables
- [ ] Database user has minimal required permissions
- [ ] Database backups configured
- [ ] Database not accessible from public internet

### File & Media Security
- [ ] Configured `MAX_UPLOAD_SIZE` appropriately
- [ ] Media files served from separate domain or CDN (recommended)
- [ ] Web server configured to serve static/media files
- [ ] File upload directories have proper permissions

### Application Security
- [ ] All dependencies updated to latest secure versions
- [ ] Ran `python manage.py check --deploy` with no warnings
- [ ] Removed any test/debug endpoints
- [ ] Configured proper logging
- [ ] Set up monitoring for security logs

### Access Control
- [ ] Created admin user with strong password
- [ ] Removed or disabled default admin accounts
- [ ] Staff users have appropriate permissions only
- [ ] Admin panel accessible only via HTTPS

### Network Security
- [ ] Firewall configured (only ports 80, 443 open)
- [ ] SSH uses key-based authentication
- [ ] Server OS and packages updated
- [ ] Database port not exposed to public

## Post-Deployment Verification

### Functionality Tests
- [ ] Application loads over HTTPS
- [ ] HTTP redirects to HTTPS
- [ ] Admin panel accessible at custom URL
- [ ] File uploads work and are validated
- [ ] CSRF protection working (API requests need tokens)
- [ ] Rate limiting working (test with multiple requests)

### Security Tests
- [ ] SSL Labs test: https://www.ssllabs.com/ssltest/
- [ ] Security headers check: https://securityheaders.com/
- [ ] Run: `python manage.py check --deploy`
- [ ] Run: `safety check` for vulnerable dependencies
- [ ] Review security.log for any issues

### Browser Tests
- [ ] Check for mixed content warnings
- [ ] Verify cookies are marked Secure and HttpOnly
- [ ] Test HSTS headers in browser dev tools
- [ ] Verify CSP headers in browser dev tools

## Regular Maintenance Checklist (Monthly)

- [ ] Review security logs for suspicious activity
- [ ] Check for outdated packages: `pip list --outdated`
- [ ] Update Django and dependencies
- [ ] Verify backups are working
- [ ] Review user accounts and permissions
- [ ] Check disk space and log rotation

## Incident Response Checklist

If you suspect a security breach:

1. **Immediate Actions**
   - [ ] Change all passwords and secret keys
   - [ ] Review recent access logs
   - [ ] Disable compromised user accounts
   - [ ] Take system snapshot for forensics

2. **Investigation**
   - [ ] Check security.log for suspicious patterns
   - [ ] Review database for unauthorized changes
   - [ ] Analyze network traffic logs
   - [ ] Identify attack vector

3. **Remediation**
   - [ ] Patch identified vulnerabilities
   - [ ] Update security configurations
   - [ ] Restore from backup if needed
   - [ ] Notify affected users if required

4. **Documentation**
   - [ ] Document the incident
   - [ ] Record timeline of events
   - [ ] Document response actions
   - [ ] Update security procedures

5. **Follow-up**
   - [ ] Conduct post-incident review
   - [ ] Update security measures
   - [ ] Train team on lessons learned
   - [ ] Consider external security audit

## Quick Security Commands

```bash
# Generate new secret key
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"

# Run security checks
python manage.py check --deploy

# Check for vulnerable dependencies
pip install safety
safety check

# View recent security logs
tail -n 100 security.log

# Search for suspicious activity
grep -i "suspicious\|failed\|attack" security.log

# Check for outdated packages
pip list --outdated

# Collect static files
python manage.py collectstatic --noinput

# Run database migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser
```

## Security Resources

- **Django Security Docs**: https://docs.djangoproject.com/en/5.2/topics/security/
- **OWASP Top 10**: https://owasp.org/www-project-top-ten/
- **SSL Test**: https://www.ssllabs.com/ssltest/
- **Security Headers**: https://securityheaders.com/
- **Django Deployment Checklist**: https://docs.djangoproject.com/en/stable/howto/deployment/checklist/

## Emergency Contacts

```
Development Team: [Add contact info]
System Administrator: [Add contact info]
Security Team: [Add contact info]
Hosting Provider Support: [Add contact info]
```

---

**Print this checklist and use it for every deployment!**

Last Updated: October 2025

