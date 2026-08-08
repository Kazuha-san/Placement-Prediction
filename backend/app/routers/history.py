from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.db import get_db
from app.deps import get_current_user
from app.models import Prediction, User
from app.routers.predict import DISCLAIMER_TEXT
from app.schemas import PredictionResponse

router = APIRouter()


@router.get("/", response_model=list[PredictionResponse])
async def get_history(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Prediction).where(Prediction.user_id == current_user.id).order_by(Prediction.created_at.desc())
    )
    predictions = result.scalars().all()

    return [
        PredictionResponse(
            id=p.id, profile_id=p.profile_id, user_id=p.user_id,
            outcome=p.outcome, confidence_score=p.confidence_score,
            limiting_features=p.limiting_features, out_of_range_fields=p.out_of_range_fields,
            created_at=p.created_at, disclaimer=DISCLAIMER_TEXT,
        )
        for p in predictions
    ]
