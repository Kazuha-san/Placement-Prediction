import uuid
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.deps import get_current_user_or_guest
from app.models import Prediction, Profile, User
from app.prediction import predict
from app.schemas import PredictionResponse, ProfileCreate, ProfileResponse

router = APIRouter()

DISCLAIMER_TEXT = (
    "This prediction is a probabilistic estimate based on historical data. "
    "It does not guarantee any actual placement outcome."
)


@router.post("/", response_model=PredictionResponse)
async def create_prediction(
    profile_in: ProfileCreate,
    current_user: Optional[User] = Depends(get_current_user_or_guest),
    db: AsyncSession = Depends(get_db),
):
    profile_data = profile_in.model_dump()
    outcome, confidence, key_factors, out_of_range_fields = await predict(profile_data)

    if not current_user:
        # Guest mode - don't persist anything, but still echo back the submitted
        # profile so the response shape matches the authenticated path.
        guest_profile_id = uuid.uuid4()
        now = datetime.utcnow()
        return PredictionResponse(
            id=uuid.uuid4(), profile_id=guest_profile_id, user_id=None,
            outcome=outcome, confidence_score=confidence,
            limiting_features=key_factors, out_of_range_fields=out_of_range_fields,
            created_at=now, disclaimer=DISCLAIMER_TEXT,
            profile=ProfileResponse(id=guest_profile_id, user_id=None, created_at=now, **profile_data),
        )

    db_profile = Profile(**profile_data, user_id=current_user.id)
    db.add(db_profile)
    await db.flush()

    db_prediction = Prediction(
        profile_id=db_profile.id, user_id=current_user.id,
        outcome=outcome, confidence_score=confidence,
        limiting_features=key_factors, out_of_range_fields=out_of_range_fields,
    )
    db.add(db_prediction)
    await db.commit()
    await db.refresh(db_prediction)

    return PredictionResponse(
        id=db_prediction.id, profile_id=db_prediction.profile_id, user_id=db_prediction.user_id,
        outcome=db_prediction.outcome, confidence_score=db_prediction.confidence_score,
        limiting_features=db_prediction.limiting_features, out_of_range_fields=db_prediction.out_of_range_fields,
        created_at=db_prediction.created_at, disclaimer=DISCLAIMER_TEXT,
        profile=ProfileResponse.model_validate(db_profile),
    )
