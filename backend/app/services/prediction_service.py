import json
import joblib
import asyncio
import time
import logging
import os
from fastapi import HTTPException
from app.core.config import settings
import numpy as np
from app.ml.feature_schema import FEATURE_NAMES

# Load model and training ranges on startup
try:
    model = joblib.load(settings.MODEL_PATH)
except Exception:
    model = None

try:
    training_ranges_path = os.path.join(os.path.dirname(settings.MODEL_PATH), "training_ranges.json")
    with open(training_ranges_path, "r") as f:
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
        # Map model feature names to API schema names
        schema_mapping = {
            "workshops_certifications": "certifications",
            "aptitude_test_score": "aptitude_score",
            "active_backlog_count": "backlogs"
        }

        # Feature order based on feature_schema.py
        features = []
        for feat in FEATURE_NAMES:
            schema_key = schema_mapping.get(feat, feat)
            if feat in ["extracurricular_activities", "placement_training"]:
                features.append(1 if profile_data.get(schema_key) else 0)
            else:
                features.append(profile_data.get(schema_key, 0))
        X = np.array([features])
        
        # Scikit-learn interface
        if hasattr(model, 'predict_proba'):
            # Verified: "placement_status" was encoded as {"placed": 1, "notplaced": 0}
            # in the dataset preprocessing notebook, so proba[1] = confidence of "Placed"
            proba = model.predict_proba(X)[0]
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
        start_time = time.time()
        # Overall budget timeout (NFR-1.1 2s max)
        outcome, confidence, limiting_features = await asyncio.wait_for(
            asyncio.to_thread(do_predict), timeout=1.9
        )
        end_time = time.time()
        # Performance target (NFR-3.1 500ms max)
        if (end_time - start_time) > 0.5:
            logging.warning("Inference exceeded 500ms timeout")
    except asyncio.TimeoutError:
        logging.error("Inference exceeded 2-second timeout")
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
