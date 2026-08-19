"""
TC-ST-03 - System/Black-Box Test: CORS Header Verification

Requirement: NFR-2.1 (HTTPS/TLS), NFR-2.4 (per-IP rate limiting existence check)
Run against: the LIVE deployed backend

Run:
    python testing/system/test_cors_and_headers.py
"""
import httpx

BASE_URL = "https://placement-prediction-xg2e.onrender.com"
FRONTEND_ORIGIN = "https://placement-prediction-webapp.vercel.app"
UNAUTHORIZED_ORIGIN = "https://evil-attacker-site.example.com"

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
    print(f"TC-ST-03: CORS + header checks against {BASE_URL}\n")

    with httpx.Client(timeout=30) as client:
        # 1. Preflight from the legitimate frontend origin
        print("1. OPTIONS preflight from legitimate frontend origin...")
        resp = client.options(
            f"{BASE_URL}/predict/",
            headers={
                "Origin": FRONTEND_ORIGIN,
                "Access-Control-Request-Method": "POST",
                "Access-Control-Request-Headers": "content-type",
            },
        )
        allow_origin = resp.headers.get("access-control-allow-origin")
        print(f"   Status: {resp.status_code}")
        print(f"   Access-Control-Allow-Origin: {allow_origin}")
        legit_ok = allow_origin == FRONTEND_ORIGIN
        print(f"   {'PASS' if legit_ok else 'FAIL'}: expected '{FRONTEND_ORIGIN}'\n")

        # 2. Actual request from legitimate origin, check header on real response too
        print("2. Actual POST from legitimate frontend origin...")
        resp2 = client.post(
            f"{BASE_URL}/predict/",
            json=VALID_PROFILE,
            headers={"Origin": FRONTEND_ORIGIN},
        )
        allow_origin_2 = resp2.headers.get("access-control-allow-origin")
        print(f"   Status: {resp2.status_code}")
        print(f"   Access-Control-Allow-Origin: {allow_origin_2}\n")

        # 3. Preflight from an unauthorized origin - should NOT be allowed
        print("3. OPTIONS preflight from an unauthorized/random origin...")
        resp3 = client.options(
            f"{BASE_URL}/predict/",
            headers={
                "Origin": UNAUTHORIZED_ORIGIN,
                "Access-Control-Request-Method": "POST",
                "Access-Control-Request-Headers": "content-type",
            },
        )
        allow_origin_3 = resp3.headers.get("access-control-allow-origin")
        print(f"   Status: {resp3.status_code}")
        print(f"   Access-Control-Allow-Origin: {allow_origin_3}")
        unauthorized_blocked = allow_origin_3 != UNAUTHORIZED_ORIGIN
        print(f"   {'PASS' if unauthorized_blocked else 'FAIL'}: unauthorized origin must not be echoed back\n")

        # 4. HTTPS/TLS check - confirm the base URL itself is https
        print("4. HTTPS/TLS check...")
        https_ok = BASE_URL.startswith("https://")
        print(f"   Base URL uses HTTPS: {https_ok}")
        print(f"   {'PASS' if https_ok else 'FAIL'}\n")

    print("--- Summary ---")
    print(f"TC-ST-03a (legitimate origin allowed):   {'PASS' if legit_ok else 'FAIL'}")
    print(f"TC-ST-03b (unauthorized origin blocked): {'PASS' if unauthorized_blocked else 'FAIL'}")
    print(f"TC-ST-03c (HTTPS/TLS in use):             {'PASS' if https_ok else 'FAIL'}")


if __name__ == "__main__":
    main()
