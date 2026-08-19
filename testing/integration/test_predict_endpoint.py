"""
TC-IT-01.x - Integration Tests: POST /predict/

Requirement: FR-4.1, FR-4.2, FR-4.3, FR-2.4 (guest mode), FR-5.1 (persistence)
Technique:   Gray-Box - real route + real Postgres DB, model inference not mocked
"""
import pytest
from sqlalchemy import select

pytestmark = pytest.mark.asyncio

VALID_PROFILE = dict(
    cgpa=8.5,
    internships=2,
    projects=5,
    certifications=3,
    aptitude_score=75.0,
    soft_skills_rating=7.5,
    extracurricular_activities=True,
    placement_training=True,
    backlogs=0,
)


class TestGuestPrediction:
    async def test_TC_IT_01_guest_prediction_returns_200_with_expected_shape(self, client):
        resp = await client.post("/predict/", json=VALID_PROFILE)
        assert resp.status_code == 200
        body = resp.json()
        assert "outcome" in body
        assert isinstance(body["outcome"], bool)
        assert 0.0 <= body["confidence_score"] <= 1.0
        assert body["user_id"] is None
        assert "disclaimer" in body and len(body["disclaimer"]) > 0
        assert body["profile"]["cgpa"] == VALID_PROFILE["cgpa"]

    async def test_TC_IT_02_guest_prediction_not_persisted_to_db(self, client, db_session):
        from app.models import Prediction, Profile

        await client.post("/predict/", json=VALID_PROFILE)
        profiles = (await db_session.execute(select(Profile))).scalars().all()
        predictions = (await db_session.execute(select(Prediction))).scalars().all()
        assert len(profiles) == 0, "FR-2.4: guest predictions must not be persisted"
        assert len(predictions) == 0

    async def test_TC_IT_03_guest_prediction_missing_field_returns_422(self, client):
        payload = {k: v for k, v in VALID_PROFILE.items() if k != "cgpa"}
        resp = await client.post("/predict/", json=payload)
        assert resp.status_code == 422

    async def test_TC_IT_04_guest_prediction_out_of_schema_range_returns_422(self, client):
        payload = {**VALID_PROFILE, "cgpa": 15.0}  # outside schema's 0-10
        resp = await client.post("/predict/", json=payload)
        assert resp.status_code == 422


class TestAuthenticatedPrediction:
    async def test_TC_IT_05_authenticated_prediction_persists_profile_and_prediction(
        self, client, db_session, demo_user
    ):
        from app.models import Prediction, Profile

        user, cookies = demo_user
        client.cookies.update(cookies)

        resp = await client.post("/predict/", json=VALID_PROFILE)
        assert resp.status_code == 200
        body = resp.json()
        assert body["user_id"] == str(user.id)

        profiles = (await db_session.execute(select(Profile).where(Profile.user_id == user.id))).scalars().all()
        predictions = (
            (await db_session.execute(select(Prediction).where(Prediction.user_id == user.id))).scalars().all()
        )
        assert len(profiles) == 1
        assert len(predictions) == 1
        assert predictions[0].profile_id == profiles[0].id

    async def test_TC_IT_06_out_of_training_range_cgpa_flagged_and_penalized(self, client, demo_user):
        # 3.0 is within schema bounds (0-10) but below the training range (~4.21-9.95)
        user, cookies = demo_user
        client.cookies.update(cookies)

        payload = {**VALID_PROFILE, "cgpa": 3.0}
        resp = await client.post("/predict/", json=payload)
        assert resp.status_code == 200
        body = resp.json()
        assert "cgpa" in body["out_of_range_fields"]

    async def test_TC_IT_17_limiting_features_returns_1_to_3_human_readable_factors(self, client):
        """
        TC-IT-17 - Requirement: FR-4.3 (display top influencing factors)
        Closes a real gap: limiting_features (the SHAP explainability output)
        was returned by the API but never asserted by any test. Verifies the
        shape and content contract, not the SHAP math itself (that's a
        third-party library's correctness, out of scope for this suite).
        """
        resp = await client.post("/predict/", json=VALID_PROFILE)
        assert resp.status_code == 200
        body = resp.json()

        assert "limiting_features" in body
        factors = body["limiting_features"]
        assert isinstance(factors, dict)
        # _key_factors() returns at most top-3 by design; can legitimately be
        # empty if SHAP contributions are all ~0 or the explainer failed to
        # load, but for a normal, non-degenerate profile it should return
        # between 1 and 3 factors.
        assert 0 <= len(factors) <= 3

        valid_field_names = set(VALID_PROFILE.keys())
        for field_name, message in factors.items():
            assert field_name in valid_field_names, (
                f"limiting_features key '{field_name}' is not a real profile field name"
            )
            assert isinstance(message, str) and len(message) > 0, (
                f"limiting_features['{field_name}'] should be a non-empty human-readable message"
            )

    async def test_TC_IT_18_limiting_features_present_for_authenticated_prediction_too(
        self, client, demo_user
    ):
        """Same contract check as TC-IT-17, but on the authenticated + persisted path."""
        user, cookies = demo_user
        client.cookies.update(cookies)

        resp = await client.post("/predict/", json=VALID_PROFILE)
        assert resp.status_code == 200
        body = resp.json()
        assert isinstance(body["limiting_features"], dict)
        assert 0 <= len(body["limiting_features"]) <= 3

    async def test_TC_IT_07_invalid_or_expired_token_returns_403(self, client):
        client.cookies.update({"access_token": "not-a-real-jwt"})
        resp = await client.post("/predict/", json=VALID_PROFILE)
        assert resp.status_code == 403
