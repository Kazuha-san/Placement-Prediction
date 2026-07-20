from pydantic import BaseModel
from typing import List, Optional, Any
from uuid import UUID
from datetime import datetime

class PredictionCreate(BaseModel):
    profile_id: UUID
    user_id: Optional[UUID] = None
    outcome: bool
    confidence_score: float
    limiting_features: dict[str, Any]
    out_of_range_fields: list[str] = []

class PredictionResponse(PredictionCreate):
    id: UUID
    created_at: datetime
    disclaimer: str

    model_config = {"from_attributes": True}
