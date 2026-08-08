from datetime import datetime
from typing import Any, Optional
from uuid import UUID

from pydantic import BaseModel, Field

# ---- Auth ----


class Token(BaseModel):
    access_token: str
    token_type: str
    is_guest: bool = False


class TokenPayload(BaseModel):
    sub: Optional[str] = None
    is_guest: bool = False


class UserUpdate(BaseModel):
    display_name: Optional[str] = Field(None, min_length=1)
    semester: Optional[int] = Field(None, ge=1, le=8)
    year: Optional[int] = Field(None, ge=1, le=4)


class UserOut(BaseModel):
    id: str
    name: Optional[str]
    email: str
    created_at: str
    semester: Optional[int]
    year: Optional[int]


# ---- Profile / prediction input ----


class ProfileCreate(BaseModel):
    cgpa: float = Field(..., ge=0, le=10, description="CGPA must be between 0 and 10")
    internships: int = Field(..., ge=0, description="Number of internships must be >= 0")
    projects: int = Field(..., ge=0, description="Number of projects must be >= 0")
    certifications: int = Field(..., ge=0, description="Number of certifications must be >= 0")
    aptitude_score: float = Field(..., ge=0, le=100, description="Aptitude score must be between 0 and 100")
    soft_skills_rating: float = Field(..., ge=0, le=10, description="Soft skills rating must be between 0 and 10")
    extracurricular_activities: bool = Field(..., description="Participation in extracurriculars")
    placement_training: bool = Field(..., description="Completion of placement training")
    backlogs: int = Field(..., ge=0, description="Active backlog count must be >= 0")


class ProfileResponse(ProfileCreate):
    id: UUID
    user_id: Optional[UUID] = None
    created_at: datetime

    model_config = {"from_attributes": True}


# ---- Prediction output ----


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


class ProgressDataPoint(BaseModel):
    date: datetime
    confidence_score: float
