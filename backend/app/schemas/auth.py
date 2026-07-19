from pydantic import BaseModel
from typing import Optional

class Token(BaseModel):
    access_token: str
    token_type: str
    is_guest: bool = False

class TokenPayload(BaseModel):
    sub: Optional[str] = None
    is_guest: bool = False
