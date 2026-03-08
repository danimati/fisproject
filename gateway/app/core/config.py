from typing import List, Optional
from pydantic_settings import BaseSettings
from pydantic import validator


class Settings(BaseSettings):
    app_name: str = "Maritime Gateway API"
    app_version: str = "1.0.0"
    debug: bool = True
    environment: str = "development"
    
    # Gateway Database
    database_url: Optional[str] = None
    db_host: str = "localhost"
    db_port: int = 5432
    db_name: str = "felatiko"
    db_user: str = "felatiko"
    db_pass: str = "felatiko"
    
    # Backend API
    backend_url: str = "http://localhost:8000"
    
    # Redis
    redis_url: str = "redis://localhost:6379/0"
    
    # Security
    secret_key: str = "gateway-super-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7
    
    # Rate Limiting
    rate_limit_per_minute: int = 100
    rate_limit_per_hour: int = 1000
    dos_threshold: int = 500
    
    # CORS
    allowed_origins: List[str] = ["http://localhost:3000", "http://localhost:8080", "http://localhost:4200"]
    
    # Logging
    log_level: str = "INFO"
    
    # Encryption
    encryption_key: str = "encryption-key-32-chars-long-please"
    
    @validator("allowed_origins", pre=True, always=True)
    def assemble_cors_origins(cls, v):
        if isinstance(v, str):
            # Parse string representation of list
            import json
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                # If parsing fails, split by comma
                return [origin.strip() for origin in v.split(",")]
        return v
    
    @validator("database_url", pre=True, always=True)
    def assemble_db_connection(cls, v: Optional[str], values: dict) -> str:
        if isinstance(v, str):
            return v
        return (
            f"postgresql://{values.get('db_user')}:{values.get('db_pass')}"
            f"@{values.get('db_host')}:{values.get('db_port')}/{values.get('db_name')}"
        )
    
    class Config:
        env_file = ".env"


settings = Settings()
