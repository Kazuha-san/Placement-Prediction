"""
TC-IT-14 - Account Deletion (FR-2.7)
TC-IT-15 / TC-IT-16 - Inference Timeout & Slow-Inference Logging (FR-4.4, NFR-1.4, NFR-1.5)

These close gaps flagged in the v2.0 Traceability Matrix as "Not Covered".
No new tooling required - both use monkeypatching against the existing
pytest + httpx + Postgres integration setup.
"""
import asyncio

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


class TestAccountDeletion:
    """
    TC-IT-14 - DELETE /me
    Requirement: FR-2.7 - account deletion with cascading purge of profiles/predictions
    """

    async def test_TC_IT_14a_delete_account_removes_user_row(self, client, db_session, demo_user):
        from app.models import User

        user, cookies = demo_user
        client.cookies.update(cookies)

        resp = await client.delete("/auth/me")
        assert resp.status_code == 200
        assert resp.json()["success"] is True

        remaining = (await db_session.execute(select(User).where(User.id == user.id))).scalar_one_or_none()
        assert remaining is None, "User row must be gone after account deletion"

    async def test_TC_IT_14b_delete_account_cascades_to_profiles_and_predictions(
        self, client, db_session, demo_user
    ):
        from app.models import Prediction, Profile

        user, cookies = demo_user
        client.cookies.update(cookies)

        # Create a prediction (and therefore a profile) tied to this user first
        await client.post("/predict/", json=VALID_PROFILE)

        profiles_before = (
            (await db_session.execute(select(Profile).where(Profile.user_id == user.id))).scalars().all()
        )
        assert len(profiles_before) == 1, "sanity check: profile should exist before deletion"

        resp = await client.delete("/auth/me")
        assert resp.status_code == 200

        profiles_after = (
            (await db_session.execute(select(Profile).where(Profile.user_id == user.id))).scalars().all()
        )
        predictions_after = (
            (await db_session.execute(select(Prediction).where(Prediction.user_id == user.id))).scalars().all()
        )
        assert len(profiles_after) == 0, "FR-2.7: profiles must be cascade-deleted, no orphaned records"
        assert len(predictions_after) == 0, "FR-2.7: predictions must be cascade-deleted, no orphaned records"

    async def test_TC_IT_14c_delete_account_clears_auth_cookie(self, client, demo_user):
        _, cookies = demo_user
        client.cookies.update(cookies)

        resp = await client.delete("/auth/me")
        assert resp.status_code == 200
        # httpx surfaces cookie deletion as a Set-Cookie header clearing the value
        set_cookie_header = resp.headers.get("set-cookie", "")
        assert "access_token=" in set_cookie_header

    async def test_TC_IT_14d_unauthenticated_delete_returns_401(self, client):
        resp = await client.delete("/auth/me")
        assert resp.status_code == 401


class TestInferenceTimeoutFallback:
    """
    TC-IT-15 - Requirement: FR-4.4, NFR-1.1, NFR-1.4
    Simulates model inference exceeding the 1.9s hard timeout in prediction.py's
    predict() (asyncio.wait_for(..., timeout=1.9)) by patching model.predict_proba
    itself (the actual call made inside the local _run() closure), and confirms:
      - a 503 "service unavailable" response is returned (FR-4.4)
      - no incomplete/partial prediction is written to history (FR-4.4)
    """

    async def test_TC_IT_15a_inference_exceeding_timeout_returns_503(self, client, monkeypatch):
        import time
        import numpy as np
        import app.prediction as prediction_module

        def _slow_predict_proba(X):
            time.sleep(2.5)  # exceeds the 1.9s asyncio.wait_for timeout
            return np.array([[0.1, 0.9]])

        monkeypatch.setattr(prediction_module.model, "predict_proba", _slow_predict_proba)

        resp = await client.post("/predict/", json=VALID_PROFILE)
        assert resp.status_code == 503
        assert "unavailable" in resp.json()["detail"].lower()

    async def test_TC_IT_15b_timed_out_prediction_not_saved_to_history(
        self, client, db_session, demo_user, monkeypatch
    ):
        import time
        import numpy as np
        from app.models import Prediction
        import app.prediction as prediction_module

        def _slow_predict_proba(X):
            time.sleep(2.5)
            return np.array([[0.1, 0.9]])

        monkeypatch.setattr(prediction_module.model, "predict_proba", _slow_predict_proba)

        user, cookies = demo_user
        client.cookies.update(cookies)
        resp = await client.post("/predict/", json=VALID_PROFILE)
        assert resp.status_code == 503

        predictions = (
            (await db_session.execute(select(Prediction).where(Prediction.user_id == user.id))).scalars().all()
        )
        assert len(predictions) == 0, "FR-4.4: no incomplete prediction should be persisted on timeout"


class TestSlowInferenceLogging:
    """
    TC-IT-16 - Requirement: NFR-1.5
    Simulates inference taking >500ms but staying under the 1.9s hard timeout,
    confirming the "Inference exceeded 500ms target" warning is logged
    (backend-only NFR - not observable from a client, hence checked via caplog).
    """

    async def test_TC_IT_16_inference_over_500ms_logs_warning(self, client, caplog, monkeypatch):
        import logging
        import time
        import numpy as np
        import app.prediction as prediction_module

        def _moderately_slow_predict_proba(X):
            time.sleep(0.7)  # exceeds 500ms, stays under the 1.9s hard timeout
            return np.array([[0.1, 0.9]])

        monkeypatch.setattr(prediction_module.model, "predict_proba", _moderately_slow_predict_proba)

        with caplog.at_level(logging.WARNING, logger="app.prediction"):
            resp = await client.post("/predict/", json=VALID_PROFILE)

        assert resp.status_code == 200, "request should still succeed - only the 1.9s timeout causes a 503"
        assert any(
            "exceeded 500ms" in record.message for record in caplog.records
        ), "NFR-1.5: a warning must be logged when inference exceeds the 500ms target"
