import pytest
from fastapi.testclient import TestClient


class TestVessels:
    """Test cases for vessel endpoints."""
    
    def test_create_vessel(self, client: TestClient, sample_vessel_data):
        """Test creating a new vessel."""
        response = client.post("/api/v1/vessels/", json=sample_vessel_data)
        assert response.status_code == 201
        
        data = response.json()
        assert data["name"] == sample_vessel_data["name"]
        assert data["imo_number"] == sample_vessel_data["imo_number"]
        assert data["id"] is not None
        assert "created_at" in data
    
    def test_create_vessel_duplicate_imo(self, client: TestClient, sample_vessel_data):
        """Test creating a vessel with duplicate IMO number."""
        # Create first vessel
        client.post("/api/v1/vessels/", json=sample_vessel_data)
        
        # Try to create duplicate
        response = client.post("/api/v1/vessels/", json=sample_vessel_data)
        assert response.status_code == 400
        assert "IMO number already exists" in response.json()["detail"]
    
    def test_get_vessel(self, client: TestClient, sample_vessel_data):
        """Test getting a vessel by ID."""
        # Create vessel
        create_response = client.post("/api/v1/vessels/", json=sample_vessel_data)
        vessel_id = create_response.json()["id"]
        
        # Get vessel
        response = client.get(f"/api/v1/vessels/{vessel_id}")
        assert response.status_code == 200
        
        data = response.json()
        assert data["id"] == vessel_id
        assert data["name"] == sample_vessel_data["name"]
    
    def test_get_vessel_not_found(self, client: TestClient):
        """Test getting a non-existent vessel."""
        response = client.get("/api/v1/vessels/99999")
        assert response.status_code == 404
        assert "Vessel not found" in response.json()["detail"]
    
    def test_list_vessels(self, client: TestClient, sample_vessel_data):
        """Test listing vessels."""
        # Create multiple vessels
        for i in range(3):
            vessel_data = sample_vessel_data.copy()
            vessel_data["imo_number"] = f"123456{i}"
            vessel_data["name"] = f"Test Vessel {i}"
            client.post("/api/v1/vessels/", json=vessel_data)
        
        # List vessels
        response = client.get("/api/v1/vessels/")
        assert response.status_code == 200
        
        data = response.json()
        assert data["total"] >= 3
        assert len(data["items"]) >= 3
        assert "pages" in data
        assert "page" in data
        assert "size" in data
    
    def test_list_vessels_with_filters(self, client: TestClient, sample_vessel_data):
        """Test listing vessels with filters."""
        # Create vessels with different statuses
        active_vessel = sample_vessel_data.copy()
        active_vessel["imo_number"] = "1111111"
        active_vessel["name"] = "Active Vessel"
        
        inactive_vessel = sample_vessel_data.copy()
        inactive_vessel["imo_number"] = "2222222"
        inactive_vessel["name"] = "Inactive Vessel"
        inactive_vessel["status"] = "inactive"
        
        client.post("/api/v1/vessels/", json=active_vessel)
        client.post("/api/v1/vessels/", json=inactive_vessel)
        
        # Filter by status
        response = client.get("/api/v1/vessels/?status=active")
        assert response.status_code == 200
        
        data = response.json()
        assert all(item["status"] == "active" for item in data["items"])
    
    def test_update_vessel(self, client: TestClient, sample_vessel_data):
        """Test updating a vessel."""
        # Create vessel
        create_response = client.post("/api/v1/vessels/", json=sample_vessel_data)
        vessel_id = create_response.json()["id"]
        
        # Update vessel
        update_data = {"name": "Updated Vessel Name"}
        response = client.put(f"/api/v1/vessels/{vessel_id}", json=update_data)
        assert response.status_code == 200
        
        data = response.json()
        assert data["name"] == "Updated Vessel Name"
        assert data["imo_number"] == sample_vessel_data["imo_number"]  # Unchanged
    
    def test_update_vessel_not_found(self, client: TestClient):
        """Test updating a non-existent vessel."""
        update_data = {"name": "Updated Vessel Name"}
        response = client.put("/api/v1/vessels/99999", json=update_data)
        assert response.status_code == 404
    
    def test_delete_vessel(self, client: TestClient, sample_vessel_data):
        """Test deleting a vessel."""
        # Create vessel
        create_response = client.post("/api/v1/vessels/", json=sample_vessel_data)
        vessel_id = create_response.json()["id"]
        
        # Delete vessel
        response = client.delete(f"/api/v1/vessels/{vessel_id}")
        assert response.status_code == 204
        
        # Verify deletion
        get_response = client.get(f"/api/v1/vessels/{vessel_id}")
        assert get_response.status_code == 404
    
    def test_delete_vessel_not_found(self, client: TestClient):
        """Test deleting a non-existent vessel."""
        response = client.delete("/api/v1/vessels/99999")
        assert response.status_code == 404
    
    def test_vessel_validation(self, client: TestClient):
        """Test vessel data validation."""
        # Test invalid IMO number
        invalid_vessel = {
            "name": "Test Vessel",
            "imo_number": "invalid",  # Should be 7 digits
            "flag_country": "Panama",
            "vessel_type": "Container Ship",
            "deadweight_tonnage": 50000,
            "gross_tonnage": 60000,
            "status": "active"
        }
        
        response = client.post("/api/v1/vessels/", json=invalid_vessel)
        assert response.status_code == 422  # Validation error
