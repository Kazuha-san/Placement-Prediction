from fastapi import APIRouter, Depends, Request
from fastapi.responses import RedirectResponse, JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
import secrets
from urllib.parse import urlencode
import httpx
from google.oauth2 import id_token as google_id_token
from google.auth.transport import requests as google_requests
from app.api.deps import get_current_user, get_current_user_or_guest
from app.core.config import settings
from app.core.security import create_access_token
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import Token, UserUpdate
from app.services.auth_service import authenticate_oauth_user

router = APIRouter()

@router.get("/google/login")
async def login_google():
    state = secrets.token_urlsafe(32)
    params = {
        "client_id": settings.GOOGLE_CLIENT_ID,
        "redirect_uri": settings.GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope": "openid email profile",
        "state": state,
        "access_type": "offline",
        "prompt": "select_account",
    }
    url = f"https://accounts.google.com/o/oauth2/v2/auth?{urlencode(params)}"
    response = RedirectResponse(url=url)
    response.set_cookie(key="oauth_state", value=state, httponly=True, samesite="none", secure=True, max_age=300)
    return response

@router.get("/google/callback")
async def callback_google(
    request: Request,
    code: str = None,
    error: str = None,
    state: str = None,
    db: AsyncSession = Depends(get_db),
):
    if error or not code:
        return RedirectResponse(url=f"{settings.FRONTEND_URL}/signin?error=oauth_failed")

    # CSRF check
    expected_state = request.cookies.get("oauth_state")
    if not state or not expected_state or state != expected_state:
        return RedirectResponse(url=f"{settings.FRONTEND_URL}/signin?error=oauth_failed")

    # Exchange code for tokens
    async with httpx.AsyncClient() as client:
        token_response = await client.post(
            "https://oauth2.googleapis.com/token",
            data={
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "code": code,
                "redirect_uri": settings.GOOGLE_REDIRECT_URI,
                "grant_type": "authorization_code",
            },
        )
    if token_response.status_code != 200:
        return RedirectResponse(url=f"{settings.FRONTEND_URL}/signin?error=oauth_failed")

    tokens = token_response.json()
    raw_id_token = tokens.get("id_token")
    if not raw_id_token:
        return RedirectResponse(url=f"{settings.FRONTEND_URL}/signin?error=oauth_failed")

    # Verify ID token
    try:
        id_info = google_id_token.verify_oauth2_token(
            raw_id_token, google_requests.Request(), settings.GOOGLE_CLIENT_ID
        )
    except ValueError:
        return RedirectResponse(url=f"{settings.FRONTEND_URL}/signin?error=oauth_failed")

    if not id_info.get("email_verified", False):
        return RedirectResponse(url=f"{settings.FRONTEND_URL}/signin?error=oauth_failed")

    real_email = id_info["email"]
    real_subject_id = id_info["sub"]

    user = await authenticate_oauth_user(db, "google", real_email, real_subject_id)
    token = create_access_token(subject=user.id)

    response = RedirectResponse(url=f"{settings.FRONTEND_URL}/auth/callback")
    response.set_cookie(key="access_token", value=token, httponly=True, samesite="none", secure=True, max_age=settings.JWT_EXPIRY_MINUTES * 60)
    response.delete_cookie("oauth_state", samesite="none", secure=True)
    return response

@router.get("/me")
async def get_current_user_info(current_user: User = Depends(get_current_user_or_guest)):
    if not current_user:
        return {"user": None, "is_guest": True}
    return {
        "user": {
            "id": str(current_user.id),
            "name": current_user.display_name,
            "email": current_user.email,
            "created_at": current_user.created_at.isoformat(),
            "semester": current_user.semester,
            "year": current_user.year,
        },
        "is_guest": False
    }

@router.patch("/me")
async def update_current_user(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # Update fields if provided
    if user_update.display_name is not None:
        current_user.display_name = user_update.display_name
    if user_update.semester is not None:
        current_user.semester = user_update.semester
    if user_update.year is not None:
        current_user.year = user_update.year
    
    await db.commit()
    await db.refresh(current_user)
    
    return {
        "user": {
            "id": str(current_user.id),
            "name": current_user.display_name,
            "email": current_user.email,
            "created_at": current_user.created_at.isoformat(),
            "semester": current_user.semester,
            "year": current_user.year,
        },
        "is_guest": False
    }

@router.delete("/me")
async def delete_current_user(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await db.delete(current_user)
    await db.commit()
    
    response = JSONResponse(content={"success": True})
    response.delete_cookie(key="access_token", samesite="none", secure=True)
    return response

@router.post("/guest", response_model=Token)
async def login_guest():
    token = create_access_token(subject="guest", is_guest=True)
    return {"access_token": token, "token_type": "bearer", "is_guest": True}

@router.post("/logout")
async def logout():
    response = JSONResponse(content={"success": True})
    response.delete_cookie(key="access_token", samesite="none", secure=True)
    return response
