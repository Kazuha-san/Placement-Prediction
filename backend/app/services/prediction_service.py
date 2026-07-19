import json
import joblib
import asyncio
from fastapi import HTTPException
from app.core.config import settings
import numpy as np

# Load model and training ranges on startup
try:
    model = joblib.load(settings.MODEL_PATH)
except Exception:
    model = None

try:
    with open("app/ml/training_ranges.json", "r") as f:
        training_ranges = json.load(f)
except Exception:
    training_ranges = {}

def compute_penalty(value: float, feature_name: str) -> float:
    if feature_name not in training_ranges:
        return 0.0
    
    rng = training_ranges[feature_name]
    min_val = rng["min"]
    max_val = rng["max"]
    width = max_val - min_val
    if width <= 0:
        return 0.0
        
    if value < min_val:
        dist = (min_val - value) / width
    elif value > max_val:
        dist = (value - max_val) / width
    else:
        return 0.0
        
    # Scale by e.g. 0.1 per width unit, capped at 0.3
    penalty = min(dist * 0.1, 0.3)
    return penalty

async def predict(profile_data: dict) -> tuple[bool, float, dict]:
    if model is None:
        raise HTTPException(status_code=503, detail="Prediction service unavailable: Model not loaded")
        
    def do_predict():
        # Feature order based on feature_schema.py mock
        features = [
            profile_data.get("cgpa", 0),
            profile_data.get("internships", 0),
            profile_data.get("projects", 0),
            profile_data.get("certifications", 0),
            profile_data.get("aptitude_score", 0),
            profile_data.get("soft_skills_rating", 0),
            1 if profile_data.get("extracurricular_activities") else 0,
            1 if profile_data.get("placement_training") else 0,
            profile_data.get("backlogs", 0)
        ]
        X = np.array([features])
        
        # Scikit-learn interface
        if hasattr(model, 'predict_proba'):
            proba = model.predict_proba(X)[0]
            # Assumes class 1 is "Placed"
            if len(proba) > 1:
                confidence = float(proba[1])
                outcome = confidence >= 0.5
            else:
                outcome = bool(model.predict(X)[0])
                confidence = 1.0 if outcome else 0.0
        else:
            outcome = bool(model.predict(X)[0])
            confidence = 1.0 if outcome else 0.0
            
        # Mock limiting features
        limiting_features = {"cgpa": features[0]} if not outcome else {}
        return outcome, confidence, limiting_features

    try:
        # Wrap inference in an async timeout (NFR-3.1 500ms max)
        outcome, confidence, limiting_features = await asyncio.wait_for(
            asyncio.to_thread(do_predict), timeout=0.5
        )
    except asyncio.TimeoutError:
        print("Inference exceeded 500ms timeout")
        raise HTTPException(status_code=503, detail="Prediction service unavailable: Inference timeout")
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Prediction service unavailable: {str(e)}")

    # Apply Out-of-Training-Range Confidence Penalty
    cgpa_val = profile_data.get("cgpa", 0)
    aptitude_val = profile_data.get("aptitude_score", 0)
    
    # note that the feature name in training_ranges is 'aptitude_test_score' but the schema is 'aptitude_score'
    cgpa_penalty = compute_penalty(cgpa_val, "cgpa")
    aptitude_penalty = compute_penalty(aptitude_val, "aptitude_test_score")
    
    total_penalty = min(cgpa_penalty + aptitude_penalty, 0.5) # Cap total penalty
    
    # Adjust confidence, keep in [0, 1]
    confidence = max(0.0, confidence - total_penalty)
    
    return outcome, confidence, limiting_features
