"""
Shared pytest configuration for the Placement Predictions test suite.

Sets placeholder environment variables required by app/config.py so backend
modules can be imported for unit/integration testing without a real .env
file, real Postgres/Supabase credentials, or real Google OAuth credentials.

Nothing here talks to the network or to a real database - JWT_SECRET etc.
are dummy values used only to exercise code paths (token encode/decode,
config loading). Integration tests that need a DB use an in-memory SQLite
engine (see integration/conftest.py), not these values.
"""
import os
import sys
from pathlib import Path

# --- Dummy settings so app.config.Settings() doesn't blow up on import ---
os.environ.setdefault("DATABASE_URL", "sqlite+aiosqlite:///:memory:")
os.environ.setdefault("DATABASE_URL_DIRECT", "sqlite:///:memory:")
os.environ.setdefault("JWT_SECRET", "test-secret-do-not-use-in-prod")
os.environ.setdefault("JWT_EXPIRY_MINUTES", "10080")
os.environ.setdefault("GOOGLE_CLIENT_ID", "test-client-id")
os.environ.setdefault("GOOGLE_CLIENT_SECRET", "test-client-secret")
os.environ.setdefault("GOOGLE_REDIRECT_URI", "http://localhost:8000/auth/google/callback")
os.environ.setdefault("ENVIRONMENT", "development")
os.environ.setdefault("ENABLE_DEMO_LOGIN", "True")
os.environ.setdefault("FRONTEND_URL", "http://localhost:5173")

# --- Make `app.*` importable ---
BACKEND_DIR = Path(__file__).resolve().parent.parent / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))
