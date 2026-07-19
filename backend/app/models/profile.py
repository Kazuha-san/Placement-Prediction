import uuid
from datetime import datetime
from sqlalchemy import Column, Integer, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from app.db.base import Base

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    cgpa = Column(Float, nullable=False)
    internships = Column(Integer, nullable=False)
    projects = Column(Integer, nullable=False)
    certifications = Column(Integer, nullable=False)
    aptitude_score = Column(Float, nullable=False)
    soft_skills_rating = Column(Float, nullable=False)
    extracurricular_activities = Column(Boolean, nullable=False) # TODO: confirm against feature_schema.py
    placement_training = Column(Boolean, nullable=False)
    backlogs = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
