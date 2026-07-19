from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.prediction import Prediction
from app.schemas.prediction import PredictionResponse
from app.api.routes.predict import DISCLAIMER_TEXT

router = APIRouter()

@router.get("/", response_model=List[PredictionResponse])
async def get_history(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Prediction)
        .where(Prediction.user_id == current_user.id)
        .order_by(Prediction.created_at.desc())
    )
    predictions = result.scalars().all()
    
    # We must append the disclaimer text to response since it's required by the schema
    # Pydantic's from_attributes will extract the fields from the model, but we need to supply the disclaimer
    response_list = []
    for p in predictions:
        p_dict = {
            "id": p.id,
            "profile_id": p.profile_id,
            "user_id": p.user_id,
            "outcome": p.outcome,
            "confidence_score": p.confidence_score,
            "limiting_features": p.limiting_features,
            "created_at": p.created_at,
            "disclaimer": DISCLAIMER_TEXT
        }
        response_list.append(PredictionResponse(**p_dict))
        
    return response_list
