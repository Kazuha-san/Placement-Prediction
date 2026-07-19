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
    MODEL_PATH: str = "./app/ml/model.joblib"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()
