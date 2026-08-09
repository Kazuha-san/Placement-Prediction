from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.db import get_db
from app.routers import auth, history, predict, progress

app = FastAPI(title="Placement Predictions Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(predict.router, prefix="/predict", tags=["Prediction"])
app.include_router(history.router, prefix="/history", tags=["History"])
app.include_router(progress.router, prefix="/progress", tags=["Progress"])


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/health/db")
async def health_check_db(db: AsyncSession = Depends(get_db)):
    """
    Same as /health, but also runs a trivial query - used by the keep-alive
    workflow so both Render (any request keeps it from spinning down) and
    Supabase (a real query resets its inactivity timer) stay awake together.
    """
    await db.execute(text("SELECT 1"))
    return {"status": "ok", "db": "ok"}
