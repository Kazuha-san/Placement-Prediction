import secrets
from urllib.parse import urlencode

import httpx
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import JSONResponse, RedirectResponse
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token as google_id_token
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth_service import authenticate_oauth_user, get_or_create_demo_user
from app.config import settings
from app.db import get_db
from app.deps import get_current_user, get_current_user_or_guest
from app.models import User
from app.schemas import Token, UserUpdate
from app.security import create_access_token

router = APIRouter()


def _user_out(user: User) -> dict:
    return {
        "id": str(user.id),
        "name": user.display_name,
        "email": user.email,
        "created_at": user.created_at.isoformat(),
        "semester": user.semester,
        "year": user.year,
    }


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
    response = RedirectResponse(url=f"https://accounts.google.com/o/oauth2/v2/auth?{urlencode(params)}")
    response.set_cookie(key="oauth_state", value=state, httponly=True, max_age=300, **settings.cookie_settings())
    return response


@router.get("/google/callback")
async def callback_google(
    request: Request,
    code: str = None,
    error: str = None,
    state: str = None,
    db: AsyncSession = Depends(get_db),
):
    def fail():
        return RedirectResponse(url=f"{settings.FRONTEND_URL}/signin?error=oauth_failed")

    if error or not code:
        return fail()

    expected_state = request.cookies.get("oauth_state")
    if not state or not expected_state or state != expected_state:
        return fail()

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
        return fail()

    raw_id_token = token_response.json().get("id_token")
    if not raw_id_token:
        return fail()

    try:
        id_info = google_id_token.verify_oauth2_token(raw_id_token, google_requests.Request(), settings.GOOGLE_CLIENT_ID)
    except ValueError:
        return fail()

    if not id_info.get("email_verified", False):
        return fail()

    user = await authenticate_oauth_user(db, "google", id_info["email"], id_info["sub"])
    token = create_access_token(subject=user.id)

    response = RedirectResponse(url=f"{settings.FRONTEND_URL}/auth/callback")
    response.set_cookie(
        key="access_token", value=token, httponly=True,
        max_age=settings.JWT_EXPIRY_MINUTES * 60, **settings.cookie_settings(),
    )
    response.delete_cookie("oauth_state", **settings.cookie_settings())
    return response


@router.post("/demo")
async def login_demo(db: AsyncSession = Depends(get_db)):
    """
    Logs the caller in as the seeded demo/reviewer account - no real Google
    account needed. Run backend/seed_demo.py once to populate its history.
    Disabled entirely when settings.ENABLE_DEMO_LOGIN is False.
    """
    if not settings.ENABLE_DEMO_LOGIN:
        raise HTTPException(status_code=404, detail="Demo login is disabled")

    demo_user = await get_or_create_demo_user(db)
    token = create_access_token(subject=demo_user.id)

    response = JSONResponse(content={"user": _user_out(demo_user), "is_guest": False})
    response.set_cookie(
        key="access_token", value=token, httponly=True,
        max_age=settings.JWT_EXPIRY_MINUTES * 60, **settings.cookie_settings(),
    )
    return response


@router.get("/me")
async def get_current_user_info(current_user: User = Depends(get_current_user_or_guest)):
    if not current_user:
        return {"user": None, "is_guest": True}
    return {"user": _user_out(current_user), "is_guest": False}


@router.patch("/me")
async def update_current_user(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if user_update.display_name is not None:
        current_user.display_name = user_update.display_name
    if user_update.semester is not None:
        current_user.semester = user_update.semester
    if user_update.year is not None:
        current_user.year = user_update.year

    await db.commit()
    await db.refresh(current_user)
    return {"user": _user_out(current_user), "is_guest": False}


@router.delete("/me")
async def delete_current_user(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await db.delete(current_user)
    await db.commit()

    response = JSONResponse(content={"success": True})
    response.delete_cookie(key="access_token", **settings.cookie_settings())
    return response


@router.post("/guest", response_model=Token)
async def login_guest():
    token = create_access_token(subject="guest", is_guest=True)
    return {"access_token": token, "token_type": "bearer", "is_guest": True}


@router.post("/logout")
async def logout():
    response = JSONResponse(content={"success": True})
    response.delete_cookie(key="access_token", **settings.cookie_settings())
    return response
