# Django Security Implementation Guide

This document outlines the comprehensive security measures implemented in the ASTU Yearbook Django backend, based on the [Django Security Documentation](https://docs.djangoproject.com/en/5.2/topics/security/).

## Table of Contents
1. [Security Features Implemented](#security-features-implemented)
2. [Initial Setup](#initial-setup)
3. [Environment Configuration](#environment-configuration)
4. [Production Deployment](#production-deployment)
5. [Security Best Practices](#security-best-practices)
6. [Monitoring and Maintenance](#monitoring-and-maintenance)

---

## Security Features Implemented

### ✅ 1. Cross-Site Scripting (XSS) Protection
- **Django Templates**: Automatic escaping of HTML characters
- **Custom Sanitization**: `bleach` library for HTML input sanitization
- **Implementation**: All user inputs are sanitized in `yearbook/security.py`
- **Location**: `sanitize_html_input()` function

### ✅ 2. Cross-Site Request Forgery (CSRF) Protection
- **Middleware**: `CsrfViewMiddleware` enabled
- **Secure Cookies**: CSRF tokens use HttpOnly and Secure flags (in production)
- **Custom Cookie Names**: `astu_csrftoken` to avoid fingerprinting
- **Trusted Origins**: Configured for AJAX requests

### ✅ 3. SQL Injection Protection
- **Django ORM**: All queries use parameterized statements
- **Input Validation**: Regular expressions validate user inputs
- **Example**: Certificate verification validates student ID format

### ✅ 4. Clickjacking Protection
- **X-Frame-Options**: Set to `DENY`
- **CSP Frame Ancestors**: Configured to `'none'`
- **Middleware**: `XFrameOptionsMiddleware` enabled

### ✅ 5. SSL/HTTPS Security
- **Secure Redirects**: `SECURE_SSL_REDIRECT` (configurable)
- **HSTS**: HTTP Strict Transport Security headers
- **Secure Cookies**: Session and CSRF cookies use Secure flag in production
- **Settings**: All configured via environment variables

### ✅ 6. Session Security
- **Database-backed sessions**: More secure than cookie-based
- **HttpOnly**: Session cookies not accessible via JavaScript
- **SameSite**: Set to 'Lax' for CSRF protection
- **Timeout**: Configurable session expiration (default: 1 hour)
- **Custom Name**: `astu_sessionid` to avoid fingerprinting

### ✅ 7. Content Security Policy (CSP)
- **django-csp**: Full CSP headers implementation
- **Configured Directives**: 
  - `default-src`: 'self'
  - `script-src`, `style-src`: Limited inline scripts
  - `frame-ancestors`: 'none' (no framing)
  - `img-src`: Self, data URIs, and blobs

### ✅ 8. File Upload Security
- **Size Validation**: Maximum 5MB (configurable)
- **Extension Validation**: Whitelist of allowed extensions
- **Content Validation**: Uses Pillow to verify actual image content
- **Filename Sanitization**: Removes dangerous characters
- **Path Traversal Prevention**: Validates file paths

### ✅ 9. Rate Limiting
- **django-ratelimit**: Protects against brute force attacks
- **API Endpoints**: Throttled (100-200 requests/hour)
- **Authentication**: Extra protection on sensitive endpoints
- **Certificate Downloads**: 10 requests/minute limit

### ✅ 10. Input Validation & Sanitization
- **HTML Sanitization**: All text inputs cleaned
- **File Validation**: Comprehensive image validation
- **Path Validation**: Prevents directory traversal
- **Regular Expressions**: Validates formats (e.g., student IDs)

### ✅ 11. Security Headers
- **X-Content-Type-Options**: `nosniff`
- **X-XSS-Protection**: Browser XSS filter enabled
- **Referrer-Policy**: `same-origin`
- **Cross-Origin-Opener-Policy**: `same-origin`
- **Permissions-Policy**: Restricts browser features

### ✅ 12. Security Logging
- **Security Events**: Logged to `security.log`
- **Suspicious Activity**: Path traversal attempts, invalid uploads
- **Error Tracking**: Request errors logged
- **IP Tracking**: Client IP addresses recorded

### ✅ 13. CORS Configuration
- **Whitelist Only**: Specific origins allowed
- **No Wildcards**: `CORS_ALLOW_ALL_ORIGINS` disabled in production
- **Credentials**: Controlled via `CORS_ALLOW_CREDENTIALS`
- **Methods**: Limited to necessary HTTP methods

### ✅ 14. Admin Security
- **Custom URL**: Configurable admin path (not `/admin/`)
- **Access Control**: Staff-only decorators
- **Logging**: Admin access attempts logged

---

## Initial Setup

### 1. Install Dependencies

```bash
cd Year-Book/astu_yearbook
pip install -r requirements.txt
```

### 2. Create Environment File

Copy the example environment file:

```bash
# Linux/Mac
cp env.example .env

# Windows PowerShell
Copy-Item env.example .env
```

### 3. Generate Secret Key

Generate a new Django secret key (IMPORTANT: Never use the default!):

```python
# Run in Python shell
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### 4. Configure Environment Variables

Edit `.env` file with your settings:

```env
SECRET_KEY=your-generated-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

---

## Environment Configuration

### Development Settings (`.env`)

```env
# Development
DEBUG=True
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1

# CORS - Allow localhost
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Security (disabled for development)
SECURE_SSL_REDIRECT=False
SESSION_COOKIE_SECURE=False
CSRF_COOKIE_SECURE=False
```

### Production Settings (`.env`)

```env
# Production
DEBUG=False
SECRET_KEY=your-strong-production-secret-key
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# CORS - Your actual domains
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# HTTPS Security (ENABLE IN PRODUCTION)
SECURE_SSL_REDIRECT=True
SECURE_HSTS_SECONDS=31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS=True
SECURE_HSTS_PRELOAD=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True

# Custom Admin URL (change this!)
ADMIN_URL=your-secret-admin-path-123/

# Session Security
SESSION_COOKIE_AGE=3600
SESSION_SAVE_EVERY_REQUEST=True
SESSION_EXPIRE_AT_BROWSER_CLOSE=True

# File Upload Limits (in MB)
MAX_UPLOAD_SIZE=5

# Admin Email
ADMIN_EMAIL=admin@yourdomain.com
```

---

## Production Deployment

### 1. Pre-Deployment Checklist

- [ ] Set `DEBUG=False` in production `.env`
- [ ] Generate new `SECRET_KEY` for production
- [ ] Configure `ALLOWED_HOSTS` with your domain(s)
- [ ] Enable all HTTPS/SSL settings
- [ ] Change `ADMIN_URL` to something unpredictable
- [ ] Configure `CORS_ALLOWED_ORIGINS` with production URLs
- [ ] Set up database (PostgreSQL recommended over SQLite)
- [ ] Configure email for security notifications
- [ ] Review and adjust rate limiting settings

### 2. HTTPS Setup

**IMPORTANT**: Always use HTTPS in production!

1. Obtain SSL certificate (Let's Encrypt, etc.)
2. Configure your web server (nginx/apache) for HTTPS
3. Enable HTTPS settings in `.env`:
   ```env
   SECURE_SSL_REDIRECT=True
   SECURE_HSTS_SECONDS=31536000
   SESSION_COOKIE_SECURE=True
   CSRF_COOKIE_SECURE=True
   ```

### 3. Web Server Configuration

#### Nginx Example

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    # SSL Configuration
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # Security Headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "same-origin" always;
    
    # File Upload Size Limit
    client_max_body_size 5M;
    
    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Serve media files (secure alternative)
    location /media/ {
        alias /path/to/media/;
        expires 30d;
        access_log off;
    }
    
    location /static/ {
        alias /path/to/static/;
        expires 1y;
        access_log off;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

### 4. Database Setup (Production)

Replace SQLite with PostgreSQL:

```env
# .env
DATABASE_NAME=astu_yearbook
DATABASE_USER=db_user
DATABASE_PASSWORD=strong_password
DATABASE_HOST=localhost
DATABASE_PORT=5432
```

Update `settings.py` to read database credentials from environment.

### 5. Static Files

```bash
# Collect static files
python manage.py collectstatic --noinput
```

### 6. Run Migrations

```bash
python manage.py migrate
```

### 7. Create Superuser

```bash
python manage.py createsuperuser
```

### 8. Deploy with Gunicorn

```bash
gunicorn astu_yearbook.wsgi:application --bind 0.0.0.0:8000 --workers 3
```

Or use systemd service:

```ini
# /etc/systemd/system/astu-yearbook.service
[Unit]
Description=ASTU Yearbook Django Application
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/path/to/Year-Book/astu_yearbook
Environment="PATH=/path/to/venv/bin"
ExecStart=/path/to/venv/bin/gunicorn --workers 3 --bind 127.0.0.1:8000 astu_yearbook.wsgi:application

[Install]
WantedBy=multi-user.target
```

---

## Security Best Practices

### 1. Secret Key Management
- **NEVER** commit `.env` or secrets to git
- Use different secret keys for dev and production
- Rotate keys periodically
- Use environment variables or secure vaults

### 2. User Input
- **ALWAYS** validate and sanitize user input
- Use Django forms for validation
- Implement whitelist validation (not blacklist)
- Limit input length and format

### 3. File Uploads
- Validate file types by content, not just extension
- Limit file sizes
- Store uploads outside web root if possible
- Scan uploads for malware (in high-security environments)
- Use CDN or separate domain for user-uploaded content

### 4. Authentication
- Use strong password requirements
- Implement account lockout after failed attempts
- Use two-factor authentication (2FA) for admin
- Log authentication events

### 5. Database Security
- Use parameterized queries (Django ORM does this)
- Limit database user permissions
- Regular backups
- Encrypt sensitive data at rest

### 6. API Security
- Implement rate limiting
- Use authentication tokens
- Validate all API inputs
- Version your API

### 7. Dependencies
- Keep Django and all packages up to date
- Regularly run `pip list --outdated`
- Subscribe to security advisories
- Use `pip-audit` to check for vulnerabilities

### 8. Error Handling
- Don't expose stack traces in production (`DEBUG=False`)
- Log errors securely
- Implement custom error pages
- Monitor error rates

---

## Monitoring and Maintenance

### 1. Security Logs

Monitor `security.log` for:
- Failed login attempts
- Suspicious requests (SQL injection, XSS attempts)
- Path traversal attempts
- Invalid file uploads
- Rate limit violations

```bash
# View recent security events
tail -f security.log

# Search for specific events
grep "path_traversal" security.log
```

### 2. Django Security Check

Run Django's security check command:

```bash
python manage.py check --deploy
```

This checks for common security misconfigurations.

### 3. Regular Updates

```bash
# Check for outdated packages
pip list --outdated

# Update packages
pip install --upgrade django djangorestframework

# Update requirements file
pip freeze > requirements.txt
```

### 4. Backup Strategy

- **Database**: Daily automated backups
- **Media Files**: Weekly backups
- **Configuration**: Version control (exclude secrets)
- **Test Restores**: Monthly validation

### 5. Security Audits

- **Monthly**: Review security logs
- **Quarterly**: Update dependencies
- **Annually**: Full security audit
- **After incidents**: Immediate review and patching

### 6. Incident Response Plan

1. **Detect**: Monitor logs and alerts
2. **Isolate**: Disable compromised accounts/features
3. **Investigate**: Analyze logs and attack vectors
4. **Remediate**: Patch vulnerabilities
5. **Document**: Record incident and response
6. **Review**: Update security measures

---

## Testing Security

### 1. Manual Testing

```bash
# Test rate limiting
for i in {1..200}; do curl http://localhost:8000/yearbook/api/students/; done

# Test CSRF protection
curl -X POST http://localhost:8000/yearbook/api/students/ -d '{"name":"test"}'

# Test file upload validation
curl -X POST http://localhost:8000/yearbook/api/students/ -F "photo=@malicious.exe"
```

### 2. Automated Security Scanning

```bash
# Install safety to check for known vulnerabilities
pip install safety

# Check dependencies
safety check

# Install bandit for code security analysis
pip install bandit

# Scan code
bandit -r yearbook/
```

### 3. Penetration Testing

Consider professional penetration testing for production:
- OWASP ZAP
- Burp Suite
- Professional security firms

---

## Common Security Vulnerabilities Fixed

| Vulnerability | How We Fixed It | Settings/Code |
|---------------|-----------------|---------------|
| XSS (Cross-Site Scripting) | Input sanitization, template escaping | `security.py`, Django templates |
| CSRF | CSRF middleware, token validation | `CSRF_COOKIE_SECURE`, `CsrfViewMiddleware` |
| SQL Injection | ORM parameterization, input validation | Django ORM, regex validation |
| Clickjacking | X-Frame-Options, CSP | `X_FRAME_OPTIONS = 'DENY'` |
| Path Traversal | Path validation, sanitization | `views.py` certificate handling |
| Brute Force | Rate limiting | `django-ratelimit` decorators |
| Session Hijacking | Secure cookies, HTTPS | `SESSION_COOKIE_SECURE` |
| Information Disclosure | DEBUG=False, custom error pages | `DEBUG` setting |
| Insecure File Uploads | File validation, size limits | `security.py` validation functions |
| Weak Secret Keys | Environment variables | `.env` configuration |

---

## Additional Resources

- [Django Security Documentation](https://docs.djangoproject.com/en/5.2/topics/security/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Django Security Best Practices](https://docs.djangoproject.com/en/stable/howto/deployment/checklist/)
- [Mozilla Web Security](https://infosec.mozilla.org/guidelines/web_security)

---

## Support and Questions

For security concerns or questions:
1. Review this documentation
2. Check Django security docs
3. Review `yearbook/security.py` for implementation details
4. Contact the development team

**IMPORTANT**: Never disclose security vulnerabilities publicly. Report them privately to the development team.

---

## Changelog

- **v1.0** - Initial comprehensive security implementation
  - XSS protection
  - CSRF protection
  - SQL injection prevention
  - File upload validation
  - Rate limiting
  - Security logging
  - Custom security middleware
  - Content Security Policy
  - Session security
  - HTTPS configuration

---

**Last Updated**: October 2025
**Django Version**: 5.2.2
**Security Review**: Recommended quarterly

