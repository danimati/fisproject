# Maritime Gateway API

A secure gateway service for the Maritime Trade Management System that provides authentication, rate limiting, monitoring, and request proxying to the main backend API.

## Features

### Security
- **JWT Authentication**: Secure token-based authentication with refresh tokens
- **Rate Limiting**: Prevent DoS attacks with configurable rate limits
- **IP Logging**: Track and hash IP addresses for privacy
- **Password Encryption**: Bcrypt hashing for user passwords
- **Data Encryption**: Encrypt sensitive user data (name, phone, address)
- **Token Blacklisting**: Secure logout with token invalidation

### Monitoring & Logging
- **Comprehensive Audit Trail**: Log all requests with user and IP details
- **Performance Monitoring**: Track response times and endpoint usage
- **Security Events**: Detect and log blocked requests and failed logins
- **Admin Dashboard**: View statistics and manage security settings

### Proxy Features
- **Request Forwarding**: Proxy all API requests to main backend
- **Header Management**: Handle authentication and security headers
- **Error Handling**: Graceful handling of backend unavailability
- **Response Timing**: Monitor backend performance

## Architecture

```
Frontend → Gateway (Port 8080) → Backend API (Port 8000)
                ↓
        Gateway Database (PostgreSQL:5432)
                ↓
                Redis (Port 6380)
```

## Database Schema

### Users Table
- `id`, `username`, `email`, `password_hash`
- `is_active`, `is_admin`
- Encrypted fields: `full_name`, `phone`, `address`

### UserSessions Table
- Track active user sessions
- Store token hashes and expiration
- Log IP addresses and user agents

### AuditLog Table
- Comprehensive request logging
- Track response times and status codes
- Security event categorization

### RateLimit Table
- IP-based rate limiting
- DoS detection and blocking
- Configurable time windows

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user info

### Proxy (All backend endpoints)
- `GET /api/v1/*` - Proxy GET requests
- `POST /api/v1/*` - Proxy POST requests
- `PUT /api/v1/*` - Proxy PUT requests
- `DELETE /api/v1/*` - Proxy DELETE requests

### Admin
- `GET /admin/stats` - Administrative statistics
- `GET /admin/users` - List all users
- `GET /admin/audit/logs` - View audit logs
- `GET /admin/security/blocked-ips` - View blocked IPs
- `POST /admin/security/unblock-ip/{ip}` - Unblock IP

### Health
- `GET /health` - Service health check
- `GET /api/v1/health` - Gateway + backend health

## Configuration

### Environment Variables
```bash
# Database
DATABASE_URL=postgresql://felatiko:felatiko@localhost:5432/felatiko

# Backend
BACKEND_URL=http://localhost:8000

# Redis
REDIS_URL=redis://localhost:6379/0

# Security
SECRET_KEY=your-secret-key
ENCRYPTION_KEY=32-character-encryption-key

# Rate Limiting
RATE_LIMIT_PER_MINUTE=100
RATE_LIMIT_PER_HOUR=1000
DOS_THRESHOLD=500
```

## Docker Setup

### Using Gateway Compose
```bash
# Start all services with gateway
docker-compose -f docker-compose.gateway.yml up -d

# View logs
docker-compose -f docker-compose.gateway.yml logs -f gateway

# Stop services
docker-compose -f docker-compose.gateway.yml down
```

### Database Access
- **Gateway Database**: `localhost:5432` (felatiko/felatiko/felatiko)
- **Main Database**: `localhost:5433` (postgres/postgres/maritime_db)

### Service URLs
- **Gateway API**: http://localhost:8080
- **Backend API**: http://localhost:8080/api/v1/* (proxied)
- **Gateway Docs**: http://localhost:8080/docs
- **Admin Panel**: http://localhost:8080/admin

## Security Features

### Rate Limiting
- **Per IP**: 100 requests/minute, 1000/hour
- **DoS Protection**: Auto-block at 500 requests/minute
- **User-based**: Separate limits for authenticated users
- **Redis Storage**: High-performance rate limiting

### Authentication
- **JWT Tokens**: 30-minute access tokens
- **Refresh Tokens**: 7-day refresh tokens
- **Token Blacklist**: Secure logout with Redis
- **Session Tracking**: Monitor active sessions

### Data Protection
- **Password Hashing**: Bcrypt with salt
- **Field Encryption**: Encrypt sensitive user data
- **IP Hashing**: Privacy-preserving IP tracking
- **Audit Logging**: Comprehensive security audit trail

## Development

### Local Development
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Set up database
createdb felatiko
alembic upgrade head

# Run gateway
uvicorn app.main:app --reload --host 0.0.0.0 --port 8080
```

### Database Migrations
```bash
# Create new migration
alembic revision --autogenerate -m "Description"

# Apply migrations
alembic upgrade head

# Rollback migration
alembic downgrade -1
```

## Monitoring

### Health Checks
- Gateway health: `GET /health`
- Backend health: `GET /api/v1/health`
- Database connectivity
- Redis connectivity

### Performance Metrics
- Response time tracking
- Request volume monitoring
- Error rate analysis
- Endpoint usage statistics

### Security Monitoring
- Failed login attempts
- Blocked requests
- Suspicious activity detection
- IP blocking/unblocking

## Production Deployment

### Security Considerations
- Change default secrets and keys
- Use HTTPS in production
- Configure proper CORS origins
- Set up log rotation
- Monitor security events

### Performance Optimization
- Use Redis cluster for rate limiting
- Implement database connection pooling
- Configure load balancing
- Set up monitoring and alerting

## Troubleshooting

### Common Issues
1. **Database Connection**: Check DATABASE_URL and PostgreSQL status
2. **Redis Connection**: Verify Redis is running and accessible
3. **Backend Proxy**: Ensure backend API is accessible from gateway
4. **Rate Limiting**: Check Redis storage and configuration

### Logs
```bash
# Gateway logs
docker-compose -f docker-compose.gateway.yml logs gateway

# Database logs
docker-compose -f docker-compose.gateway.yml logs gateway_db

# Redis logs
docker-compose -f docker-compose.gateway.yml logs gateway_redis
```

## License

This project is part of the Maritime Trade Management System.
