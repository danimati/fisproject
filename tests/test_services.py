import pytest
from sqlalchemy.orm import Session
from app.services.vessel_service import VesselService
from app.services.container_service import ContainerService
from app.services.client_service import ClientService
from app.models.vessel import Vessel, VesselStatus
from app.models.container import Container, ContainerType, ContainerStatus
from app.models.client import Client, ClientType


class TestVesselService:
    """Test cases for VesselService."""
    
    def test_create_vessel(self, db_session: Session):
        """Test creating a vessel through service."""
        service = VesselService(db_session)
        
        vessel_data = {
            "name": "Test Vessel",
            "imo_number": "1234567",
            "flag_country": "Panama",
            "vessel_type": "Container Ship",
            "deadweight_tonnage": 50000,
            "gross_tonnage": 60000,
            "status": VesselStatus.ACTIVE
        }
        
        vessel = service.create(vessel_data)
        assert vessel.id is not None
        assert vessel.name == vessel_data["name"]
        assert vessel.imo_number == vessel_data["imo_number"]
    
    def test_get_vessel_by_id(self, db_session: Session):
        """Test getting vessel by ID."""
        service = VesselService(db_session)
        
        # Create vessel
        vessel_data = {
            "name": "Test Vessel",
            "imo_number": "1234567",
            "flag_country": "Panama",
            "vessel_type": "Container Ship",
            "deadweight_tonnage": 50000,
            "gross_tonnage": 60000,
            "status": VesselStatus.ACTIVE
        }
        created_vessel = service.create(vessel_data)
        
        # Get vessel
        retrieved_vessel = service.get_by_id(created_vessel.id)
        assert retrieved_vessel is not None
        assert retrieved_vessel.id == created_vessel.id
        assert retrieved_vessel.name == vessel_data["name"]
    
    def test_get_vessel_by_imo_number(self, db_session: Session):
        """Test getting vessel by IMO number."""
        service = VesselService(db_session)
        
        # Create vessel
        vessel_data = {
            "name": "Test Vessel",
            "imo_number": "1234567",
            "flag_country": "Panama",
            "vessel_type": "Container Ship",
            "deadweight_tonnage": 50000,
            "gross_tonnage": 60000,
            "status": VesselStatus.ACTIVE
        }
        service.create(vessel_data)
        
        # Get vessel by IMO number
        vessel = service.get_by_imo_number("1234567")
        assert vessel is not None
        assert vessel.imo_number == "1234567"
    
    def test_update_vessel(self, db_session: Session):
        """Test updating a vessel."""
        service = VesselService(db_session)
        
        # Create vessel
        vessel_data = {
            "name": "Test Vessel",
            "imo_number": "1234567",
            "flag_country": "Panama",
            "vessel_type": "Container Ship",
            "deadweight_tonnage": 50000,
            "gross_tonnage": 60000,
            "status": VesselStatus.ACTIVE
        }
        created_vessel = service.create(vessel_data)
        
        # Update vessel
        update_data = {"name": "Updated Vessel", "status": VesselStatus.MAINTENANCE}
        updated_vessel = service.update(created_vessel.id, update_data)
        
        assert updated_vessel is not None
        assert updated_vessel.name == "Updated Vessel"
        assert updated_vessel.status == VesselStatus.MAINTENANCE
    
    def test_delete_vessel(self, db_session: Session):
        """Test deleting a vessel."""
        service = VesselService(db_session)
        
        # Create vessel
        vessel_data = {
            "name": "Test Vessel",
            "imo_number": "1234567",
            "flag_country": "Panama",
            "vessel_type": "Container Ship",
            "deadweight_tonnage": 50000,
            "gross_tonnage": 60000,
            "status": VesselStatus.ACTIVE
        }
        created_vessel = service.create(vessel_data)
        
        # Delete vessel
        result = service.delete(created_vessel.id)
        assert result is True
        
        # Verify deletion
        deleted_vessel = service.get_by_id(created_vessel.id)
        assert deleted_vessel is None


class TestContainerService:
    """Test cases for ContainerService."""
    
    def test_create_container(self, db_session: Session):
        """Test creating a container through service."""
        service = ContainerService(db_session)
        
        container_data = {
            "container_number": "TEST1234567",
            "container_type": ContainerType.DRY_40,
            "max_weight": 28000.0,
            "max_volume": 67.0,
            "current_weight": 0.0,
            "current_volume": 0.0,
            "status": ContainerStatus.EMPTY
        }
        
        container = service.create(container_data)
        assert container.id is not None
        assert container.container_number == container_data["container_number"]
        assert container.container_type == container_data["container_type"]
    
    def test_get_container_by_number(self, db_session: Session):
        """Test getting container by number."""
        service = ContainerService(db_session)
        
        # Create container
        container_data = {
            "container_number": "TEST1234567",
            "container_type": ContainerType.DRY_40,
            "max_weight": 28000.0,
            "max_volume": 67.0,
            "current_weight": 0.0,
            "current_volume": 0.0,
            "status": ContainerStatus.EMPTY
        }
        service.create(container_data)
        
        # Get container by number
        container = service.get_by_container_number("TEST1234567")
        assert container is not None
        assert container.container_number == "TEST1234567"
    
    def test_get_available_containers(self, db_session: Session):
        """Test getting available containers."""
        service = ContainerService(db_session)
        
        # Create containers with different statuses
        empty_container = {
            "container_number": "EMPTY123456",
            "container_type": ContainerType.DRY_20,
            "max_weight": 21000.0,
            "max_volume": 33.0,
            "status": ContainerStatus.EMPTY
        }
        
        loaded_container = {
            "container_number": "LOADED123456",
            "container_type": ContainerType.DRY_40,
            "max_weight": 28000.0,
            "max_volume": 67.0,
            "status": ContainerStatus.LOADED
        }
        
        service.create(empty_container)
        service.create(loaded_container)
        
        # Get available containers
        available = service.get_available_containers()
        assert len(available) == 1
        assert available[0].container_number == "EMPTY123456"
        assert available[0].status == ContainerStatus.EMPTY


class TestClientService:
    """Test cases for ClientService."""
    
    def test_create_client(self, db_session: Session):
        """Test creating a client through service."""
        service = ClientService(db_session)
        
        client_data = {
            "name": "Test Client",
            "client_type": ClientType.COMPANY,
            "tax_id": "TEST123456",
            "email": "test@example.com",
            "country": "United States",
            "is_active": "true"
        }
        
        client = service.create(client_data)
        assert client.id is not None
        assert client.name == client_data["name"]
        assert client.email == client_data["email"].lower()
    
    def test_get_client_by_email(self, db_session: Session):
        """Test getting client by email."""
        service = ClientService(db_session)
        
        # Create client
        client_data = {
            "name": "Test Client",
            "client_type": ClientType.COMPANY,
            "tax_id": "TEST123456",
            "email": "test@example.com",
            "country": "United States",
            "is_active": "true"
        }
        service.create(client_data)
        
        # Get client by email
        client = service.get_by_email("test@example.com")
        assert client is not None
        assert client.email == "test@example.com"
    
    def test_get_clients_by_type(self, db_session: Session):
        """Test getting clients by type."""
        service = ClientService(db_session)
        
        # Create clients with different types
        company_client = {
            "name": "Company Client",
            "client_type": ClientType.COMPANY,
            "tax_id": "COMP123456",
            "email": "company@example.com",
            "country": "United States",
            "is_active": "true"
        }
        
        individual_client = {
            "name": "Individual Client",
            "client_type": ClientType.INDIVIDUAL,
            "tax_id": "IND123456",
            "email": "individual@example.com",
            "country": "United States",
            "is_active": "true"
        }
        
        service.create(company_client)
        service.create(individual_client)
        
        # Get clients by type
        companies = service.get_clients_by_type(ClientType.COMPANY)
        individuals = service.get_clients_by_type(ClientType.INDIVIDUAL)
        
        assert len(companies) == 1
        assert len(individuals) == 1
        assert companies[0].client_type == ClientType.COMPANY
        assert individuals[0].client_type == ClientType.INDIVIDUAL
