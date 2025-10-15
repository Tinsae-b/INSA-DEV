# Quick Start: Securing Your Django Backend

This is a simplified guide to get security features up and running quickly. For comprehensive details, see `SECURITY_SETUP.md`.

## 🚀 5-Minute Setup

### Step 1: Install Dependencies
```bash
cd Year-Book/astu_yearbook
pip install -r requirements.txt
```

### Step 2: Create Environment File
```bash
# Copy example file
cp env.example .env

# Generate a new secret key
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### Step 3: Edit `.env` File
```env
SECRET_KEY=paste-your-generated-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

### Step 4: Apply Migrations
```bash
python manage.py migrate
```

### Step 5: Create Admin User
```bash
python manage.py createsuperuser
```

### Step 6: Run Server
```bash
python manage.py runserver
```

✅ **Done!** Your Django backend now has comprehensive security features enabled.

---

## 🔒 What's Protected Now?

| Protection | Status | Description |
|------------|--------|-------------|
| ✅ XSS | Active | All user inputs sanitized |
| ✅ CSRF | Active | Cross-site request forgery protection |
| ✅ SQL Injection | Active | Parameterized queries only |
| ✅ Clickjacking | Active | X-Frame-Options: DENY |
| ✅ File Upload | Active | Validated size, type, and content |
| ✅ Rate Limiting | Active | Prevents brute force attacks |
| ✅ Path Traversal | Active | File paths validated |
| ✅ Security Headers | Active | CSP, HSTS, etc. |
| ✅ Session Security | Active | Secure cookies, timeouts |
| ✅ Input Validation | Active | All inputs sanitized |

---

## 🚨 Before Going to Production

### Critical Steps:
1. **Set `DEBUG=False`** in `.env`
2. **Generate new `SECRET_KEY`** (different from development)
3. **Configure real domains** in `ALLOWED_HOSTS`
4. **Enable HTTPS** settings:
   ```env
   SECURE_SSL_REDIRECT=True
   SESSION_COOKIE_SECURE=True
   CSRF_COOKIE_SECURE=True
   SECURE_HSTS_SECONDS=31536000
   ```
5. **Change admin URL** to something unpredictable:
   ```env
   ADMIN_URL=my-secret-admin-path-xyz123/
   ```

### Run Security Check:
```bash
python manage.py check --deploy
```

Fix any warnings before deploying!

---

## 📝 Testing Security Features

### Test Rate Limiting:
```bash
# Make multiple rapid requests
for i in {1..150}; do curl http://localhost:8000/yearbook/api/students/; done
```
You should get rate limited after 100 requests/hour.

### Test CSRF Protection:
```bash
# Try POST without CSRF token
curl -X POST http://localhost:8000/yearbook/api/students/ -d '{"name":"test"}'
```
Should be rejected with CSRF error.

### Test File Upload Validation:
Try uploading:
- File larger than 5MB (should fail)
- Non-image file (should fail)
- Valid image (should succeed)

### Check Security Logs:
```bash
tail -f security.log
```
Watch for suspicious activity being logged.

---

## 🛠️ Common Configuration

### Increase Upload Size Limit:
```env
MAX_UPLOAD_SIZE=10  # 10MB
```

### Adjust Rate Limits:
Edit `yearbook/views.py`:
```python
@ratelimit(key='ip', rate='200/h')  # 200 requests per hour
```

### Customize Session Timeout:
```env
SESSION_COOKIE_AGE=7200  # 2 hours in seconds
```

### Add More Allowed Origins:
```env
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,http://app.example.com
```

---

## 🐛 Troubleshooting

### CSRF Token Issues
**Problem**: Frontend can't make POST requests
**Solution**: 
1. Ensure `CORS_ALLOW_CREDENTIALS=True` (already set)
2. Frontend must include CSRF token in requests
3. Check `CSRF_TRUSTED_ORIGINS` includes your frontend URL

### Rate Limit Too Strict
**Problem**: Getting rate limited during normal use
**Solution**: Increase rates in `views.py` decorators

### File Upload Fails
**Problem**: Valid images rejected
**Solution**: 
1. Check file size < `MAX_UPLOAD_SIZE`
2. Ensure file extension in `ALLOWED_IMAGE_EXTENSIONS`
3. Verify image is not corrupted

### Import Errors
**Problem**: `ModuleNotFoundError` for security packages
**Solution**:
```bash
pip install -r requirements.txt --upgrade
```

---

## 📚 Next Steps

1. ✅ Complete this quick start
2. 📖 Read `SECURITY_SETUP.md` for detailed configuration
3. ✅ Use `SECURITY_CHECKLIST.md` before deployment
4. 🔍 Monitor `security.log` regularly
5. 📦 Keep dependencies updated

---

## 🆘 Need Help?

1. **Check logs**: `tail -f security.log`
2. **Run security check**: `python manage.py check --deploy`
3. **Review documentation**: See `SECURITY_SETUP.md`
4. **Django docs**: https://docs.djangoproject.com/en/5.2/topics/security/

---

## 🎯 Key Files

| File | Purpose |
|------|---------|
| `settings.py` | Main security configuration |
| `security.py` | Security utilities & middleware |
| `views.py` | Input validation & sanitization |
| `.env` | Environment variables (SECRET!) |
| `security.log` | Security event logs |

---

**Remember**: 
- ❌ NEVER commit `.env` to git
- ✅ ALWAYS use HTTPS in production
- 🔄 Regularly update dependencies
- 📊 Monitor security logs

**You're now running a secure Django backend! 🎉**

For production deployment, proceed to `SECURITY_SETUP.md` → Production Deployment section.

