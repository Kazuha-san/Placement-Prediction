from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from app.db.session import get_db
from app.api.deps import get_current_user_or_guest
from app.models.user import User
from app.models.profile import Profile
from app.models.prediction import Prediction
from app.schemas.profile import ProfileCreate
from app.schemas.prediction import PredictionResponse
from app.services.prediction_service import predict

router = APIRouter()

DISCLAIMER_TEXT = "This prediction is a probabilistic estimate based on historical data. It does not guarantee any actual placement outcome."

@router.post("/", response_model=PredictionResponse)
async def create_prediction(
    profile_in: ProfileCreate,
    current_user: Optional[User] = Depends(get_current_user_or_guest),
    db: AsyncSession = Depends(get_db)
):
    profile_data = profile_in.model_dump()
    
    # Get prediction
    outcome, confidence, limiting_features = await predict(profile_data)
    
    if current_user:
        # Save Profile
        db_profile = Profile(**profile_data, user_id=current_user.id)
        db.add(db_profile)
        await db.flush()
        
        # Save Prediction
        db_prediction = Prediction(
            profile_id=db_profile.id,
            user_id=current_user.id,
            outcome=outcome,
            confidence_score=confidence,
            limiting_features=limiting_features
        )
        db.add(db_prediction)
        await db.commit()
        await db.refresh(db_prediction)
        
        return PredictionResponse(
            id=db_prediction.id,
            profile_id=db_prediction.profile_id,
            user_id=db_prediction.user_id,
            outcome=db_prediction.outcome,
            confidence_score=db_prediction.confidence_score,
            limiting_features=db_prediction.limiting_features,
            created_at=db_prediction.created_at,
            disclaimer=DISCLAIMER_TEXT
        )
    else:
        # Guest Mode: Return directly, don't persist
        import uuid
        from datetime import datetime
        
        return PredictionResponse(
            id=uuid.uuid4(),
            profile_id=uuid.uuid4(),
            user_id=None,
            outcome=outcome,
            confidence_score=confidence,
            limiting_features=limiting_features,
            created_at=datetime.utcnow(),
            disclaimer=DISCLAIMER_TEXT
        )
