# Maritime Trade Management API

A comprehensive maritime trade management system for tracking vessels, containers, cargo, and shipments throughout the international shipping process.

## 🚀 Features

- **Vessel Management**: Track vessel information, capacity, and operational status
- **Container Tracking**: Monitor container locations, status, and cargo assignments
- **Cargo Management**: Complete cargo lifecycle from origin to destination
- **Client Management**: Handle individual and corporate client information
- **Port Operations**: Manage ports, routes, and shipping logistics
- **Personnel Tracking**: Role-based access control for different user types
- **Contract Management**: ERP integration for contracts and budgets
- **Event Logging**: Complete audit trail of all shipping events
- **Real-time Tracking**: Live status updates and notifications
- **RESTful API**: Full CRUD operations with OpenAPI documentation

## 🏗️ Architecture

### Technology Stack

- **Backend**: FastAPI (Python 3.12+)
- **Database**: PostgreSQL with Alembic migrations
- **Authentication**: JWT-based authentication
- **Documentation**: OpenAPI/Swagger auto-generated
- **Testing**: Pytest with 70%+ coverage requirement
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions
- **Code Quality**: Black, isort, flake8, mypy

### Project Structure

```
maritime-trade-management/
├── app/
│   ├── api/                 # API routers and endpoints
│   │   └── v1/             # API version 1
│   ├── core/               # Core configuration and database
│   ├── models/             # SQLAlchemy models
│   ├── schemas/            # Pydantic schemas
│   └── services/           # Business logic layer
├── alembic/                # Database migrations
├── tests/                  # Test suite
├── scripts/                # Utility scripts
├── .github/workflows/      # CI/CD pipelines
├── docker-compose.yml      # Development environment
├── Dockerfile             # Production image
└── requirements.txt       # Python dependencies
```

## 🚀 Quick Start

### Prerequisites

- Python 3.12+
- PostgreSQL 15+
- Docker & Docker Compose (optional)
- Git

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/maritime-trade-management.git
   cd maritime-trade-management
   ```

2. **Set up Python environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Set up database**
   ```bash
   # Create PostgreSQL database
   createdb maritime_db
   
   # Run migrations
   alembic upgrade head
   ```

5. **Start the application**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

6. **Access the API**
   - API Documentation: http://localhost:8000/docs
   - Health Check: http://localhost:8000/api/v1/health

### Docker Development Setup

1. **Using Docker Compose**
   ```bash
   docker-compose up -d
   ```

2. **Run migrations**
   ```bash
   docker-compose exec api alembic upgrade head
   ```

3. **Access the application**
   - API: http://localhost:8000
   - Database: localhost:5432

## 📊 API Documentation

### Base URL
```
http://localhost:8000/api/v1
```

### Main Endpoints

#### Vessels
- `GET /vessels` - List all vessels
- `POST /vessels` - Create new vessel
- `GET /vessels/{id}` - Get vessel by ID
- `PUT /vessels/{id}` - Update vessel
- `DELETE /vessels/{id}` - Delete vessel

#### Containers
- `GET /containers` - List all containers
- `POST /containers` - Create new container
- `GET /containers/{id}` - Get container by ID
- `GET /containers/number/{number}` - Get container by number
- `PUT /containers/{id}` - Update container
- `DELETE /containers/{id}` - Delete container

#### Cargo
- `GET /cargo` - List all cargo
- `POST /cargo` - Create new cargo
- `GET /cargo/{id}` - Get cargo by ID
- `GET /cargo/tracking/{number}` - Get cargo by tracking number
- `PUT /cargo/{id}` - Update cargo
- `DELETE /cargo/{id}` - Delete cargo

#### Clients
- `GET /clients` - List all clients
- `POST /clients` - Create new client
- `GET /clients/{id}` - Get client by ID
- `GET /clients/email/{email}` - Get client by email
- `PUT /clients/{id}` - Update client
- `DELETE /clients/{id}` - Delete client

#### Health Checks
- `GET /health` - Basic health check
- `GET /ready` - Readiness check with database

### Pagination

All list endpoints support pagination:
```
GET /vessels?page=1&size=10
```

Response format:
```json
{
  "items": [...],
  "total": 100,
  "page": 1,
  "size": 10,
  "pages": 10
}
```

### Filtering

Most endpoints support filtering:
```
GET /vessels?status=active&flag_country=Panama
GET /containers?status=empty&container_type=dry_40
```

## 🧪 Testing

### Run All Tests
```bash
pytest
```

### Run Tests with Coverage
```bash
pytest --cov=app --cov-report=term-missing
```

### Run Specific Test File
```bash
pytest tests/test_vessels.py
```

### Run Tests with Verbose Output
```bash
pytest -v
```

### Test Coverage Requirements
- Minimum coverage: 70%
- Target coverage: 85%+

## 🗄️ Database Migrations

### Create New Migration
```bash
alembic revision --autogenerate -m "Description of changes"
```

### Apply Migrations
```bash
alembic upgrade head
```

### Rollback Migration
```bash
alembic downgrade -1
```

### Migration History
```bash
alembic history
```

## 🚢 Production Deployment

### Environment Variables

Required production environment variables:

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname
# or separate variables
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=maritime_db
DB_USER=your-db-user
DB_PASS=your-db-password

# Application
APP_NAME=Maritime Trade Management API
DEBUG=false
ENVIRONMENT=production
SECRET_KEY=your-super-secret-key

# CORS
ALLOWED_ORIGINS=["https://yourdomain.com"]
```

### GitHub Secrets Configuration

Configure these secrets in your GitHub repository:

- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASS`
- `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_SSH_KEY`
- `SECRET_KEY`
- `SLACK_WEBHOOK` (optional, for notifications)

### Deployment Steps

1. **Configure GitHub Secrets**
2. **Push to main branch** - Triggers CI/CD pipeline
3. **Automatic deployment** to production server
4. **Health checks** verify deployment success
5. **Rollback** on failure if needed

### Manual Deployment

```bash
# Build and push Docker image
docker build -t maritime-api:latest .
docker tag maritime-api:latest your-registry/maritime-api:latest
docker push your-registry/maritime-api:latest

# Deploy on server
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d

# Run migrations
docker-compose -f docker-compose.prod.yml exec api alembic upgrade head
```

## 🔧 Development Tools

### Code Formatting
```bash
# Format code
black .
isort .

# Check formatting
black --check .
isort --check-only .
```

### Linting
```bash
flake8 .
mypy app/
```

### Security Scanning
```bash
# Check for vulnerable dependencies
safety check

# Security code analysis
bandit -r app/
```

## 📈 Monitoring & Logging

### Application Logs
- Level: Configurable (DEBUG, INFO, WARNING, ERROR)
- Format: Structured JSON in production
- Location: `/var/log/maritime-api/`

### Health Monitoring
- `/api/v1/health` - Basic health status
- `/api/v1/ready` - Database connectivity check
- Docker health checks included

### Performance Metrics
- Request timing middleware
- Database query optimization
- Response time monitoring

## 🔐 Security

### Authentication
- JWT-based authentication
- Role-based access control
- Token expiration management

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- CORS configuration
- Rate limiting (recommended)

### Security Best Practices
- Regular dependency updates
- Security scanning in CI/CD
- Environment variable management
- Database connection encryption

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- Follow PEP 8 style guide
- Write tests for new features
- Update documentation
- Ensure 70%+ test coverage

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the API documentation at `/docs`
- Review the troubleshooting section below

## 🔍 Troubleshooting

### Common Issues

**Database Connection Errors**
```bash
# Check database URL format
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1;"
```

**Migration Issues**
```bash
# Check current revision
alembic current

# Force migration (use with caution)
alembic stamp head
```

**Docker Issues**
```bash
# Check logs
docker-compose logs api

# Rebuild containers
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

**Test Failures**
```bash
# Clean test cache
pytest --cache-clear

# Run specific failing test
pytest tests/test_vessels.py::TestVessels::test_create_vessel -v
```

## 📊 API Usage Examples

### Create a Vessel
```bash
curl -X POST "http://localhost:8000/api/v1/vessels/" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Evergreen",
    "imo_number": "9337213",
    "flag_country": "Panama",
    "vessel_type": "Container Ship",
    "deadweight_tonnage": 220940,
    "gross_tonnage": 220000,
    "status": "active"
  }'
```

### Track Cargo
```bash
curl "http://localhost:8000/api/v1/cargo/tracking/CARGO123456"
```

### List Active Shipments
```bash
curl "http://localhost:8000/api/v1/shipments?status=in_transit"
```

---

**Built with ❤️ for the maritime industry**
