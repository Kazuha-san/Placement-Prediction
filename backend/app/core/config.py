from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL: str
    DATABASE_URL_DIRECT: str
    JWT_SECRET: str
    JWT_EXPIRY_MINUTES: int = 60
    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    MICROSOFT_CLIENT_ID: str
    MICROSOFT_CLIENT_SECRET: str
    FRONTEND_URL: str = "http://localhost:5173"
    MODEL_PATH: str = "./app/ml/placement_prediction_model.pkl"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()
