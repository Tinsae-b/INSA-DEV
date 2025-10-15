# Makefile for INSA Year-Book Project
# Provides convenient shortcuts for common tasks

.PHONY: help dev-up dev-down prod-up prod-down build clean logs backup restore test

# Default target
help:
	@echo "INSA Year-Book - Available Commands"
	@echo "===================================="
	@echo ""
	@echo "Development:"
	@echo "  make dev-up          - Start development environment"
	@echo "  make dev-down        - Stop development environment"
	@echo "  make dev-logs        - View development logs"
	@echo ""
	@echo "Production:"
	@echo "  make prod-up         - Start production environment"
	@echo "  make prod-down       - Stop production environment"
	@echo "  make prod-logs       - View production logs"
	@echo "  make deploy          - Full production deployment"
	@echo ""
	@echo "Database:"
	@echo "  make migrate         - Run database migrations"
	@echo "  make migrations      - Create new migrations"
	@echo "  make superuser       - Create Django superuser"
	@echo "  make dbshell         - Open database shell"
	@echo ""
	@echo "Maintenance:"
	@echo "  make backup          - Create backup"
	@echo "  make restore DATE=   - Restore from backup (specify DATE)"
	@echo "  make clean           - Clean up Docker resources"
	@echo "  make logs            - View all logs"
	@echo ""
	@echo "Building:"
	@echo "  make build           - Build Docker images"
	@echo "  make rebuild         - Rebuild images from scratch"
	@echo ""
	@echo "Testing:"
	@echo "  make test            - Run all tests"
	@echo "  make test-backend    - Run backend tests"
	@echo "  make test-frontend   - Run frontend tests"
	@echo "  make lint            - Run linters"
	@echo ""
	@echo "Security:"
	@echo "  make security-check  - Run Django security check"
	@echo "  make security-scan   - Scan for vulnerabilities"
	@echo ""

# Development
dev-up:
	@echo "Starting development environment..."
	docker compose -f docker-compose.dev.yml up -d
	@echo "Development environment is running!"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend: http://localhost:8000"

dev-down:
	@echo "Stopping development environment..."
	docker compose -f docker-compose.dev.yml down

dev-logs:
	docker compose -f docker-compose.dev.yml logs -f

# Production
prod-up:
	@echo "Starting production environment..."
	docker compose up -d
	@echo "Production environment is running!"

prod-down:
	@echo "Stopping production environment..."
	docker compose down

prod-logs:
	docker compose logs -f

deploy:
	@echo "Deploying to production..."
	chmod +x scripts/deploy.sh
	./scripts/deploy.sh production

# Database
migrate:
	@echo "Running database migrations..."
	docker compose exec backend python manage.py migrate

migrations:
	@echo "Creating new migrations..."
	docker compose exec backend python manage.py makemigrations

superuser:
	@echo "Creating superuser..."
	docker compose exec backend python manage.py createsuperuser

dbshell:
	@echo "Opening database shell..."
	docker compose exec db psql -U yearbook_user yearbook_db

# Building
build:
	@echo "Building Docker images..."
	docker compose build

rebuild:
	@echo "Rebuilding Docker images from scratch..."
	docker compose build --no-cache

# Maintenance
backup:
	@echo "Creating backup..."
	chmod +x scripts/backup.sh
	./scripts/backup.sh

restore:
	@echo "Restoring from backup..."
	@if [ -z "$(DATE)" ]; then \
		echo "ERROR: Please specify DATE, e.g., make restore DATE=20250113_120000"; \
		exit 1; \
	fi
	chmod +x scripts/restore.sh
	./scripts/restore.sh $(DATE)

clean:
	@echo "Cleaning up Docker resources..."
	docker compose down -v
	docker system prune -f
	@echo "Cleanup complete!"

logs:
	docker compose logs -f

# Testing
test: test-backend test-frontend

test-backend:
	@echo "Running backend tests..."
	docker compose exec backend python manage.py test

test-frontend:
	@echo "Running frontend tests..."
	cd astu_front && npm test

lint:
	@echo "Running linters..."
	docker compose exec backend flake8 .
	cd astu_front && npm run lint

# Security
security-check:
	@echo "Running Django security check..."
	docker compose exec backend python manage.py check --deploy

security-scan:
	@echo "Scanning for vulnerabilities..."
	docker compose exec backend pip install safety
	docker compose exec backend safety check

# Static files
collectstatic:
	@echo "Collecting static files..."
	docker compose exec backend python manage.py collectstatic --noinput

# Django shell
shell:
	@echo "Opening Django shell..."
	docker compose exec backend python manage.py shell

# Status
status:
	@echo "Container Status:"
	docker compose ps
	@echo ""
	@echo "Health Checks:"
	@curl -s http://localhost/health || echo "Health check failed"
	@echo ""
	@curl -s http://localhost/yearbook/api/health/ || echo "API health check failed"

# Install (for first-time setup)
install: build dev-up migrate collectstatic superuser
	@echo ""
	@echo "Installation complete!"
	@echo "Access the application at http://localhost:3000"


