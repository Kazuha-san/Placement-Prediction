"""
TC-ST-01 - System/Black-Box Test: Rate Limiting on POST /predict/

Requirement: NFR-2.4 - per-IP rate limiting, 15 requests/minute on /predict/
Run against: the LIVE deployed backend (not local, not integration test DB)

Run:
    python testing/system/test_rate_limiting.py

This is a standalone script (not pytest) so it can be run directly and its
printed output pasted back verbatim into the results file.
"""
import time

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
    print(f"TC-ST-01: Rate limiting test against {BASE_URL}/predict/")
    print("Sending 20 rapid guest prediction requests (limit should be 15/minute)...\n")

    results = []
    with httpx.Client(timeout=30) as client:
        for i in range(1, 21):
            start = time.time()
            resp = client.post(f"{BASE_URL}/predict/", json=VALID_PROFILE)
            elapsed = time.time() - start
            results.append((i, resp.status_code, round(elapsed, 3)))
            print(f"  Request {i:2d}: status={resp.status_code}  time={elapsed:.3f}s")

    ok_count = sum(1 for _, s, _ in results if s == 200)
    limited_count = sum(1 for _, s, _ in results if s == 429)

    print(f"\n--- Summary ---")
    print(f"200 OK responses:        {ok_count}")
    print(f"429 Too Many Requests:   {limited_count}")

    if ok_count <= 15 and limited_count > 0:
        print("RESULT: PASS - rate limiting engaged at/around the 15/minute threshold")
    elif ok_count > 15:
        print(f"RESULT: FAIL - {ok_count} requests succeeded, expected cap at 15/minute")
    else:
        print("RESULT: INCONCLUSIVE - no 429s seen; re-check limiter config or run again")


if __name__ == "__main__":
    main()
