"""
Integration test fixtures - TC-IT-xx (Gray-Box: routes + real Postgres DB).

REQUIRES a real Postgres database (the models use Postgres-only JSONB/UUID
column types, so SQLite cannot be substituted here). Point TEST_DATABASE_URL
at a *disposable* database/schema - this suite creates and drops all tables
each session. Never point it at production Supabase.

Example (local Postgres):
    export TEST_DATABASE_URL="postgresql+asyncpg://postgres:postgres@localhost:5432/placement_test"

If you only have your Supabase project, create a second free-tier project
(or a separate DB on the same instance) dedicated to testing and use that
connection string instead.
"""
import asyncio
import os

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.pool import NullPool

TEST_DATABASE_URL = os.environ.get(
    "TEST_DATABASE_URL",
    "postgresql+asyncpg://postgres:postgres@localhost:5432/placement_test",
)
os.environ["DATABASE_URL"] = TEST_DATABASE_URL
os.environ["DATABASE_URL_DIRECT"] = TEST_DATABASE_URL.replace("+asyncpg", "")

from app.db import Base, get_db  # noqa: E402
from app.main import app  # noqa: E402
from app.security import create_access_token  # noqa: E402


@pytest_asyncio.fixture(scope="session")
async def _test_engine():
    # NullPool: no connection pooling/reuse across event loops. Combined with
    # the session-scoped event loop configured in pytest.ini
    # (asyncio_default_fixture_loop_scope / asyncio_default_test_loop_scope =
    # session), this avoids "attached to a different loop" / "another
    # operation is in progress" errors that asyncpg raises when a pooled
    # connection opened on one event loop is reused from another.
    engine = create_async_engine(TEST_DATABASE_URL, echo=False, poolclass=NullPool)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    yield engine
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await engine.dispose()


@pytest_asyncio.fixture
async def db_session(_test_engine):
    """Fresh session per test; tables are truncated after each test."""
    session_maker = async_sessionmaker(_test_engine, expire_on_commit=False)
    async with session_maker() as session:
        yield session
    async with _test_engine.begin() as conn:
        for table in reversed(Base.metadata.sorted_tables):
            await conn.execute(table.delete())


@pytest_asyncio.fixture
async def client(_test_engine, db_session):
    async def _override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = _override_get_db
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as ac:
        yield ac
    app.dependency_overrides.clear()


@pytest_asyncio.fixture
async def demo_user(db_session):
    """Creates a demo user directly in the DB and returns (user, auth_cookie_dict)."""
    from app.models import User
    import uuid

    user = User(
        id=uuid.uuid4(),
        email="integration-test@placement-predictor.app",
        oauth_provider="demo",
        oauth_subject_id="itest",
        display_name="Integration Test User",
        semester=5,
        year=3,
    )
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)

    token = create_access_token(subject=user.id)
    return user, {"access_token": token}
