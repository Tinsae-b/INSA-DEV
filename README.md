# INSA Year-Book 📚

A comprehensive digital yearbook system for the Ethiopian Information Network Security Agency (INSA) Cyber Talent program, featuring automatic certificate generation, student profiles, and interactive memories.

## 🌟 Features

- **📄 Automatic Certificate Generation**: Generates professional certificates for graduates using PIL/Pillow
- **👥 Student Profiles**: Comprehensive student information with photos and quotes
- **🏛️ Department Management**: Organized by cybersecurity specializations
- **📸 Memory Board**: Interactive photo sharing and memories
- **🎓 Certificate Verification**: Unique verification links for each certificate
- **📱 Responsive Design**: Modern UI built with Next.js and Tailwind CSS
- **🔧 Django REST API**: Robust backend with Django and DRF

## 🏗️ Architecture

### Backend (Django)
- **Framework**: Django 5.2.2 with Django REST Framework
- **Database**: SQLite (development) / PostgreSQL (production ready)
- **Certificate Generation**: PIL/Pillow with custom template system
- **API**: RESTful API with pagination and filtering

### Frontend (Next.js)
- **Framework**: Next.js 15.2.4 with React
- **Styling**: Tailwind CSS with custom components
- **UI Components**: Shadcn/ui component library
- **State Management**: React hooks and context

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm or yarn

### Backend Setup (Django)

1. **Navigate to Django project**:
   ```bash
   cd astu_yearbook
   ```

2. **Create and activate virtual environment**:
   ```bash
   python -m venv astu_env
   
   # Windows
   astu_env\Scripts\activate
   
   # macOS/Linux
   source astu_env/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run migrations**:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Create superuser**:
   ```bash
   python manage.py createsuperuser
   ```

6. **Start Django server**:
   ```bash
   python manage.py runserver 8085
   ```

### Frontend Setup (Next.js)

1. **Navigate to frontend**:
   ```bash
   cd astu_front
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8085/yearbook/api/
   - Admin Panel: http://localhost:8085/admin/

## 📁 Project Structure

```
Year-Book/
├── astu_yearbook/          # Django Backend
│   ├── astu_yearbook/      # Django settings and configuration
│   ├── yearbook/           # Main app with models, views, serializers
│   ├── media/              # Media files (certificates, photos)
│   ├── db.sqlite3         # Database (development)
│   └── manage.py          # Django management script
├── astu_front/            # Next.js Frontend
│   ├── app/               # Next.js app directory
│   ├── components/        # React components
│   ├── lib/              # Utility functions and API client
│   └── public/           # Static assets
└── README.md
```

## 🎨 Certificate Generation

The system automatically generates professional certificates for students:

### Features
- **Template-based**: Uses `insa_summercamp_certeficate.png` as base template
- **Automatic Generation**: Certificates created when students are added
- **Custom Positioning**: Names and verification links positioned precisely
- **Font Fallbacks**: Robust font handling with system fallbacks
- **Unique URLs**: Each certificate has a unique verification link

### Certificate Structure
- **Student Name**: Centered at position (x, 1070)
- **Verification Link**: Positioned at (x, 2100)
- **Fonts**: Arial 150pt for names, 50pt for links
- **Output**: PNG format in `media/certificates/generated/`

## 🔧 API Endpoints

### Students
- `GET /yearbook/api/students/` - List all students
- `GET /yearbook/api/students/{id}/` - Get student details
- `GET /yearbook/api/students/{id}/certificate/` - Download certificate

### Departments
- `GET /yearbook/api/departments/` - List departments
- `GET /yearbook/api/departments/{id}/` - Get department details

### Memory Board
- `GET /yearbook/api/memories/` - List memories
- `POST /yearbook/api/memories/` - Create memory

## 🛠️ Development

### Adding New Students
1. Access Django admin: http://localhost:8085/admin/
2. Navigate to Students section
3. Add student with required fields
4. Certificate automatically generates

### Customizing Certificates
1. Replace `insa_summercamp_certeficate.png` with your template
2. Adjust positioning in `yearbook/models.py` `get_certificate_url()` method
3. Modify font sizes and colors as needed

### Frontend Customization
1. Edit components in `astu_front/components/`
2. Update styles in `astu_front/styles/`
3. Modify API calls in `astu_front/lib/api.ts`

## 📦 Dependencies

### Backend
- Django 5.2.2
- Django REST Framework
- Pillow (PIL) for image processing
- django-cors-headers
- django-filter

### Frontend
- Next.js 15.2.4
- React 18
- Tailwind CSS
- Shadcn/ui components
- Lucide React icons

## 🚀 Deployment

### Quick Start

**Development:**
```bash
docker-compose -f docker-compose.dev.yml up -d
```

**Production:**
```bash
# See QUICK_START.md for detailed instructions
./scripts/deploy.sh production
```

### Complete Documentation

- **📘 Quick Start Guide**: [QUICK_START.md](QUICK_START.md) - Get started in 5 minutes
- **📗 Deployment Guide**: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Complete production setup
- **📋 Production Checklist**: [PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md) - Pre-launch verification
- **🔒 Security Guide**: [astu_yearbook/SECURITY_CHECKLIST.md](astu_yearbook/SECURITY_CHECKLIST.md) - Security best practices

### Docker Deployment

Full Docker setup with:
- ✅ Multi-stage builds for optimization
- ✅ PostgreSQL database
- ✅ Redis caching
- ✅ Nginx reverse proxy
- ✅ SSL/HTTPS support
- ✅ Health checks
- ✅ Automatic backups
- ✅ CI/CD pipelines

### Production Features

- **Security**: SSL/HTTPS, rate limiting, CSRF protection, secure headers
- **Performance**: Static file compression, caching, optimized builds
- **Monitoring**: Health check endpoints, logging, error tracking
- **Scalability**: Horizontal scaling ready, load balancing support
- **Maintenance**: Automated backups, easy rollbacks, zero-downtime deploys

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

- **Development**: INSA Cyber Talent Team
- **Design**: INSA Design Team
- **Project Lead**: [Your Name]

## 📞 Support

For support and questions:
- Email: support@insa.gov.et
- Documentation: [Link to detailed docs]
- Issues: [GitHub Issues Link]

## 🎯 Roadmap

- [ ] Multi-language support
- [ ] Advanced certificate templates
- [ ] Student portal integration
- [ ] Mobile app development
- [ ] Advanced analytics dashboard

---

**Made with ❤️ for INSA Cyber Talent Program**