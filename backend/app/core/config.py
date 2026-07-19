import os
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

class Settings(BaseSettings):
    DATABASE_URL: str
    DATABASE_URL_DIRECT: str
    JWT_SECRET: str
    JWT_EXPIRY_MINUTES: int = 60
    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    GOOGLE_REDIRECT_URI: str
    FRONTEND_URL: str = "http://localhost:5173"
    MODEL_PATH: str = os.path.join(BASE_DIR, "ml", "placement_prediction_model.pkl")

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()
