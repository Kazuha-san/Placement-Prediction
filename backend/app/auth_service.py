import uuid

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.models import User

# Fixed, well-known ID so the demo account is idempotent - re-running the seed
# script or logging in as demo repeatedly always resolves to the same user.
DEMO_USER_ID = uuid.UUID("00000000-0000-4000-8000-000000000001")
DEMO_EMAIL = "demo.student@placement-predictor.app"
DEMO_DISPLAY_NAME = "Demo Student"


async def authenticate_oauth_user(db: AsyncSession, provider: str, email: str, subject_id: str) -> User:
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalars().first()
    if not user:
        user = User(email=email, oauth_provider=provider, oauth_subject_id=subject_id)
        db.add(user)
        await db.commit()
        await db.refresh(user)
    return user


async def get_or_create_demo_user(db: AsyncSession) -> User:
    """Get-or-create the fixed reviewer/demo account (no real Google login needed)."""
    result = await db.execute(select(User).where(User.id == DEMO_USER_ID))
    user = result.scalars().first()
    if not user:
        user = User(
            id=DEMO_USER_ID,
            email=DEMO_EMAIL,
            oauth_provider="demo",
            oauth_subject_id="demo",
            display_name=DEMO_DISPLAY_NAME,
            semester=6,
            year=3,
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
    return user
