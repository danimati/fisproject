import pytest
from fastapi.testclient import TestClient


class TestHealthEndpoints:
    """Test cases for health check endpoints."""
    
    def test_health_check(self, client: TestClient):
        """Test basic health check endpoint."""
        response = client.get("/api/v1/health")
        assert response.status_code == 200
        
        data = response.json()
        assert data["status"] == "healthy"
        assert "timestamp" in data
        assert "service" in data
        assert data["service"] == "Maritime Trade Management API"
    
    def test_readiness_check(self, client: TestClient):
        """Test readiness check endpoint."""
        response = client.get("/api/v1/ready")
        assert response.status_code == 200
        
        data = response.json()
        assert data["status"] == "ready"
        assert "timestamp" in data
        assert data["database"] == "connected"
    
    def test_root_endpoint(self, client: TestClient):
        """Test root endpoint."""
        response = client.get("/")
        assert response.status_code == 200
        
        data = response.json()
        assert "message" in data
        assert "version" in data
        assert "status" in data
        assert data["status"] == "running"
