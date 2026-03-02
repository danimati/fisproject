# Quick Start Guide for Maritime Gateway

## 🚀 Local Development Setup

Since Docker seems to have issues, let's set up the gateway locally for immediate testing.

### Step 1: Install Dependencies

```bash
cd gateway
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Step 2: Set Up Database

```bash
# Start PostgreSQL (if not running)
sudo systemctl start postgresql

# Create database
sudo -u postgres createdb felatiko

# Create user (if needed)
sudo -u postgres psql -c "CREATE USER felatiko WITH PASSWORD 'felatiko';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE felatiko TO felatiko;"
```

### Step 3: Set Up Redis

```bash
# Start Redis (if not running)
redis-server --port 6379 --daemonize yes

# Or install and start
sudo dnf install redis  # Fedora
sudo systemctl start redis
```

### Step 4: Initialize Gateway Database

```bash
# Create PostgreSQL database (port 5433)
createdb felatiko

cd gateway
python setup_database.py
```

### Step 5: Start Gateway

```bash
cd gateway
uvicorn app.main:app --host 0.0.0.0 --port 8080 --reload
```

### Step 6: Test Gateway

```bash
# In another terminal, test the gateway
python test_gateway.py
```

## 🌐 Access Points

Once running, you can access:

- **Gateway API**: http://localhost:8080
- **API Documentation**: http://localhost:8080/docs
- **Health Check**: http://localhost:8080/health
- **Admin Panel**: http://localhost:8080/admin/stats

## 🔑 Default Credentials

- **Username**: admin
- **Password**: admin123

## 🧪 Testing

```bash
# Test basic functionality
curl http://localhost:8080/health

# Test registration
curl -X POST http://localhost:8080/auth/register \
     -H "Content-Type: application/json" \
     -d '{"username":"testuser","email":"test@example.com","password":"testpass123"}'

# Test login
curl -X POST http://localhost:8080/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"testuser","password":"testpass123"}'
```

## 🔧 Troubleshooting

### Database Issues

```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Connect to database (port 5433)
psql -h localhost -p 5433 -U felatiko -d felatiko

# Reset database
sudo -u postgres dropdb felatiko
sudo -u postgres createdb felatiko
python setup_database.py
```

### Redis Issues

```bash
# Check Redis status
redis-cli ping

# Test Redis connection
redis-cli -h localhost -p 6379 ping
```

### Port Conflicts

```bash
# Check what's using port 8080
sudo netstat -tlnp | grep :8080

# Kill process if needed
sudo kill -9 <PID>
```

## 🐳 Docker Alternative

If you prefer Docker, try this simplified approach:

```bash
# Build only the gateway
cd gateway
docker build -t maritime-gateway .

# Run with local database connection
docker run -d \
  --name maritime-gateway \
  -p 8080:8080 \
  -e DATABASE_URL=postgresql://felatiko:felatiko@host.docker.internal:5432/felatiko \
  -e REDIS_URL=redis://host.docker.internal:6379/0 \
  -e BACKEND_URL=http://host.docker.internal:8000 \
  maritime-gateway
```

## 📝 Next Steps

1. ✅ Get gateway running locally
2. ✅ Test authentication endpoints
3. ✅ Verify proxy functionality to backend
4. ✅ Test rate limiting and security features
5. ✅ Review admin dashboard and monitoring

## 🎯 Success Criteria

- [ ] Gateway starts without errors
- [ ] Database tables are created
- [ ] Admin user can log in
- [ ] New users can register
- [ ] API proxy works to backend
- [ ] Rate limiting is active
- [ ] Audit logs are being created

Once you have the gateway running locally, you can then work on the Docker deployment or integrate it with your existing backend setup.
