import uuid
from typing import Optional

from fastapi import Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from pydantic import ValidationError
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app import security
from app.config import settings
from app.db import get_db
from app.models import User
from app.schemas import TokenPayload

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token", auto_error=False)


async def get_current_user_or_guest(
    request: Request, db: AsyncSession = Depends(get_db), token: str = Depends(oauth2_scheme)
) -> Optional[User]:
    actual_token = request.cookies.get("access_token") or token
    if not actual_token:
        return None
    try:
        payload = jwt.decode(actual_token, settings.JWT_SECRET, algorithms=[security.ALGORITHM])
        token_data = TokenPayload(**payload)
    except (JWTError, ValidationError):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Could not validate credentials")

    if token_data.is_guest:
        return None

    try:
        user_id = uuid.UUID(token_data.sub)
    except (ValueError, TypeError):
        return None

    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


async def get_current_user(
    current_user: Optional[User] = Depends(get_current_user_or_guest),
) -> User:
    if not current_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    return current_user
