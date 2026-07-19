from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID
from datetime import datetime

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
