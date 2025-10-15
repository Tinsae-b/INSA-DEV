# System Architecture - INSA Year-Book

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Internet / Users                         │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTPS (443) / HTTP (80)
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                     Nginx Reverse Proxy                          │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ • SSL/TLS Termination                                    │   │
│  │ • Load Balancing                                         │   │
│  │ • Static File Serving (/static, /media)                 │   │
│  │ • Security Headers (HSTS, CSP, X-Frame-Options)         │   │
│  │ • Rate Limiting & DDoS Protection                       │   │
│  │ • Gzip Compression                                       │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────┬─────────────────────────────┬──────────────────────┘
             │                             │
             │                             │
    ┌────────▼─────────┐          ┌───────▼──────────┐
    │  Next.js         │          │  Django          │
    │  Frontend        │          │  Backend         │
    │  (Port 3000)     │          │  (Port 8000)     │
    │                  │          │                  │
    │ ┌──────────────┐ │          │ ┌──────────────┐ │
    │ │ • React UI   │ │          │ │ • REST API   │ │
    │ │ • SSR/SSG    │ │          │ │ • Admin      │ │
    │ │ • Client     │ │◄────────►│ │ • Models     │ │
    │ │   Logic      │ │   API    │ │ • Views      │ │
    │ │ • Routing    │ │  Calls   │ │ • Auth       │ │
    │ └──────────────┘ │          │ └──────────────┘ │
    └──────────────────┘          └────────┬─────────┘
                                           │
                      ┌────────────────────┼────────────────────┐
                      │                    │                    │
           ┌──────────▼─────────┐  ┌──────▼────────┐  ┌───────▼────────┐
           │   PostgreSQL       │  │    Redis      │  │  Media Files   │
           │   Database         │  │    Cache      │  │   Storage      │
           │  (Port 5432)       │  │  (Port 6379)  │  │   (Volume)     │
           │                    │  │               │  │                │
           │ ┌────────────────┐ │  │ ┌───────────┐ │  │ ┌────────────┐ │
           │ │ • Students     │ │  │ │ • Session │ │  │ │ • Photos   │ │
           │ │ • Departments  │ │  │ │   Cache   │ │  │ │ • Certs    │ │
           │ │ • Memories     │ │  │ │ • Query   │ │  │ │ • Uploads  │ │
           │ │ • Faculty      │ │  │ │   Cache   │ │  │ └────────────┘ │
           │ │ • Leadership   │ │  │ │ • Rate    │ │  │                │
           │ │ • Certificates │ │  │ │   Limit   │ │  │                │
           │ └────────────────┘ │  │ └───────────┘ │  │                │
           └────────────────────┘  └───────────────┘  └────────────────┘
```

---

## Container Architecture

```
Docker Host
│
├── yearbook_network (Bridge Network)
│   │
│   ├── Container: nginx
│   │   ├── Ports: 80, 443
│   │   ├── Volumes: static, media, ssl, logs
│   │   └── Links: backend, frontend
│   │
│   ├── Container: backend (Django)
│   │   ├── Ports: 8000 (internal)
│   │   ├── Volumes: static, media, logs
│   │   ├── Env: .env
│   │   └── Depends: db, redis
│   │
│   ├── Container: frontend (Next.js)
│   │   ├── Ports: 3000 (internal)
│   │   ├── Env: NEXT_PUBLIC_API_URL
│   │   └── Depends: backend
│   │
│   ├── Container: db (PostgreSQL)
│   │   ├── Ports: 5432 (internal)
│   │   ├── Volumes: postgres_data
│   │   └── Env: POSTGRES_*
│   │
│   └── Container: redis
│       ├── Ports: 6379 (internal)
│       ├── Volumes: redis_data
│       └── Env: REDIS_PASSWORD
│
└── Volumes
    ├── postgres_data (Persistent)
    ├── redis_data (Persistent)
    ├── static_volume (Generated)
    ├── media_volume (User uploads)
    └── logs_volume (Application logs)
```

---

## Request Flow

### Frontend Request (SSR)
```
User Browser
    ↓
HTTPS Request
    ↓
Nginx (:443)
    ↓ (proxy_pass)
Next.js (:3000)
    ↓ (fetch API)
Django Backend (:8000)
    ↓ (query)
PostgreSQL / Redis
    ↓ (response)
Django → Next.js → Nginx → Browser
```

### API Request (Direct)
```
User Browser / Mobile App
    ↓
HTTPS Request to /yearbook/api/*
    ↓
Nginx (:443)
    ↓ (proxy_pass)
Django REST API (:8000)
    ↓ (query)
PostgreSQL / Redis
    ↓ (JSON response)
Django → Nginx → Client
```

### Static File Request
```
User Browser
    ↓
HTTPS Request to /static/* or /media/*
    ↓
Nginx (:443)
    ↓ (direct serve from volume)
File Response (with caching headers)
    ↓
Browser (cached for 7-30 days)
```

---

## Data Flow

### Certificate Generation
```
Admin adds Student
    ↓
Django Signal (post_save)
    ↓
generate_certificate() method
    ↓
PIL/Pillow processes template
    ↓
Save to media/certificates/generated/
    ↓
Return URL for verification
```

### Memory Board Upload
```
User submits form
    ↓
Next.js validates client-side
    ↓
POST to /yearbook/api/memories/
    ↓
Django validates (size, type, content)
    ↓
Security middleware (sanitize)
    ↓
Save to media/memories/
    ↓
Create database record
    ↓
Return success response
```

---

## Security Layers

```
┌─────────────────────────────────────────────┐
│ Layer 1: Network Security                   │
│ • Firewall (UFW)                            │
│ • Only ports 80, 443, 22 open              │
│ • SSH key authentication                    │
└─────────────────┬───────────────────────────┘
                  ↓
┌─────────────────────────────────────────────┐
│ Layer 2: SSL/TLS Encryption                 │
│ • TLS 1.3                                   │
│ • Strong cipher suites                      │
│ • HSTS enabled                              │
└─────────────────┬───────────────────────────┘
                  ↓
┌─────────────────────────────────────────────┐
│ Layer 3: Nginx Security                     │
│ • Rate limiting                             │
│ • Request size limits                       │
│ • Security headers                          │
│ • IP filtering (optional)                   │
└─────────────────┬───────────────────────────┘
                  ↓
┌─────────────────────────────────────────────┐
│ Layer 4: Application Security               │
│ • CSRF protection                           │
│ • XSS prevention                            │
│ • SQL injection protection (ORM)            │
│ • Input validation                          │
│ • File upload validation                    │
└─────────────────┬───────────────────────────┘
                  ↓
┌─────────────────────────────────────────────┐
│ Layer 5: Authentication & Authorization     │
│ • Django admin authentication               │
│ • Session management                        │
│ • Secure cookies                            │
│ • Password hashing (PBKDF2)                 │
└─────────────────┬───────────────────────────┘
                  ↓
┌─────────────────────────────────────────────┐
│ Layer 6: Database Security                  │
│ • Parameterized queries                     │
│ • Connection encryption                     │
│ • Least privilege access                    │
│ • Network isolation                         │
└─────────────────────────────────────────────┘
```

---

## Deployment Pipeline

```
┌─────────────────────────────────────────────────────────────────┐
│                    Developer Workflow                            │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    ┌────────▼─────────┐
                    │  Git Push to     │
                    │  GitHub (main)   │
                    └────────┬─────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                    GitHub Actions CI/CD                          │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ 1. Run Tests (Backend + Frontend)                       │   │
│  │ 2. Security Scans (Trivy, Safety)                       │   │
│  │ 3. Code Quality Checks (Flake8, ESLint)                 │   │
│  │ 4. Build Docker Images                                  │   │
│  │ 5. Push to Container Registry                           │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    ┌────────▼─────────┐
                    │  Deploy Trigger  │
                    │   (if main)      │
                    └────────┬─────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                    Production Server                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ 1. Pull latest code                                     │   │
│  │ 2. Pull Docker images                                   │   │
│  │ 3. Run database migrations                              │   │
│  │ 4. Collect static files                                 │   │
│  │ 5. Restart containers (zero-downtime)                   │   │
│  │ 6. Health check verification                            │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    ┌────────▼─────────┐
                    │  Monitoring &    │
                    │  Alerting        │
                    └──────────────────┘
```

---

## Scaling Strategy

### Vertical Scaling (Single Server)
```
Current: 4GB RAM, 2 CPU
    ↓ Upgrade to
8GB RAM, 4 CPU
    ↓ Then
16GB RAM, 8 CPU

Supports: 1K → 5K → 10K concurrent users
```

### Horizontal Scaling (Multiple Servers)
```
┌─────────────────────┐
│   Load Balancer     │
│   (HAProxy/ALB)     │
└──────┬──────────────┘
       │
       ├─────────┬─────────┬─────────┐
       │         │         │         │
   ┌───▼───┐ ┌──▼────┐ ┌──▼────┐ ┌──▼────┐
   │Server │ │Server │ │Server │ │Server │
   │   1   │ │   2   │ │   3   │ │   N   │
   └───┬───┘ └───┬───┘ └───┬───┘ └───┬───┘
       │         │         │         │
       └─────────┴─────────┴─────────┘
                  │
       ┌──────────▼───────────┐
       │  Shared PostgreSQL   │
       │   (RDS/Managed)      │
       └──────────────────────┘
```

---

## Monitoring Architecture

```
Application Containers
    ↓ (logs & metrics)
┌─────────────────────────┐
│   Logging System        │
│   • Docker logs         │
│   • Application logs    │
│   • Security logs       │
└───────┬─────────────────┘
        │
        ↓
┌─────────────────────────┐
│   Log Aggregation       │
│   • ELK Stack           │
│   • CloudWatch          │
│   • Loki                │
└───────┬─────────────────┘
        │
        ↓
┌─────────────────────────┐
│   Monitoring Dashboard  │
│   • Grafana             │
│   • Prometheus          │
│   • Custom Dashboard    │
└───────┬─────────────────┘
        │
        ↓
┌─────────────────────────┐
│   Alerting System       │
│   • Email               │
│   • Slack               │
│   • PagerDuty           │
└─────────────────────────┘
```

---

## Backup Strategy

```
Daily (2 AM)
    ↓
┌─────────────────────────┐
│  Backup Script          │
│  (scripts/backup.sh)    │
└───────┬─────────────────┘
        │
        ├────────────────┬────────────────┐
        │                │                │
┌───────▼────────┐ ┌────▼─────────┐ ┌───▼──────────┐
│   Database     │ │ Media Files  │ │  Config      │
│   (pg_dump)    │ │   (tar.gz)   │ │  (.env)      │
└───────┬────────┘ └────┬─────────┘ └───┬──────────┘
        │                │                │
        └────────────────┴────────────────┘
                     │
        ┌────────────▼─────────────┐
        │  Local Storage           │
        │  (./backups/)            │
        │  Retention: 30 days      │
        └────────────┬─────────────┘
                     │
        ┌────────────▼─────────────┐
        │  Off-site Backup         │
        │  • AWS S3                │
        │  • Azure Blob            │
        │  • Google Cloud Storage  │
        │  Retention: 1 year       │
        └──────────────────────────┘
```

---

## Technology Stack

### Frontend
- **Framework**: Next.js 15.2.4
- **Language**: TypeScript
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **Components**: Shadcn/ui
- **Icons**: Lucide React
- **State**: React Hooks

### Backend
- **Framework**: Django 5.2.2
- **API**: Django REST Framework
- **Language**: Python 3.11
- **Authentication**: Django Auth
- **Image Processing**: Pillow
- **WSGI Server**: Gunicorn

### Database & Cache
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **ORM**: Django ORM

### Infrastructure
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Reverse Proxy**: Nginx
- **SSL**: Let's Encrypt / Commercial

### DevOps
- **CI/CD**: GitHub Actions
- **Version Control**: Git
- **Registry**: GitHub Container Registry
- **Monitoring**: Health checks, Logs

---

## Performance Characteristics

### Response Times (Target)
- **Homepage**: < 1.5s (first load)
- **API Endpoints**: < 200ms
- **Static Files**: < 50ms (cached)
- **Database Queries**: < 30ms
- **Certificate Generation**: < 2s

### Throughput
- **Concurrent Users**: 1,000+ (single server)
- **Requests/Second**: 100+ (with caching)
- **Database Connections**: 20 (pooled)

### Resource Usage
- **Backend**: ~500MB RAM, 10-30% CPU
- **Frontend**: ~300MB RAM, 5-15% CPU
- **PostgreSQL**: ~200MB RAM, 5-10% CPU
- **Redis**: ~50MB RAM, < 5% CPU
- **Nginx**: ~50MB RAM, < 5% CPU

---

## Network Topology

```
Internet
    │
    ├─ Port 80 (HTTP) ──┐
    └─ Port 443 (HTTPS) ┴──► Nginx
                              │
                              ├──► Static Files (direct)
                              ├──► Media Files (direct)
                              │
           Internal Network   │
           ┌──────────────────┼──────────────────┐
           │                  │                  │
           │         ┌────────┴────────┐         │
           │         │   Backend       │         │
           │         │   (Django)      │         │
           │         └────────┬────────┘         │
           │                  │                  │
           │         ┌────────┴────────┐         │
           │         │   Frontend      │         │
           │         │   (Next.js)     │         │
           │         └─────────────────┘         │
           │                                     │
           │         ┌─────────────────┐         │
           │         │   PostgreSQL    │         │
           │         │   (Port 5432)   │         │
           │         └─────────────────┘         │
           │                                     │
           │         ┌─────────────────┐         │
           │         │     Redis       │         │
           │         │   (Port 6379)   │         │
           │         └─────────────────┘         │
           └─────────────────────────────────────┘
```

---

**For implementation details, see:**
- [Deployment Guide](DEPLOYMENT_GUIDE.md)
- [Production Checklist](PRODUCTION_CHECKLIST.md)
- [Quick Start](QUICK_START.md)

---

*Last Updated: January 2025*


