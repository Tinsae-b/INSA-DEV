# Docker Desktop Guide - INSA Year-Book

## ✅ Your Docker Desktop Version: 4.48.0

Great! You have Docker Desktop 4.48.0, which is a recent version with full support for all features used in this project.

---

## 📌 Important: Compose V2 Syntax

Docker Desktop 4.48.0 uses **Docker Compose V2** by default. This means:

### ✅ Use This (Compose V2 - with space):
```bash
docker compose up -d
docker compose down
docker compose logs -f
```

### ❌ Not This (Old syntax - with hyphen):
```bash
docker-compose up -d      # Old syntax (still works via compatibility layer)
docker-compose down
docker-compose logs -f
```

**Note**: The old `docker-compose` command still works in Docker Desktop 4.48.0, but it's recommended to use the new `docker compose` syntax.

---

## 🚀 Quick Start for Your Version

### 1. Verify Docker Installation

```bash
# Check Docker version
docker --version
# Expected: Docker version 27.x.x or higher

# Check Compose version
docker compose version
# Expected: Docker Compose version v2.x.x
```

### 2. Start Development Environment

```bash
# Navigate to project directory
cd Year-Book

# Start all services
docker compose -f docker-compose.dev.yml up -d

# Check status
docker compose -f docker-compose.dev.yml ps
```

### 3. View in Docker Desktop UI

1. Open Docker Desktop
2. Click on "Containers" in the left sidebar
3. You should see:
   - `yearbook_db_dev` (PostgreSQL)
   - `yearbook_backend_dev` (Django)
   - `yearbook_frontend_dev` (Next.js)

### 4. Monitor Logs in Docker Desktop

- Click on any container name
- View real-time logs in the UI
- Or use terminal: `docker compose -f docker-compose.dev.yml logs -f`

---

## 🎯 Features Available in Docker Desktop 4.48.0

All features in your setup are fully supported:

### ✅ Supported Features
- ✅ Multi-stage builds
- ✅ Health checks
- ✅ Volume management
- ✅ Network isolation
- ✅ Resource limits
- ✅ Build cache optimization
- ✅ Compose file version 3.8
- ✅ Named volumes
- ✅ Bridge networks
- ✅ Environment variables

### 🆕 Docker Desktop 4.48.0 Specific Features
- **Enhanced Performance**: Better filesystem performance on Windows
- **Improved UI**: Container logs and stats in dashboard
- **Rosetta Emulation**: Fast emulation for cross-platform builds (Mac)
- **Builds View**: Track build progress in UI
- **Docker Scout**: Vulnerability scanning built-in

---

## 💻 Using Docker Desktop Dashboard

### Managing Containers

1. **Start/Stop Containers**
   - Click container name → Click "Stop" or "Start" button
   - Or use compose: `docker compose up -d` / `docker compose down`

2. **View Logs**
   - Click container → "Logs" tab
   - Real-time log streaming
   - Search and filter logs

3. **Execute Commands**
   - Click container → "Exec" tab
   - Run shell commands interactively
   - Or use: `docker compose exec backend sh`

4. **Inspect Containers**
   - Click container → "Inspect" tab
   - View environment variables
   - Check network settings
   - Monitor resource usage

### Managing Images

1. **View Images**
   - Click "Images" in left sidebar
   - See all built images
   - Check image sizes

2. **Clean Up Images**
   - Click "Clean up" button
   - Remove unused images
   - Free up disk space

### Managing Volumes

1. **View Volumes**
   - Click "Volumes" in left sidebar
   - See persistent data volumes:
     - `postgres_dev_data`
     - `redis_data`
     - `static_volume`
     - `media_volume`

2. **Backup Volumes**
   - Use scripts: `./scripts/backup.sh`
   - Or export via Docker Desktop UI

---

## 🔧 Configuration for Windows

### WSL 2 Backend (Recommended)

Docker Desktop 4.48.0 on Windows uses WSL 2 by default. Ensure:

1. **WSL 2 is enabled**
   ```powershell
   wsl --list --verbose
   # Should show WSL 2 for your distro
   ```

2. **File location matters**
   - ✅ **Recommended**: Store project in WSL filesystem
     ```bash
     # From WSL terminal
     cd ~/projects
     git clone <repo>
     ```
   - ⚠️ **Slower**: Storing in Windows filesystem (C:\Users\...)
     - Still works but file operations are slower
     - Your current location is fine, but WSL would be faster

3. **Resource Allocation**
   - Docker Desktop → Settings → Resources
   - Recommended for this project:
     - **Memory**: 4-6 GB
     - **CPUs**: 2-4 cores
     - **Disk**: 20-30 GB

---

## 🐛 Troubleshooting Docker Desktop 4.48.0

### Issue: "Cannot connect to Docker daemon"

**Solution:**
1. Make sure Docker Desktop is running
2. Check system tray for Docker icon
3. Restart Docker Desktop

### Issue: Containers won't start

**Solution:**
```bash
# Clean restart
docker compose down -v
docker compose up -d --force-recreate

# Check logs
docker compose logs
```

### Issue: Port already in use

**Solution:**
```bash
# Windows: Find what's using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID)
taskkill /PID <process_id> /F

# Or change ports in docker-compose.yml
```

### Issue: Slow performance on Windows

**Solutions:**
1. Move project to WSL 2 filesystem
2. Increase resources in Docker Desktop settings
3. Enable "Use the WSL 2 based engine" in settings
4. Exclude project folder from Windows Defender

### Issue: Volume permissions

**Solution:**
```bash
# Fix permissions in backend container
docker compose exec backend chown -R django:django /app/media
```

---

## ⚡ Performance Tips for Windows

### 1. Use WSL 2 Backend
```bash
# Check if WSL 2 is enabled
docker info | grep "Operating System"
# Should show: Operating System: Docker Desktop
```

### 2. Optimize File Sharing
- Docker Desktop → Settings → Resources → File sharing
- Only share necessary drives

### 3. Allocate Enough Resources
- **Development**: 4GB RAM, 2 CPUs minimum
- **Production**: 8GB RAM, 4 CPUs recommended

### 4. Use BuildKit
Already enabled by default in Docker Desktop 4.48.0
```bash
# Verify BuildKit is enabled
docker buildx version
```

---

## 📊 Monitoring Resources

### Using Docker Desktop UI

1. **Containers View**
   - See CPU & Memory usage per container
   - Real-time graphs

2. **Dashboard Stats**
   - Overall resource usage
   - Disk space usage

### Using CLI

```bash
# Container stats
docker stats

# Disk usage
docker system df

# Detailed disk usage
docker system df -v
```

---

## 🔄 Updating Docker Desktop

Your version (4.48.0) is recent, but to update:

1. Docker Desktop → Check for updates
2. Download and install latest version
3. Restart Docker Desktop
4. Verify: `docker --version`

---

## 🎯 Quick Commands for Your Setup

### Development Workflow

```bash
# Start everything
docker compose -f docker-compose.dev.yml up -d

# View all logs
docker compose -f docker-compose.dev.yml logs -f

# View specific service logs
docker compose -f docker-compose.dev.yml logs -f backend

# Restart a service
docker compose -f docker-compose.dev.yml restart backend

# Stop everything
docker compose -f docker-compose.dev.yml down

# Clean up completely (removes volumes)
docker compose -f docker-compose.dev.yml down -v
```

### Accessing Services

```bash
# Django shell
docker compose -f docker-compose.dev.yml exec backend python manage.py shell

# Database shell
docker compose -f docker-compose.dev.yml exec db psql -U yearbook_dev yearbook_dev

# Backend bash
docker compose -f docker-compose.dev.yml exec backend sh

# Frontend bash
docker compose -f docker-compose.dev.yml exec frontend sh
```

---

## ✅ Your Setup is Ready!

Everything is configured to work perfectly with Docker Desktop 4.48.0 on Windows.

### Next Steps:

1. **Start Development**
   ```bash
   docker compose -f docker-compose.dev.yml up -d
   ```

2. **Access Application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8000
   - Admin: http://localhost:8000/admin/

3. **Monitor in Docker Desktop**
   - Open Docker Desktop
   - View containers, logs, and stats

---

## 📚 Related Documentation

- [Quick Start Guide](QUICK_START.md)
- [Deployment Guide](DEPLOYMENT_GUIDE.md)
- [Architecture](ARCHITECTURE.md)

---

**Happy Developing! 🚀**

*Optimized for Docker Desktop 4.48.0 on Windows*

