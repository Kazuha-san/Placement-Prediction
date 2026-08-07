from pydantic import BaseModel, Field
from typing import Optional

class Token(BaseModel):
    access_token: str
    token_type: str
    is_guest: bool = False

class TokenPayload(BaseModel):
    sub: Optional[str] = None
    is_guest: bool = False

class UserUpdate(BaseModel):
    display_name: Optional[str] = Field(None, min_length=1)
    semester: Optional[int] = Field(None, ge=1, le=8)
    year: Optional[int] = Field(None, ge=1, le=4)
