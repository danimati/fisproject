import pytest
import asyncio
from typing import Generator
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.core.database import get_db, Base
from app.core.config import settings

# Test database URL
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="function")
def db_session():
    """Create a fresh database session for each test."""
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db_session):
    """Create a test client with the test database."""
    def override_get_db():
        try:
            yield db_session
        finally:
            pass
    
    app.dependency_overrides[get_db] = override_get_db
    
    with TestClient(app) as test_client:
        yield test_client
    
    app.dependency_overrides.clear()


@pytest.fixture
def sample_vessel_data():
    """Sample vessel data for testing."""
    return {
        "name": "Test Vessel",
        "imo_number": "1234567",
        "flag_country": "Panama",
        "vessel_type": "Container Ship",
        "deadweight_tonnage": 50000,
        "gross_tonnage": 60000,
        "length_overall": 200.0,
        "beam": 30.0,
        "draft": 12.0,
        "max_containers": 5000,
        "max_cargo_weight": 45000.0,
        "status": "active"
    }


@pytest.fixture
def sample_container_data():
    """Sample container data for testing."""
    return {
        "container_number": "TEST1234567",
        "container_type": "dry_40",
        "max_weight": 28000.0,
        "max_volume": 67.0,
        "current_weight": 0.0,
        "current_volume": 0.0,
        "status": "empty"
    }


@pytest.fixture
def sample_client_data():
    """Sample client data for testing."""
    return {
        "name": "Test Client",
        "client_type": "company",
        "tax_id": "TEST123456",
        "email": "test@example.com",
        "phone": "+1234567890",
        "address": "123 Test St",
        "country": "United States",
        "contact_person": "John Doe"
    }


@pytest.fixture
def sample_port_data():
    """Sample port data for testing."""
    return {
        "name": "Test Port",
        "code": "TESTP",
        "country": "United States",
        "city": "Test City",
        "latitude": 40.7128,
        "longitude": -74.0060,
        "port_type": "sea",
        "max_vessel_draft": 15.0,
        "container_terminals": 3
    }
