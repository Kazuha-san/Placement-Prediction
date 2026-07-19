from fastapi import APIRouter, Depends
from fastapi.responses import RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.core.security import create_access_token
from app.schemas.auth import Token
from app.services.auth_service import authenticate_oauth_user

router = APIRouter()

from app.core.config import settings
from app.api.deps import get_current_user_or_guest
from app.models.user import User

@router.get("/google/login")
async def login_google():
    return RedirectResponse(url=f"https://accounts.google.com/o/oauth2/auth?client_id={settings.GOOGLE_CLIENT_ID}")

@router.get("/google/callback")
async def callback_google(code: str = None, error: str = None, db: AsyncSession = Depends(get_db)):
    if error or not code:
        return RedirectResponse(url=f"{settings.FRONTEND_URL}/?error=oauth_failed")
    
    # Mock Token Verification (NFR-3.5.3 Security mentions server-side validation)
    # In a real impl, we would use google-auth to verify the ID token.
    email = "test@example.com"
    subject_id = "google123"
    
    user = await authenticate_oauth_user(db, "google", email, subject_id)
    token = create_access_token(subject=user.id)
    
    response = RedirectResponse(url=f"{settings.FRONTEND_URL}/auth/callback")
    response.set_cookie(key="access_token", value=token, httponly=True, samesite="lax", max_age=settings.JWT_EXPIRY_MINUTES * 60)
    return response

@router.get("/microsoft/login")
async def login_microsoft():
    return RedirectResponse(url=f"https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id={settings.MICROSOFT_CLIENT_ID}")

@router.get("/microsoft/callback")
async def callback_microsoft(code: str = None, error: str = None, db: AsyncSession = Depends(get_db)):
    if error or not code:
        return RedirectResponse(url=f"{settings.FRONTEND_URL}/?error=oauth_failed")
    
    email = "test@microsoft.com"
    subject_id = "ms123"
    
    user = await authenticate_oauth_user(db, "microsoft", email, subject_id)
    token = create_access_token(subject=user.id)
    
    response = RedirectResponse(url=f"{settings.FRONTEND_URL}/auth/callback")
    response.set_cookie(key="access_token", value=token, httponly=True, samesite="lax", max_age=settings.JWT_EXPIRY_MINUTES * 60)
    return response

@router.get("/me")
async def get_current_user_info(current_user: User = Depends(get_current_user_or_guest)):
    if not current_user:
        return {"user": None, "is_guest": True}
    return {"user": {"id": str(current_user.id), "name": current_user.email}, "is_guest": False}

@router.post("/guest", response_model=Token)
async def login_guest():
    token = create_access_token(subject="guest", is_guest=True)
    return {"access_token": token, "token_type": "bearer", "is_guest": True}
