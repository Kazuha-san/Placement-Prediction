"""
TC-ST-04 - System/Black-Box Test: PII Exclusion + Guest Mode Smoke Test

Requirement: NFR-2.5 (PII exclusion from prediction payloads/logs), FR-2.4
             (guest mode tokenless flow), FR-4.2, FR-4.3
Run against: the LIVE deployed backend

Run:
    python testing/system/test_pii_and_guest_flow.py
"""
import httpx

BASE_URL = "https://placement-prediction-xg2e.onrender.com"

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


def main():
    print(f"TC-ST-04: PII exclusion + guest flow against {BASE_URL}\n")

    with httpx.Client(timeout=30) as client:
        # 1. Health check
        print("1. Health check...")
        health = client.get(f"{BASE_URL}/health")
        print(f"   /health -> {health.status_code} {health.json()}\n")

        # 2. Guest prediction - no auth cookie/token sent at all
        print("2. Guest prediction (no auth)...")
        resp = client.post(f"{BASE_URL}/predict/", json=VALID_PROFILE)
        print(f"   Status: {resp.status_code}")
        body = resp.json()

        # 3. Confirm response contains ONLY the 9 schema fields + prediction
        #    metadata - no name/email/PII fields anywhere in the payload
        pii_fields = ("email", "name", "display_name", "oauth_subject_id", "password")
        found_pii = [f for f in pii_fields if f in str(body).lower()]
        print(f"   Response keys: {list(body.keys())}")
        print(f"   Profile keys:  {list(body.get('profile', {}).keys())}")
        print(f"   PII field names found in response: {found_pii or 'NONE'}")
        pii_ok = len(found_pii) == 0
        print(f"   {'PASS' if pii_ok else 'FAIL'}: no PII fields present in guest prediction response\n")

        # 4. user_id must be null for guest
        user_id_null = body.get("user_id") is None
        print(f"3. Guest prediction user_id is null: {body.get('user_id')} -> {'PASS' if user_id_null else 'FAIL'}\n")

        # 5. Outcome + confidence + disclaimer present (FR-4.2, FR-4.3)
        has_outcome = "outcome" in body
        has_confidence = "confidence_score" in body
        has_disclaimer = bool(body.get("disclaimer"))
        print(f"4. Response completeness:")
        print(f"   outcome present:      {has_outcome}")
        print(f"   confidence present:   {has_confidence}")
        print(f"   disclaimer present:   {has_disclaimer}")

    print("\n--- Summary ---")
    print(f"TC-ST-04a (PII excluded):        {'PASS' if pii_ok else 'FAIL'}")
    print(f"TC-ST-04b (guest user_id null):  {'PASS' if user_id_null else 'FAIL'}")
    print(f"TC-ST-04c (response complete):   {'PASS' if (has_outcome and has_confidence and has_disclaimer) else 'FAIL'}")


if __name__ == "__main__":
    main()
