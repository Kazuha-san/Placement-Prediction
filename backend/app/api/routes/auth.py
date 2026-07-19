from fastapi import APIRouter, Depends
from fastapi.responses import RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.core.security import create_access_token
from app.schemas.auth import Token
from app.services.auth_service import authenticate_oauth_user

router = APIRouter()

@router.get("/google/login")
async def login_google():
    return RedirectResponse(url="https://accounts.google.com/o/oauth2/auth?client_id=mock")

@router.get("/google/callback")
async def callback_google(code: str = None, error: str = None, db: AsyncSession = Depends(get_db)):
    if error or not code:
        return RedirectResponse(url="/signin?error=oauth_failed")
    
    # Mock Token Verification (NFR-3.5.3 Security mentions server-side validation)
    # In a real impl, we would use google-auth to verify the ID token.
    email = "test@example.com"
    subject_id = "google123"
    
    user = await authenticate_oauth_user(db, "google", email, subject_id)
    token = create_access_token(subject=user.id)
    return {"access_token": token, "token_type": "bearer"}

@router.get("/microsoft/login")
async def login_microsoft():
    return RedirectResponse(url="https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=mock")

@router.get("/microsoft/callback")
async def callback_microsoft(code: str = None, error: str = None, db: AsyncSession = Depends(get_db)):
    if error or not code:
        return RedirectResponse(url="/signin?error=oauth_failed")
    
    email = "test@microsoft.com"
    subject_id = "ms123"
    
    user = await authenticate_oauth_user(db, "microsoft", email, subject_id)
    token = create_access_token(subject=user.id)
    return {"access_token": token, "token_type": "bearer"}

@router.post("/guest", response_model=Token)
async def login_guest():
    token = create_access_token(subject="guest", is_guest=True)
    return {"access_token": token, "token_type": "bearer", "is_guest": True}
