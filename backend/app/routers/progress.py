from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.db import get_db
from app.deps import get_current_user
from app.models import Prediction, User
from app.schemas import ProgressDataPoint

router = APIRouter()


@router.get("/", response_model=list[ProgressDataPoint])
async def get_progress(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Prediction).where(Prediction.user_id == current_user.id).order_by(Prediction.created_at.asc())
    )
    predictions = result.scalars().all()
    return [ProgressDataPoint(date=p.created_at, confidence_score=p.confidence_score) for p in predictions]
