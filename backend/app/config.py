import os
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = os.path.dirname(os.path.abspath(__file__))


class Settings(BaseSettings):
    # Database (Supabase Postgres)
    DATABASE_URL: str
    DATABASE_URL_DIRECT: str

    # Auth
    JWT_SECRET: str
    JWT_EXPIRY_MINUTES: int = 60
    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    GOOGLE_REDIRECT_URI: str

    # "development" (default, local http://localhost) or "production" (deployed, https)
    # This controls cookie security flags - see cookie_settings() below.
    ENVIRONMENT: str = "development"

    # Toggles the "demo student account" login (used so reviewers/professors can see
    # a fully populated app without a real Google account). Set to False to disable
    # it entirely - the /auth/demo endpoint will refuse to work once this is off.
    ENABLE_DEMO_LOGIN: bool = True

    FRONTEND_URL: str = "http://localhost:5173"
    MODEL_PATH: str = os.path.join(BASE_DIR, "ml_data", "placement_prediction_model.pkl")

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT.lower() == "production"

    def cookie_settings(self) -> dict:
        """
        Cross-origin deploys (Vercel frontend <-> Render backend, both HTTPS) need
        samesite="none" + secure=True, or the browser won't send the cookie back.

        Locally over plain http://, secure=True cookies get silently dropped by
        the browser (Secure cookies require HTTPS) - which breaks login entirely
        in local dev. So: samesite="lax" + secure=False for local dev.

        Set ENVIRONMENT=production in Render's env vars to switch this over.
        """
        if self.is_production:
            return {"samesite": "none", "secure": True}
        return {"samesite": "lax", "secure": False}


settings = Settings()
