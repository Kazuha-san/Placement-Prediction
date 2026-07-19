from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from datetime import datetime

from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.prediction import Prediction

router = APIRouter()

class ProgressDataPoint(BaseModel):
    date: datetime
    confidence_score: float

@router.get("/", response_model=List[ProgressDataPoint])
async def get_progress(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Prediction)
        .where(Prediction.user_id == current_user.id)
        .order_by(Prediction.created_at.asc())
    )
    predictions = result.scalars().all()
    
    return [
        ProgressDataPoint(date=p.created_at, confidence_score=p.confidence_score)
        for p in predictions
    ]
