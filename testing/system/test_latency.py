"""
TC-ST-02 - System/Black-Box Test: Prediction Response Latency

Requirement: NFR-1.1 (end-to-end response time), NFR-1.4 (inference <500ms),
             NFR-1.5 (timeout fallback), FR-4.4
Run against: the LIVE deployed backend

Run:
    python testing/system/test_latency.py

Note: Render free-tier instances spin down when idle - the FIRST request may
take 30-60s+ as the instance cold-starts. This script fires a warm-up request
before timing, and reports both figures separately.
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

NFR_1_1_TARGET_SECONDS = 2.0  # adjust if SRS specifies a different overall response target
SAMPLE_COUNT = 10


def main():
    print(f"TC-ST-02: Latency test against {BASE_URL}/predict/\n")

    with httpx.Client(timeout=90) as client:
        print("Warm-up request (handles Render cold start, not counted in results)...")
        warm_start = time.time()
        warm_resp = client.post(f"{BASE_URL}/predict/", json=VALID_PROFILE)
        warm_elapsed = time.time() - warm_start
        print(f"  Warm-up: status={warm_resp.status_code}  time={warm_elapsed:.3f}s\n")

        print(f"Timing {SAMPLE_COUNT} subsequent requests...")
        timings = []
        for i in range(1, SAMPLE_COUNT + 1):
            start = time.time()
            resp = client.post(f"{BASE_URL}/predict/", json=VALID_PROFILE)
            elapsed = time.time() - start
            timings.append(elapsed)
            print(f"  Request {i:2d}: status={resp.status_code}  time={elapsed:.3f}s")
            time.sleep(1)  # stay well under the 15/min rate limit

    avg = sum(timings) / len(timings)
    worst = max(timings)
    best = min(timings)

    print(f"\n--- Summary (warm requests only, cold start excluded) ---")
    print(f"Average: {avg:.3f}s")
    print(f"Best:    {best:.3f}s")
    print(f"Worst:   {worst:.3f}s")
    print(f"Cold-start (first request): {warm_elapsed:.3f}s")

    if avg <= NFR_1_1_TARGET_SECONDS:
        print(f"RESULT: PASS - average {avg:.3f}s is within the {NFR_1_1_TARGET_SECONDS}s target")
    else:
        print(f"RESULT: FAIL - average {avg:.3f}s exceeds the {NFR_1_1_TARGET_SECONDS}s target")

    print(
        "\nNote: this measures end-to-end HTTP round-trip (NFR-1.1), which includes "
        "network latency - not the same as the backend-only 500ms inference target "
        "(NFR-1.4), which is only visible in backend logs, not from the client side."
    )


if __name__ == "__main__":
    main()
