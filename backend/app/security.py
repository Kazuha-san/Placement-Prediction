from datetime import datetime, timedelta
from typing import Any, Union

from jose import jwt

from app.config import settings

ALGORITHM = "HS256"


def create_access_token(
    subject: Union[str, Any], is_guest: bool = False, expires_delta: timedelta = None
) -> str:
    expire = datetime.utcnow() + (
        expires_delta if expires_delta else timedelta(minutes=settings.JWT_EXPIRY_MINUTES)
    )
    to_encode = {"exp": expire, "sub": str(subject), "is_guest": is_guest}
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=ALGORITHM)
