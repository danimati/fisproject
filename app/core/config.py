from typing import List, Optional
from pydantic_settings import BaseSettings
from pydantic import validator


class Settings(BaseSettings):
    app_name: str = "Maritime Trade Management API"
    app_version: str = "1.0.0"
    debug: bool = False
    environment: str = "development"
    
    # Database
    database_url: Optional[str] = None
    db_host: Optional[str] = None
    db_port: Optional[int] = None
    db_name: Optional[str] = None
    db_user: Optional[str] = None
    db_pass: Optional[str] = None
    
    # Security
    secret_key: str = "your-super-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # CORS
    allowed_origins: List[str] = ["http://localhost:3000", "http://localhost:8080"]
    
    # Logging
    log_level: str = "INFO"
    
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
