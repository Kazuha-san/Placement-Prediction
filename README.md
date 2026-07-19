# Placement Predictions

A full-stack application that evaluates a student's academic profile to predict their placement outcome using a machine learning model. The system provides an interactive dashboard, historical prediction tracking, and a progress view.

## Repository Structure

- [`backend/`](./backend/) - FastAPI application with the ML prediction service and PostgreSQL database interactions.
- [`frontend/`](./frontend/) - React + Vite frontend providing the user interface.
- [`SRS_PlacementPredictions.md`](./SRS_PlacementPredictions.md) - Software Requirements Specification.

For setup and execution instructions, please refer to the specific README files in each subdirectory:
- [Backend Setup Guide](./backend/README.md)
- [Frontend Setup Guide](./frontend/README.md)

## Known Limitations / Placeholder Status

> [!WARNING]
> This repository currently contains some mocked artifacts to unblock parallel development:
> - **OAuth Flow**: The Google/Microsoft sign-in flow securely passes an `httpOnly` cookie from backend to frontend, but currently uses a mocked backend identity and does not verify real OAuth tokens yet (tracked for Stage 2).
