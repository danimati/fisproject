# Maritime Gateway Deployment Guide

## Overview

This guide covers the complete deployment of the Maritime Gateway API with its security features, monitoring, and proxy functionality.

## Architecture

```
Frontend → Gateway (8080) → Backend API (8000)
                ↓
        PostgreSQL (5432) + Redis (6380)
```

## Prerequisites

- Docker & Docker Compose
- PostgreSQL (for local development)
- Redis (for local development)
- Python 3.12+ (for local development)

## Quick Start (Docker)

### 1. Using Gateway Compose (Recommended)

```bash
# Start all services
docker-compose -f docker-compose.gateway.yml up -d

# View logs
docker-compose -f docker-compose.gateway.yml logs -f gateway

# Stop services
docker-compose -f docker-compose.gateway.yml down
```

### 2. Service URLs

- **Gateway API**: http://localhost:8080
- **Gateway Docs**: http://localhost:8080/docs
- **Admin Panel**: http://localhost:8080/admin
- **Backend API**: http://localhost:8080/api/v1/* (proxied)

### 3. Database Access

- **Gateway Database**: `localhost:5433` (felatiko/felatiko/felatiko)
- **Main Database**: `localhost:5432` (postgres/postgres/maritime_db)
- **Gateway Redis**: `localhost:6380`
- **Main Redis**: `localhost:6379`

## Local Development

### 1. Environment Setup

```bash
# Clone and navigate
cd gateway

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt
```

### 2. Database Setup

```bash
# Create PostgreSQL database
createdb felatiko

# Run setup script
python setup_database.py
```

### 3. Start Services

```bash
# Terminal 1: Start Redis
redis-server --port 6380

# Terminal 2: Start Gateway
uvicorn app.main:app --host 0.0.0.0 --port 8080 --reload

# Terminal 3: Start Backend (in main directory)
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## Configuration

### Environment Variables

Create `.env` file in gateway directory:

```bash
# Database
DATABASE_URL=postgresql://felatiko:felatiko@localhost:5432/felatiko

# Backend
BACKEND_URL=http://localhost:8000

# Redis
REDIS_URL=redis://localhost:6380/0

# Security (CHANGE IN PRODUCTION!)
SECRET_KEY=your-super-secret-key-change-in-production
ENCRYPTION_KEY=32-character-encryption-key-here

# Rate Limiting
RATE_LIMIT_PER_MINUTE=100
RATE_LIMIT_PER_HOUR=1000
DOS_THRESHOLD=500

# CORS
ALLOWED_ORIGINS=["http://localhost:3000", "http://localhost:8080"]

# Logging
LOG_LEVEL=INFO
DEBUG=false
```

## Security Configuration

### 1. Production Secrets

```bash
# Generate secure secret key
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Generate encryption key (32 characters)
python -c "import secrets; print(secrets.token_urlsafe(32))[:32]"
```

### 2. Rate Limiting

- **Per IP**: 100 requests/minute, 1000/hour
- **DoS Protection**: Auto-block at 500 requests/minute
- **User Limits**: Separate limits for authenticated users
- **Redis Storage**: High-performance rate limiting

### 3. Authentication

- **JWT Access Tokens**: 30 minutes expiration
- **Refresh Tokens**: 7 days expiration
- **Token Blacklisting**: Secure logout with Redis
- **Password Hashing**: Bcrypt with salt

## Monitoring & Logging

### 1. Health Checks

```bash
# Gateway health
curl http://localhost:8080/health

# Backend health (via gateway)
curl http://localhost:8080/api/v1/health

# Admin stats (requires auth)
curl -H "Authorization: Bearer <token>" \
     http://localhost:8080/admin/stats
```

### 2. Logs

```bash
# Docker logs
docker-compose -f docker-compose.gateway.yml logs gateway

# Application logs
tail -f logs/gateway.log
```

### 3. Performance Monitoring

Access admin dashboard at http://localhost:8080/admin/stats for:
- Request statistics
- Performance metrics
- Security events
- User activity

## Testing

### 1. Automated Tests

```bash
# Run gateway tests
cd gateway
python test_gateway.py

# Run with specific backend
BACKEND_URL=http://localhost:8000 python test_gateway.py
```

### 2. Manual Testing

```bash
# Register user
curl -X POST http://localhost:8080/auth/register \
     -H "Content-Type: application/json" \
     -d '{"username":"testuser","email":"test@example.com","password":"testpass123"}'

# Login
curl -X POST http://localhost:8080/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"testuser","password":"testpass123"}'

# Access protected endpoint
curl -H "Authorization: Bearer <token>" \
     http://localhost:8080/auth/me

# Proxy to backend
curl -H "Authorization: Bearer <token>" \
     http://localhost:8080/api/v1/vessels
```

## Production Deployment

### 1. Security Hardening

```bash
# Update secrets
export SECRET_KEY="$(python -c 'import secrets; print(secrets.token_urlsafe(32))')"
export ENCRYPTION_KEY="$(python -c 'import secrets; print(secrets.token_urlsafe(32))[:32]')"

# Set production environment
export DEBUG=false
export LOG_LEVEL=WARNING
export ENVIRONMENT=production
```

### 2. SSL/TLS Configuration

```nginx
# Nginx configuration example
server {
    listen 443 ssl;
    server_name your-domain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 3. Database Security

```bash
# Create dedicated database user
CREATE USER gateway_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE felatiko TO gateway_user;

# Enable SSL connections
# in postgresql.conf: ssl = on
```

### 4. Redis Security

```bash
# Require password
# in redis.conf: requirepass your_redis_password

# Disable dangerous commands
# in redis.conf: rename-command FLUSHDB ""
rename-command FLUSHALL ""
```

## Scaling

### 1. Horizontal Scaling

```yaml
# docker-compose.scale.yml
services:
  gateway:
    deploy:
      replicas: 3
    # ... other config
  
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
```

### 2. Database Scaling

- **Read Replicas**: For read-heavy workloads
- **Connection Pooling**: PgBouncer for connection management
- **Redis Cluster**: For high-availability rate limiting

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   ```bash
   # Check PostgreSQL status
   pg_isready -h localhost -p 5432 -U felatiko
   
   # Check connection string
   psql postgresql://felatiko:felatiko@localhost:5432/felatiko
   ```

2. **Redis Connection Failed**
   ```bash
   # Check Redis status
   redis-cli -p 6380 ping
   
   # Check connection
   redis-cli -p 6380 -h localhost
   ```

3. **Backend Proxy Failed**
   ```bash
   # Check backend health
   curl http://localhost:8000/health
   
   # Check network connectivity
   docker network ls
   docker network inspect maritime_network
   ```

4. **Rate Limiting Issues**
   ```bash
   # Check Redis rate limits
   redis-cli -p 6380 keys "rate_limit:*"
   
   # Clear rate limits
   redis-cli -p 6380 flushdb
   ```

### Performance Optimization

1. **Database Optimization**
   ```sql
   -- Add indexes for performance
   CREATE INDEX CONCURRENTLY idx_audit_logs_created_at 
   ON audit_logs(created_at DESC);
   
   -- Analyze tables
   ANALYZE audit_logs;
   ```

2. **Redis Optimization**
   ```bash
   # Monitor Redis memory
   redis-cli -p 6380 info memory
   
   # Set expiration policies
   redis-cli -p 6380 config set maxmemory 256mb
   redis-cli -p 6380 config set maxmemory-policy allkeys-lru
   ```

## Maintenance

### 1. Database Maintenance

```bash
# Backup database
pg_dump felatiko > backup_$(date +%Y%m%d).sql

# Clean old audit logs (keep 30 days)
psql felatiko -c "DELETE FROM audit_logs WHERE created_at < NOW() - INTERVAL '30 days';"
```

### 2. Log Rotation

```bash
# Configure logrotate
cat > /etc/logrotate.d/gateway << EOF
/var/log/gateway/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 644 gateway gateway
}
EOF
```

### 3. Health Monitoring

```bash
# Health check script
#!/bin/bash
GATEWAY_HEALTH=$(curl -s http://localhost:8080/health | jq -r '.status')
if [ "$GATEWAY_HEALTH" != "healthy" ]; then
    echo "Gateway unhealthy: $GATEWAY_HEALTH"
    # Send alert
fi
```

## Support

For issues and questions:
1. Check logs: `docker-compose logs gateway`
2. Verify configuration: Environment variables and network connectivity
3. Test components individually: Database, Redis, Backend
4. Review this guide for common solutions

## Security Checklist

- [ ] Change default secrets and keys
- [ ] Enable HTTPS in production
- [ ] Configure proper CORS origins
- [ ] Set up log rotation
- [ ] Enable database backups
- [ ] Configure monitoring and alerting
- [ ] Review rate limiting settings
- [ ] Test security features
- [ ] Document emergency procedures
