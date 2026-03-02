# Maritime Gateway API Documentation

## Overview

The Maritime Gateway API provides secure access to the Maritime Trade Management System with authentication, rate limiting, monitoring, and request proxying capabilities.

**Base URL**: `http://localhost:8080`
**API Version**: `v1`
**Authentication**: JWT Bearer Token

## Table of Contents

1. [Authentication Endpoints](#authentication-endpoints)
2. [Proxy Endpoints](#proxy-endpoints)
3. [Admin Endpoints](#admin-endpoints)
4. [Health Endpoints](#health-endpoints)
5. [Error Handling](#error-handling)
6. [Rate Limiting](#rate-limiting)
7. [Security Features](#security-features)

---

## Authentication Endpoints

### Register User

**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "username": "string (required, min 3 chars)",
  "email": "string (required, valid email)",
  "password": "string (required, min 6 chars)",
  "full_name": "string (optional)",
  "phone": "string (optional)",
  "address": "string (optional)"
}
```

**Response (201):**
```json
{
  "id": 1,
  "username": "testuser",
  "email": "test@example.com",
  "full_name": "Test User",
  "phone": "+1234567890",
  "address": "123 Main St",
  "is_active": true,
  "is_admin": false,
  "created_at": "2026-03-02T18:00:00Z",
  "updated_at": "2026-03-02T18:00:00Z"
}
```

**Error Responses:**
- `400` - Username or email already exists
- `422` - Validation error

---

### User Login

**POST** `/auth/login`

Authenticate user and receive JWT tokens.

**Request Body:**
```json
{
  "username": "string (required)",
  "password": "string (required)"
}
```

**Response (200):**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer",
  "expires_in": 1800
}
```

**Error Responses:**
- `400` - Invalid credentials
- `401` - Account inactive

---

### Refresh Token

**POST** `/auth/refresh`

Refresh access token using refresh token.

**Request Body:**
```json
{
  "refresh_token": "string (required)"
}
```

**Response (200):**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer",
  "expires_in": 1800
}
```

**Error Responses:**
- `401` - Invalid refresh token

---

### User Logout

**POST** `/auth/logout`

Logout user and blacklist tokens.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "message": "Successfully logged out"
}
```

---

### Get Current User

**GET** `/auth/me`

Get current user information.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "id": 1,
  "username": "testuser",
  "email": "test@example.com",
  "full_name": "Test User",
  "phone": "+1234567890",
  "address": "123 Main St",
  "is_active": true,
  "is_admin": false,
  "created_at": "2026-03-02T18:00:00Z",
  "updated_at": "2026-03-02T18:00:00Z"
}
```

**Error Responses:**
- `401` - Invalid token
- `404` - User not found

---

## Proxy Endpoints

All proxy endpoints forward requests to the main backend API at `http://localhost:8000`. The same authentication token is passed to the backend.

### Vessels

#### Get All Vessels
**GET** `/api/v1/vessels`

Proxy to backend: `GET /api/v1/vessels`

**Headers:**
```
Authorization: Bearer <access_token> (optional)
```

**Response:** Backend response with additional headers:
```
X-Gateway-Process-Time: 0.045
X-Backend-Response-Time: 0.032
```

#### Create Vessel
**POST** `/api/v1/vessels`

Proxy to backend: `POST /api/v1/vessels`

**Request Body:** Backend vessel data
**Headers:** Same as backend + Authorization

#### Get Vessel by ID
**GET** `/api/v1/vessels/{vessel_id}`

Proxy to backend: `GET /api/v1/vessels/{vessel_id}`

#### Update Vessel
**PUT** `/api/v1/vessels/{vessel_id}`

Proxy to backend: `PUT /api/v1/vessels/{vessel_id}`

#### Delete Vessel
**DELETE** `/api/v1/vessels/{vessel_id}`

Proxy to backend: `DELETE /api/v1/vessels/{vessel_id}`

---

### Shipments

#### Get All Shipments
**GET** `/api/v1/shipments`

#### Create Shipment
**POST** `/api/v1/shipments`

#### Get Shipment by ID
**GET** `/api/v1/shipments/{shipment_id}`

#### Update Shipment
**PUT** `/api/v1/shipments/{shipment_id}`

#### Delete Shipment
**DELETE** `/api/v1/shipments/{shipment_id}`

---

### Containers

#### Get All Containers
**GET** `/api/v1/containers`

#### Create Container
**POST** `/api/v1/containers`

#### Get Container by ID
**GET** `/api/v1/containers/{container_id}`

#### Update Container
**PUT** `/api/v1/containers/{container_id}`

#### Delete Container
**DELETE** `/api/v1/containers/{container_id}`

---

### Cargo

#### Get All Cargo
**GET** `/api/v1/cargo`

#### Create Cargo
**POST** `/api/v1/cargo`

#### Get Cargo by ID
**GET** `/api/v1/cargo/{cargo_id}`

#### Update Cargo
**PUT** `/api/v1/cargo/{cargo_id}`

#### Delete Cargo
**DELETE** `/api/v1/cargo/{cargo_id}`

---

### Clients

#### Get All Clients
**GET** `/api/v1/clients`

#### Create Client
**POST** `/api/v1/clients`

#### Get Client by ID
**GET** `/api/v1/clients/{client_id}`

#### Update Client
**PUT** `/api/v1/clients/{client_id}`

#### Delete Client
**DELETE** `/api/v1/clients/{client_id}`

---

## Admin Endpoints

All admin endpoints require admin privileges and authentication.

### Get Admin Statistics

**GET** `/admin/stats`

Get comprehensive administrative statistics.

**Headers:**
```
Authorization: Bearer <admin_access_token>
```

**Response (200):**
```json
{
  "users": {
    "total": 150,
    "active": 142,
    "admin": 3
  },
  "sessions": {
    "active": 25
  },
  "activity": {
    "requests_24h": 1250,
    "blocked_24h": 15,
    "failed_logins_24h": 8
  },
  "security": {
    "currently_blocked": 5
  }
}
```

---

### Get All Users

**GET** `/admin/users`

Get list of all users (admin only).

**Response (200):**
```json
[
  {
    "id": 1,
    "username": "admin",
    "email": "admin@maritime.com",
    "full_name": "System Administrator",
    "is_active": true,
    "is_admin": true,
    "created_at": "2026-03-02T18:00:00Z",
    "updated_at": "2026-03-02T18:00:00Z"
  }
]
```

---

### Get User Sessions

**GET** `/admin/users/{user_id}/sessions`

Get session history for a specific user.

**Response (200):**
```json
[
  {
    "id": 1,
    "created_at": "2026-03-02T18:00:00Z",
    "expires_at": "2026-03-02T18:30:00Z",
    "is_active": "active",
    "ip_address": "a1b2c3d4e5f6g7h",
    "user_agent": "Mozilla/5.0..."
  }
]
```

---

### Get Audit Logs

**GET** `/admin/audit/logs`

Get audit logs with pagination and filtering.

**Query Parameters:**
- `limit` (int, default: 100) - Number of logs to return
- `offset` (int, default: 0) - Pagination offset
- `event_type` (string, optional) - Filter by event type

**Response (200):**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "ip_address": "a1b2c3d4e5f6g7h",
    "endpoint": "/api/v1/vessels",
    "method": "GET",
    "status_code": 200,
    "response_time": 45.5,
    "event_type": "access",
    "created_at": "2026-03-02T18:00:00Z",
    "details": {
      "query_params": {},
      "response_headers": {},
      "process_time_ms": 45.5
    }
  }
]
```

---

### Get Blocked IPs

**GET** `/admin/security/blocked-ips`

Get currently blocked IP addresses.

**Response (200):**
```json
[
  {
    "ip_address": "a1b2c3d4e5f6g7h",
    "request_count": 550,
    "block_expires": "2026-03-02T19:00:00Z",
    "window_size": 60
  }
]
```

---

### Unblock IP

**POST** `/admin/security/unblock-ip/{ip_hash}`

Unblock a previously blocked IP address.

**Response (200):**
```json
{
  "message": "IP address unblocked successfully"
}
```

---

### Delete User

**DELETE** `/admin/users/{user_id}`

Soft delete (deactivate) a user account.

**Response (200):**
```json
{
  "message": "User deactivated successfully"
}
```

---

### Activate User

**POST** `/admin/users/{user_id}/activate`

Reactivate a deactivated user account.

**Response (200):**
```json
{
  "message": "User activated successfully"
}
```

---

### Get Performance Metrics

**GET** `/admin/performance/metrics`

Get performance and usage metrics.

**Response (200):**
```json
{
  "avg_response_time_ms": 45.2,
  "status_distribution": [
    {"status_code": 200, "count": 850},
    {"status_code": 404, "count": 25},
    {"status_code": 500, "count": 5}
  ],
  "top_endpoints": [
    {"endpoint": "/api/v1/vessels", "count": 320},
    {"endpoint": "/api/v1/shipments", "count": 280},
    {"endpoint": "/api/v1/containers", "count": 150}
  ]
}
```

---

## Health Endpoints

### Gateway Health Check

**GET** `/health`

Basic gateway health check.

**Response (200):**
```json
{
  "status": "healthy",
  "service": "gateway",
  "version": "1.0.0",
  "timestamp": 1677785600.0
}
```

---

### Full System Health

**GET** `/api/v1/health`

Check health of gateway and backend.

**Response (200):**
```json
{
  "status": "healthy",
  "gateway": "running",
  "backend": "healthy",
  "timestamp": 1677785600.0
}
```

**Response (503):**
```json
{
  "status": "degraded",
  "gateway": "running",
  "backend": "unhealthy",
  "timestamp": 1677785600.0
}
```

---

## Error Handling

### Standard Error Response Format

```json
{
  "error": "Error type",
  "message": "Human readable error message",
  "type": "ExceptionName",
  "details": {}
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `429` - Rate Limit Exceeded
- `500` - Internal Server Error
- `502` - Bad Gateway (backend unavailable)
- `503` - Service Unavailable
- `504` - Gateway Timeout

### Rate Limit Error (429)

```json
{
  "error": "Rate limit exceeded",
  "message": "Too many requests",
  "type": "RateLimitExceeded"
}
```

---

## Rate Limiting

### Limits

- **Anonymous Users**: 100 requests/minute, 1000 requests/hour
- **Authenticated Users**: Same limits + additional buffer
- **DoS Protection**: Auto-block at 500 requests/minute

### Headers

Rate limiting information is included in response headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 85
X-RateLimit-Reset: 1677785660
```

### Blocking

When rate limits are exceeded:

1. **Warning**: At 80% of limit
2. **Temporary Block**: 1 hour for first offense
3. **Extended Block**: 24 hours for repeated offenses

---

## Security Features

### Authentication

- **JWT Access Tokens**: 30 minutes expiration
- **Refresh Tokens**: 7 days expiration
- **Token Blacklisting**: Secure logout with Redis
- **Session Tracking**: Monitor active sessions

### Data Protection

- **Password Hashing**: Bcrypt with salt
- **Field Encryption**: Sensitive data encrypted at rest
- **IP Hashing**: Privacy-preserving IP tracking
- **Audit Logging**: Comprehensive request logging

### Headers

Security headers are automatically added:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'...
```

---

## SDK Examples

### Python

```python
import httpx
import asyncio

class MaritimeGatewayClient:
    def __init__(self, base_url="http://localhost:8080"):
        self.base_url = base_url
        self.client = httpx.AsyncClient()
        self.token = None
    
    async def login(self, username, password):
        response = await self.client.post(
            f"{self.base_url}/auth/login",
            json={"username": username, "password": password}
        )
        if response.status_code == 200:
            data = response.json()
            self.token = data["access_token"]
            return data
        return None
    
    async def get_vessels(self):
        headers = {"Authorization": f"Bearer {self.token}"}
        response = await self.client.get(
            f"{self.base_url}/api/v1/vessels",
            headers=headers
        )
        return response.json()
    
    async def close(self):
        await self.client.aclose()

# Usage
async def main():
    client = MaritimeGatewayClient()
    
    # Login
    await client.login("admin", "admin123")
    
    # Get vessels
    vessels = await client.get_vessels()
    print(f"Found {len(vessels)} vessels")
    
    await client.close()

asyncio.run(main())
```

### JavaScript

```javascript
class MaritimeGatewayClient {
    constructor(baseUrl = 'http://localhost:8080') {
        this.baseUrl = baseUrl;
        this.token = null;
    }
    
    async login(username, password) {
        const response = await fetch(`${this.baseUrl}/auth/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, password})
        });
        
        if (response.ok) {
            const data = await response.json();
            this.token = data.access_token;
            return data;
        }
        return null;
    }
    
    async getVessels() {
        const response = await fetch(`${this.baseUrl}/api/v1/vessels`, {
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.json();
    }
}

// Usage
const client = new MaritimeGatewayClient();

client.login('admin', 'admin123')
    .then(() => client.getVessels())
    .then(vessels => console.log(`Found ${vessels.length} vessels`));
```

### cURL

```bash
# Login
TOKEN=$(curl -s -X POST http://localhost:8080/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"admin","password":"admin123"}' | \
    jq -r '.access_token')

# Get vessels
curl -X GET http://localhost:8080/api/v1/vessels \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json"

# Create vessel
curl -X POST http://localhost:8080/api/v1/vessels \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "name": "New Vessel",
        "imo_number": "123456789",
        "flag_country": "Panama",
        "vessel_type": "Container Ship",
        "deadweight_tonnage": 50000
    }'
```

---

## OpenAPI Specification

Interactive API documentation is available at:
- **Swagger UI**: http://localhost:8080/docs
- **ReDoc**: http://localhost:8080/redoc

---

## Testing

### Automated Tests

```bash
# Run comprehensive gateway tests
cd gateway
python test_gateway.py
```

### Manual Testing

```bash
# Health check
curl http://localhost:8080/health

# Authentication flow
curl -X POST http://localhost:8080/auth/register \
    -H "Content-Type: application/json" \
    -d '{"username":"testuser","email":"test@example.com","password":"testpass123"}'

curl -X POST http://localhost:8080/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"testuser","password":"testpass123"}'

# Proxy test
curl -H "Authorization: Bearer <token>" \
    http://localhost:8080/api/v1/vessels
```

---

## Support

For issues and questions:
1. Check gateway logs: `docker-compose logs gateway`
2. Verify service status: `curl http://localhost:8080/health`
3. Review authentication tokens
4. Check rate limiting status
5. Consult the troubleshooting section in DEPLOYMENT_GUIDE.md
