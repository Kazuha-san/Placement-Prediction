# Placement Predictions Backend

This is the backend service for the **Placement Predictions** web application. It is built using FastAPI and integrates with a Random Forest model to provide predictions based on student profiles.

## Tech Stack
- **Framework:** FastAPI
- **Database:** PostgreSQL (Supabase)
- **ORM:** SQLAlchemy (async) + Alembic
- **Machine Learning:** scikit-learn (Joblib)

## Prerequisites
- Python 3.12
- A running PostgreSQL database (e.g., Supabase)

## Setup and Installation

1. **Activate the Virtual Environment**
   Navigate to the `backend` folder and activate the virtual environment located in `Source/.venv`:
   ```bash
   ..\.venv\Scripts\activate
   ```

2. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Environment Variables**
   Ensure your `.env` file contains your database credentials and OAuth secrets:
   ```env
   DATABASE_URL_DIRECT=postgresql+asyncpg://<postgres-user>:<password>@<db-host>:5432/postgres
   DATABASE_URL=postgresql+asyncpg://<postgres-user>:<password>@<pooler-host>:5432/postgres
   JWT_SECRET=your-super-secret-key
   ...
   ```

4. **Database Migrations**
   Run Alembic to apply the latest schema to your database:
   ```bash
   alembic upgrade head
   ```

5. **Run the Server**
   Start the FastAPI app locally with Uvicorn:
   ```bash
   uvicorn app.main:app --reload
   ```
   The API will be accessible at `http://localhost:8000`. You can view the interactive documentation at `http://localhost:8000/docs`.

## Project Structure
- `app/api/`: API routing and dependency injection (`deps.py`).
- `app/core/`: Configuration and security (JWT).
- `app/db/`: SQLAlchemy setup and sessions.
- `app/ml/`: Mock ML models and configuration files.
- `app/models/`: SQLAlchemy ORM database models.
- `app/schemas/`: Pydantic validation schemas.
- `app/services/`: Core logic like the prediction inference service.
- `alembic/`: Database migration scripts.
