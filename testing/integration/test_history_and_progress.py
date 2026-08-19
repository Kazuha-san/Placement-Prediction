"""
TC-IT-02.x - Integration Tests: GET /history/ and GET /progress/

Requirement: FR-5.1, FR-5.2 (reverse-chronological), FR-5.3 (progress chart),
             FR-5.4 (guest exclusion)
"""
import asyncio

import pytest

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


class TestHistory:
    async def test_TC_IT_08_history_empty_for_new_user(self, client, demo_user):
        _, cookies = demo_user
        client.cookies.update(cookies)
        resp = await client.get("/history/")
        assert resp.status_code == 200
        assert resp.json() == []

    async def test_TC_IT_09_history_returns_reverse_chronological_order(self, client, demo_user):
        _, cookies = demo_user
        client.cookies.update(cookies)

        for cgpa in (6.0, 7.0, 8.0):
            await client.post("/predict/", json={**VALID_PROFILE, "cgpa": cgpa})
            await asyncio.sleep(0.01)  # ensure distinct created_at ordering

        resp = await client.get("/history/")
        assert resp.status_code == 200
        body = resp.json()
        assert len(body) == 3
        cgpas = [item["profile"]["cgpa"] for item in body]
        assert cgpas == [8.0, 7.0, 6.0], "FR-5.2: most recent prediction must appear first"

    async def test_TC_IT_10_history_unauthenticated_returns_401(self, client):
        resp = await client.get("/history/")
        assert resp.status_code == 401

    async def test_TC_IT_11_history_guest_token_returns_401(self, client):
        from app.security import create_access_token

        guest_token = create_access_token(subject="guest", is_guest=True)
        client.cookies.update({"access_token": guest_token})
        resp = await client.get("/history/")
        assert resp.status_code == 401, "FR-5.4: guest sessions must not access history"


class TestProgress:
    async def test_TC_IT_12_progress_returns_chronological_order(self, client, demo_user):
        _, cookies = demo_user
        client.cookies.update(cookies)

        for cgpa in (6.0, 7.0, 8.0):
            await client.post("/predict/", json={**VALID_PROFILE, "cgpa": cgpa})
            await asyncio.sleep(0.01)

        resp = await client.get("/progress/")
        assert resp.status_code == 200
        body = resp.json()
        assert len(body) == 3
        dates = [item["date"] for item in body]
        assert dates == sorted(dates), "FR-5.3: progress must be in chronological order"

    async def test_TC_IT_13_progress_unauthenticated_returns_401(self, client):
        resp = await client.get("/progress/")
        assert resp.status_code == 401
