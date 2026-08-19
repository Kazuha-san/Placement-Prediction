# Placement Predictions — Test Suite

QA suite for the Placement Predictions app, structured per IEEE 829 /
ISO 29119: Unit → Integration → System → Acceptance. Lives entirely under
`testing/`, separate from application source (`backend/`, `frontend/`).

## Folder structure

```
testing/
├── unit/              TC-UT-xx / TC-VAL-xx  — White-Box, no DB/network
├── integration/        TC-IT-xx              — Gray-Box, real Postgres, no network
├── system/             TC-ST-xx              — Black-Box, run against live deployed URLs
├── docs/                                     — IEEE 829 Test Plan & Execution Report
├── conftest.py                               — shared env-var setup
├── pytest.ini
└── requirements.txt
```

## 1. Unit tests — run these first, no setup needed

Tests `backend/app/prediction.py` (penalty calculator, percentile bucketing)
and `backend/app/schemas.py` (ProfileCreate field validation) directly, with
dummy env vars standing in for real secrets/DB credentials. No network, no
database, no deployed system required.

```bash
cd backend && pip install -r requirements.txt
cd ..
pip install -r testing/requirements.txt
pytest testing/unit/ -v
```

With coverage (statement + branch):

```bash
pytest testing/unit/ --cov=app.prediction --cov=app.schemas --cov-branch --cov-report=term-missing
```

**Expected: all tests pass.** Last run: 62/62 passed.

## 2. Integration tests — need a disposable Postgres database

`backend/app/models.py` uses Postgres-specific `JSONB`/`UUID` column types,
so these tests need a **real Postgres instance** — SQLite won't work.

**Do not point this at your production Supabase database** — the suite
drops and recreates all tables at the start of the session, and truncates
data between tests.

Options:
- A local Postgres (`docker run -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres`)
- A second, disposable Supabase project/branch used only for testing

```bash
export TEST_DATABASE_URL="postgresql+asyncpg://postgres:postgres@localhost:5432/placement_test"
pytest testing/integration/ -v
```

If `TEST_DATABASE_URL` isn't set, it defaults to
`postgresql+asyncpg://postgres:postgres@localhost:5432/placement_test`.

## 3. System tests — run against the live deployed system

Scripts under `testing/system/` hit the real deployed backend
(`https://placement-prediction-xg2e.onrender.com`) and frontend over the
network. These must be run from your machine — Claude's sandbox cannot
reach `onrender.com` / `vercel.app`.

```bash
pytest testing/system/ -v
```

See `testing/system/README.md` (added alongside the scripts) for what each
one checks and how to interpret results.

## 4. Acceptance tests — manual

Walked through manually against SRS Use Cases UC-01–UC-04 in a real
browser. Results are recorded directly into
`testing/docs/02_Test_Execution_Report.docx`, not automated here.

## Notes

- Demo login (`POST /auth/demo`) is temporarily enabled on the deployed
  backend for QA purposes — disable it again (`ENABLE_DEMO_LOGIN=False`)
  after testing wraps up.
- Rate limiting on `/predict/` is 15 requests/minute per IP. If you re-run
  the full integration + system suites back-to-back rapidly, you may hit
  it — space out reruns or wait ~60s if you see unexpected 429s.
