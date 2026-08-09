# Placement Predictions Backend

FastAPI backend for the **Placement Predictions** app. Takes a student's academic
profile, runs it through a trained RandomForest model, and returns a placement
confidence score along with a short SHAP-based explanation of what drove that
specific prediction.

## Tech stack
- **Framework:** FastAPI (async)
- **Database:** PostgreSQL via Supabase
- **ORM:** SQLAlchemy (async) + Alembic for migrations
- **ML:** scikit-learn RandomForest + SHAP for per-prediction explanations
- **Auth:** Google OAuth2, JWT in an httpOnly cookie
- **Rate limiting:** slowapi (15 requests/minute per IP on `/predict/`)

## Prerequisites
- Python 3.12
- A Supabase (or any Postgres) database
- A Google Cloud OAuth 2.0 client (for Google sign-in)

## Setup

1. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Environment variables** — copy `.env.example` to `.env` and fill in real values:
   ```env
   DATABASE_URL=...              # Supabase pooler connection string
   DATABASE_URL_DIRECT=...       # Supabase direct connection string
   JWT_SECRET=...                # random secret - see note below
   JWT_EXPIRY_MINUTES=10080      # 7 days
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback
   FRONTEND_URL=http://localhost:5173
   ENVIRONMENT=development       # "production" once deployed - see note below
   ENABLE_DEMO_LOGIN=True        # toggles the reviewer/demo account entirely
   ```

   Generate a real `JWT_SECRET` (don't ship the placeholder):
   ```bash
   python -c "import secrets; print(secrets.token_urlsafe(48))"
   ```

3. **Run database migrations**
   ```bash
   alembic upgrade head
   ```

4. **(Optional) Seed the demo/reviewer account**, so anyone using the "demo
   student" login on the sign-in page sees a fully populated app instead of
   an empty one. Safe to re-run any time - it clears and re-seeds on each run.
   ```bash
   python seed_demo.py
   ```

5. **Run the server**
   ```bash
   uvicorn app.main:app --reload
   ```
   API at `http://localhost:8000`, interactive docs at `http://localhost:8000/docs`.

   From the repo root, `python scripts/run_dev.py` (or `scripts/run_dev.bat`
   on Windows) starts this and the frontend dev server together.

## `ENVIRONMENT` and cookies - read this before deploying

Login/session cookies need different settings locally vs. once deployed:

- **`development`** (default): plain `http://localhost` cookies. Cross-origin
  `Secure` cookies get silently dropped by the browser over plain HTTP, so this
  is required for local login to work at all.
- **`production`**: switches cookies to `SameSite=None; Secure`, required once
  frontend and backend live on different HTTPS domains (e.g. Vercel + Render).

Set `ENVIRONMENT=production` in Render's environment variables once deployed -
leave it as `development` locally.

## Keeping a free-tier deploy awake

`GET /health` is a plain liveness check (used as Render's health check path).
`GET /health/db` also runs a trivial query against the database - use this one
for any external uptime pinger (e.g. cron-job.org), since it's what actually
resets Supabase's inactivity timer, not just Render's.

## Project structure

Flat by design - most things are one file per concern rather than nested
per-type folders:

```
app/
  main.py           FastAPI app, CORS, rate limiter, routers, health checks
  config.py         Settings (env vars) incl. cookie behavior per environment
  security.py       JWT creation
  db.py             Async engine/session/Base
  models.py         SQLAlchemy models: User, Profile, Prediction
  schemas.py        Pydantic request/response schemas
  deps.py           Auth dependencies (get_current_user, get_current_user_or_guest)
  auth_service.py   OAuth user lookup/creation + the demo account
  prediction.py     Model loading, inference, SHAP-based key factors
  rate_limit.py     Shared slowapi Limiter instance
  routers/
    auth.py         Google OAuth, demo login, /me (get/update/delete), guest, logout
    predict.py      POST /predict/
    history.py      GET /history/ (joins each prediction with its profile)
    progress.py     GET /progress/
  ml_data/          Trained model (.pkl), feature schema, training ranges (data, not code)
alembic/            Migrations
seed_demo.py        One-time/rerunnable script to seed the demo account's history
```

## API docs

Full interactive schema at `/docs` (Swagger) or `/redoc` once the server is running.
