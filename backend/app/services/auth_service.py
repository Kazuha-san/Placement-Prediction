from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.user import User

async def authenticate_oauth_user(db: AsyncSession, provider: str, email: str, subject_id: str) -> User:
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalars().first()
    if not user:
        user = User(
            email=email,
            oauth_provider=provider,
            oauth_subject_id=subject_id
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
    return user
