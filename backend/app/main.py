from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import auth, predict, history, progress

app = FastAPI(title="Placement Predictions Backend")

# CORS config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Should be restricted in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(predict.router, prefix="/predict", tags=["Prediction"])
app.include_router(history.router, prefix="/history", tags=["History"])
app.include_router(progress.router, prefix="/progress", tags=["Progress"])

@app.get("/health")
def health_check():
    return {"status": "ok"}
