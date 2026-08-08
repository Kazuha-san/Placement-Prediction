"""
One-time seed script: creates the demo/reviewer account and gives it a realistic
prediction history, so anyone using the "Demo account" link on the sign-in page
sees a fully populated app instead of an empty state.

Run once, from backend/, with your real .env in place:
    python seed_demo.py

Safe to re-run - it clears and re-inserts the demo user's history each time
rather than duplicating rows.
"""
import asyncio
from datetime import datetime, timedelta

from sqlalchemy import delete

from app.auth_service import get_or_create_demo_user
from app.db import AsyncSessionLocal
from app.models import Prediction, Profile

# A believable improvement arc over a semester: starts weak, ends strong.
DEMO_HISTORY = [
    {
        "days_ago": 95,
        "cgpa": 6.6, "internships": 0, "projects": 1, "certifications": 0,
        "aptitude_score": 46, "soft_skills_rating": 5, "extracurricular_activities": False,
        "placement_training": False, "backlogs": 2,
        "outcome": False, "confidence_score": 0.31,
        "limiting_features": {"cgpa": "CGPA below placement threshold", "internships": "no internships completed yet", "active_backlog_count": "multiple active backlogs (risk)"},
    },
    {
        "days_ago": 70,
        "cgpa": 7.0, "internships": 0, "projects": 2, "certifications": 1,
        "aptitude_score": 55, "soft_skills_rating": 6, "extracurricular_activities": False,
        "placement_training": True, "backlogs": 1,
        "outcome": False, "confidence_score": 0.46,
        "limiting_features": {"internships": "no internships completed yet", "active_backlog_count": "few active backlogs"},
    },
    {
        "days_ago": 45,
        "cgpa": 7.4, "internships": 1, "projects": 3, "certifications": 1,
        "aptitude_score": 63, "soft_skills_rating": 7, "extracurricular_activities": True,
        "placement_training": True, "backlogs": 0,
        "outcome": True, "confidence_score": 0.58,
        "limiting_features": {"aptitude_test_score": "average aptitude test score"},
    },
    {
        "days_ago": 20,
        "cgpa": 7.9, "internships": 1, "projects": 4, "certifications": 2,
        "aptitude_score": 71, "soft_skills_rating": 8, "extracurricular_activities": True,
        "placement_training": True, "backlogs": 0,
        "outcome": True, "confidence_score": 0.74,
        "limiting_features": {"aptitude_test_score": "high aptitude test score"},
    },
    {
        "days_ago": 3,
        "cgpa": 8.4, "internships": 2, "projects": 5, "certifications": 3,
        "aptitude_score": 82, "soft_skills_rating": 8, "extracurricular_activities": True,
        "placement_training": True, "backlogs": 0,
        "outcome": True, "confidence_score": 0.89,
        "limiting_features": {},
    },
]


async def main():
    async with AsyncSessionLocal() as db:
        demo_user = await get_or_create_demo_user(db)

        # Clear any previously-seeded history for a clean re-run
        await db.execute(delete(Prediction).where(Prediction.user_id == demo_user.id))
        await db.execute(delete(Profile).where(Profile.user_id == demo_user.id))
        await db.commit()

        for entry in DEMO_HISTORY:
            created_at = datetime.utcnow() - timedelta(days=entry["days_ago"])

            profile = Profile(
                user_id=demo_user.id,
                cgpa=entry["cgpa"],
                internships=entry["internships"],
                projects=entry["projects"],
                certifications=entry["certifications"],
                aptitude_score=entry["aptitude_score"],
                soft_skills_rating=entry["soft_skills_rating"],
                extracurricular_activities=entry["extracurricular_activities"],
                placement_training=entry["placement_training"],
                backlogs=entry["backlogs"],
                created_at=created_at,
            )
            db.add(profile)
            await db.flush()

            prediction = Prediction(
                profile_id=profile.id,
                user_id=demo_user.id,
                outcome=entry["outcome"],
                confidence_score=entry["confidence_score"],
                limiting_features=entry["limiting_features"],
                out_of_range_fields=[],
                created_at=created_at,
            )
            db.add(prediction)

        await db.commit()
        print(f"Seeded {len(DEMO_HISTORY)} predictions for demo user {demo_user.email} ({demo_user.id})")


if __name__ == "__main__":
    asyncio.run(main())
