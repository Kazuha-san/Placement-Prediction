import uuid
from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import JSONB, UUID

from app.db import Base


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    oauth_provider = Column(String, nullable=False)
    oauth_subject_id = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    display_name = Column(String, nullable=True)
    semester = Column(Integer, nullable=True)
    year = Column(Integer, nullable=True)


class Profile(Base):
    __tablename__ = "profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    cgpa = Column(Float, nullable=False)
    internships = Column(Integer, nullable=False)
    projects = Column(Integer, nullable=False)
    certifications = Column(Integer, nullable=False)
    aptitude_score = Column(Float, nullable=False)
    soft_skills_rating = Column(Float, nullable=False)
    extracurricular_activities = Column(Boolean, nullable=False)
    placement_training = Column(Boolean, nullable=False)
    backlogs = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    profile_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    outcome = Column(Boolean, nullable=False)
    confidence_score = Column(Float, nullable=False)
    limiting_features = Column(JSONB, nullable=False)
    out_of_range_fields = Column(JSONB, nullable=False, default=list)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
