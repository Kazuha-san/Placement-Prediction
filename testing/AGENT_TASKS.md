# QA Test Execution — Agent Instructions

You are running the test suite in `testing/` and reporting results back.
**Do not modify anything under `backend/` or `frontend/`** — this is a
testing-only task; the application source is off-limits.

Do the tasks below in order. For each one, capture the **full terminal
output** and paste it into `testing/docs/RESULTS.md` under the matching
heading (the template is already there — just fill in the blanks, don't
restructure it).

---

## Task 1 — Environment setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
cd ..
pip install -r testing/requirements.txt
```

Report: Python version (`python --version`), whether install succeeded cleanly.

---

## Task 2 — Unit tests (no external dependencies needed)

```bash
pytest testing/unit/ -v --cov=app.prediction --cov=app.schemas --cov-branch --cov-report=term-missing
```

Report: full output, including the final pass/fail count and the coverage table.

Note: `testing/unit/test_model_artifact.py` checks that the deployed
`.pkl`'s hyperparameters match `testing/docs/model_specification_report.md`,
and does a prediction-direction sanity check (strong profile vs. weak
profile). This is NOT re-validating model accuracy — that's out of scope
and already covered by the cited report — just confirming the artifact is
correctly wired up.

---

## Task 3 — Integration tests (needs a disposable Postgres)

**Do NOT use the production Supabase database.** Options, pick whichever is
easiest on your machine:

- Local Postgres via Docker:
  ```bash
  docker run --name placement-test-db -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:16
  ```
- Or any other local/disposable Postgres instance you already have.

Then:

```bash
export TEST_DATABASE_URL="postgresql+asyncpg://postgres:postgres@localhost:5432/placement_test"
pytest testing/integration/ -v
```

(On Windows PowerShell: `$env:TEST_DATABASE_URL = "postgresql+asyncpg://postgres:postgres@localhost:5432/placement_test"`)

Report: full output, pass/fail count. If any test fails, include the full
traceback, not just the summary line.

**If a test genuinely fails** (not an environment/setup issue), don't fix
the application code to make it pass — that's not your job here. Just
report it as-is; it'll get logged as a defect.

---

## Task 4 — System tests (run against the LIVE deployed backend)

These hit `https://placement-prediction-xg2e.onrender.com` over the real
network. No local server needed for this part.

```bash
python testing/system/test_rate_limiting.py
python testing/system/test_latency.py
python testing/system/test_cors_and_headers.py
python testing/system/test_pii_and_guest_flow.py
```

Run them **one at a time**, a few seconds apart (some deliberately send
bursts of requests to test rate limiting — running them back-to-back may
cause later scripts to see 429s that aren't a real failure, just leftover
rate-limit state from the previous script).

Report: full output of each script.

---

## Task 5 — Confirm demo login is enabled on the deployed backend

```bash
curl -i -X POST https://placement-prediction-xg2e.onrender.com/auth/demo
```

Report: status code and response body. (Expect `200` with a `Set-Cookie`
header and user info if demo login is enabled; `404 Demo login is disabled`
if it isn't.)

---

## When done

Make sure `testing/docs/RESULTS.md` has all five sections filled in with
real output (not summarized or paraphrased — actual terminal output), then
let the user know it's ready to hand back.

---

## Task 6 — Additional integration tests (account deletion + timeout handling)

New test file: `testing/integration/test_account_deletion_and_timeout.py`
(closes previously "Not Covered" gaps: FR-2.7, FR-4.4, NFR-1.4, NFR-1.5).
No new dependencies needed - uses the same Postgres container from Task 3.

```bash
pytest testing/integration/test_account_deletion_and_timeout.py -v
```

Add a new "Task 6 — Additional Integration Tests" section to
`testing/docs/RESULTS.md` with the full output.

---

## Task 7 — JMeter load test (NFR-1.2, NFR-1.3)

Requires Apache JMeter (already installed) and Java (already installed).
Test plan: `testing/system/nfr_load_test.jmx`

Run from **CLI mode**, not the GUI (the GUI is only for editing test plans):

```bash
cd path\to\apache-jmeter-5.6.3\bin
.\jmeter.bat -n -t path\to\testing\system\nfr_load_test.jmx -l results.jtl -e -o report_output
```

This runs two thread groups:
- 100 concurrent users against `/health` (tests NFR-1.2 raw server capacity)
- A throttled, sustained stream against `/predict/` at ~8 req/min combined,
  well under the 15/min rate limit, for NFR-1.3 throughput/degradation

When it finishes, JMeter prints a summary to the console and writes a full
HTML report to `report_output/index.html`. Open that report and note, for
each thread group:
- Number of samples, error %, average/min/max response time, throughput

Add a new "Task 7 — JMeter Load Test" section to `testing/docs/RESULTS.md`
with: the console summary output, and the key numbers from the HTML report
(samples, error %, avg/min/max response time, throughput) for each of the
two thread groups.

---

## Task 8 — Selenium UI tests

```bash
pip install -r testing/selenium/requirements.txt
pytest testing/selenium/test_ui_flows.py -v
```

This opens real Chrome browser windows and drives them against the live
deployed frontend. Let it run to completion (don't close the browser
windows manually).

Add a new "Task 8 — Selenium UI Tests" section to `testing/docs/RESULTS.md`
with the full pytest output.

---

## Task 9 — Combined Unit + Integration Coverage

The Task 2 coverage report only measured unit tests, which is why
app/prediction.py showed 75% instead of its true coverage - the async
predict() function is exercised by integration tests (Task 3/6), which ran
in a separate pytest process and were never combined into one report.

Run unit and integration together, in the same pytest invocation, against
the same running Postgres container from Task 3:

```bash
export TEST_DATABASE_URL="postgresql+asyncpg://postgres:postgres@localhost:5432/placement_test"
pytest testing/unit/ testing/integration/ --cov=app.prediction --cov=app.schemas --cov-branch --cov-report=term-missing -v
```

Add a new "Task 9 — Combined Coverage" section to `testing/docs/RESULTS.md`
with the full output, including the final coverage table. This is the real,
combined coverage number to use in the final report - not the Task 2 number.
