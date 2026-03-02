import pytest
from fastapi.testclient import TestClient


class TestContainers:
    """Test cases for container endpoints."""
    
    def test_create_container(self, client: TestClient, sample_container_data):
        """Test creating a new container."""
        response = client.post("/api/v1/containers/", json=sample_container_data)
        assert response.status_code == 201
        
        data = response.json()
        assert data["container_number"] == sample_container_data["container_number"]
        assert data["container_type"] == sample_container_data["container_type"]
        assert data["id"] is not None
        assert "created_at" in data
    
    def test_create_container_duplicate_number(self, client: TestClient, sample_container_data):
        """Test creating a container with duplicate number."""
        # Create first container
        client.post("/api/v1/containers/", json=sample_container_data)
        
        # Try to create duplicate
        response = client.post("/api/v1/containers/", json=sample_container_data)
        assert response.status_code == 400
        assert "Container with this number already exists" in response.json()["detail"]
    
    def test_get_container(self, client: TestClient, sample_container_data):
        """Test getting a container by ID."""
        # Create container
        create_response = client.post("/api/v1/containers/", json=sample_container_data)
        container_id = create_response.json()["id"]
        
        # Get container
        response = client.get(f"/api/v1/containers/{container_id}")
        assert response.status_code == 200
        
        data = response.json()
        assert data["id"] == container_id
        assert data["container_number"] == sample_container_data["container_number"]
    
    def test_get_container_by_number(self, client: TestClient, sample_container_data):
        """Test getting a container by container number."""
        # Create container
        client.post("/api/v1/containers/", json=sample_container_data)
        
        # Get container by number
        response = client.get(f"/api/v1/containers/number/{sample_container_data['container_number']}")
        assert response.status_code == 200
        
        data = response.json()
        assert data["container_number"] == sample_container_data["container_number"]
    
    def test_get_container_not_found(self, client: TestClient):
        """Test getting a non-existent container."""
        response = client.get("/api/v1/containers/99999")
        assert response.status_code == 404
        assert "Container not found" in response.json()["detail"]
    
    def test_list_containers(self, client: TestClient, sample_container_data):
        """Test listing containers."""
        # Create multiple containers
        for i in range(3):
            container_data = sample_container_data.copy()
            container_data["container_number"] = f"TEST12345{i}"
            client.post("/api/v1/containers/", json=container_data)
        
        # List containers
        response = client.get("/api/v1/containers/")
        assert response.status_code == 200
        
        data = response.json()
        assert data["total"] >= 3
        assert len(data["items"]) >= 3
        assert "pages" in data
        assert "page" in data
        assert "size" in data
    
    def test_list_containers_with_filters(self, client: TestClient, sample_container_data):
        """Test listing containers with filters."""
        # Create containers with different types
        dry_container = sample_container_data.copy()
        dry_container["container_number"] = "DRY1234567"
        dry_container["container_type"] = "dry_20"
        
        reefer_container = sample_container_data.copy()
        reefer_container["container_number"] = "REF1234567"
        reefer_container["container_type"] = "reefer_40"
        
        client.post("/api/v1/containers/", json=dry_container)
        client.post("/api/v1/containers/", json=reeefer_container)
        
        # Filter by type
        response = client.get("/api/v1/containers/?container_type=dry_20")
        assert response.status_code == 200
        
        data = response.json()
        assert all(item["container_type"] == "dry_20" for item in data["items"])
    
    def test_update_container(self, client: TestClient, sample_container_data):
        """Test updating a container."""
        # Create container
        create_response = client.post("/api/v1/containers/", json=sample_container_data)
        container_id = create_response.json()["id"]
        
        # Update container
        update_data = {"status": "loaded", "current_weight": 1000.0}
        response = client.put(f"/api/v1/containers/{container_id}", json=update_data)
        assert response.status_code == 200
        
        data = response.json()
        assert data["status"] == "loaded"
        assert data["current_weight"] == 1000.0
        assert data["container_number"] == sample_container_data["container_number"]  # Unchanged
    
    def test_update_container_not_found(self, client: TestClient):
        """Test updating a non-existent container."""
        update_data = {"status": "loaded"}
        response = client.put("/api/v1/containers/99999", json=update_data)
        assert response.status_code == 404
    
    def test_delete_container(self, client: TestClient, sample_container_data):
        """Test deleting a container."""
        # Create container
        create_response = client.post("/api/v1/containers/", json=sample_container_data)
        container_id = create_response.json()["id"]
        
        # Delete container
        response = client.delete(f"/api/v1/containers/{container_id}")
        assert response.status_code == 204
        
        # Verify deletion
        get_response = client.get(f"/api/v1/containers/{container_id}")
        assert get_response.status_code == 404
    
    def test_delete_container_not_found(self, client: TestClient):
        """Test deleting a non-existent container."""
        response = client.delete("/api/v1/containers/99999")
        assert response.status_code == 404
    
    def test_container_validation(self, client: TestClient):
        """Test container data validation."""
        # Test invalid container number (not 11 characters)
        invalid_container = {
            "container_number": "INVALID",  # Should be 11 characters
            "container_type": "dry_40",
            "max_weight": 28000.0,
            "max_volume": 67.0,
            "status": "empty"
        }
        
        response = client.post("/api/v1/containers/", json=invalid_container)
        assert response.status_code == 422  # Validation error
    
    def test_container_weight_validation(self, client: TestClient, sample_container_data):
        """Test container weight validation."""
        # Test current weight exceeding max weight
        invalid_container = sample_container_data.copy()
        invalid_container["current_weight"] = 50000.0  # Exceeds max_weight of 28000.0
        
        response = client.post("/api/v1/containers/", json=invalid_container)
        assert response.status_code == 422  # Validation error
