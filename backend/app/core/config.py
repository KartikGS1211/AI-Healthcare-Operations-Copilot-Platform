# pyrefly: ignore [missing-import]
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # App Settings
    APP_NAME: str = "AI Healthcare Operations Copilot"
    API_V1_STR: str = "/api"
    
    # Database Settings
    DATABASE_URL: str 
    
    # Security Settings
    SECRET_KEY: str 
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # AI API Keys
    GROQ_API_KEY: str
    
    # Directories
    UPLOAD_DIR: str = "uploads"
    CHROMA_DB_DIR: str = "chroma_db"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True

settings = Settings()

if settings.SECRET_KEY == "development-secret":
    raise ValueError(
        "SECRET_KEY must be changed before production."
    )

