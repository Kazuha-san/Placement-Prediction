import json
import joblib
import asyncio
import time
import logging
import os
from fastapi import HTTPException
from app.core.config import settings
import numpy as np
import shap
from app.ml.feature_schema import FEATURE_NAMES

# Load model and training ranges on startup
try:
    model = joblib.load(settings.MODEL_PATH)
except Exception:
    model = None

# SHAP explainer creation (fails gracefully)
try:
    explainer = shap.TreeExplainer(model) if model is not None else None
except Exception as e:
    logging.warning(f"SHAP explainer could not be created: {e}")
    explainer = None

try:
    training_ranges_path = os.path.join(os.path.dirname(settings.MODEL_PATH), "training_ranges.json")
    with open(training_ranges_path, "r") as f:
        training_ranges = json.load(f)
except Exception:
    training_ranges = {}

SCHEMA_MAPPING = {
    "workshops_certifications": "certifications",
    "aptitude_test_score": "aptitude_score",
    "active_backlog_count": "backlogs"
}

GRACE = 0.15  # ignore anything within 15% of the range width past the boundary
PENALTY_SLOPE = 0.05
PENALTY_CAP_PER_FIELD = 0.15

# Message templates for SHAP-based limiting features
SHAP_MESSAGE_TEMPLATES = {
    "cgpa": {
        "high": "strong CGPA",
        "low": "CGPA below placement threshold",
        "mid": "CGPA slightly below peer average"
    },
    "internships": {
        "high": "multiple internships completed",
        "low": "no internships completed yet",
        "mid": "few internships, consider gaining more experience"
    },
    "projects": {
        "high": "impressive project portfolio",
        "low": "limited project experience",
        "mid": "moderate number of projects"
    },
    "workshops_certifications": {
        "high": "extensive certifications and workshops",
        "low": "no certifications or workshops",
        "mid": "some certifications/workshops"
    },
    "aptitude_test_score": {
        "high": "high aptitude test score",
        "low": "low aptitude test score",
        "mid": "average aptitude test score"
    },
    "soft_skills_rating": {
        "high": "excellent soft‑skills rating",
        "low": "soft‑skills rating needs improvement",
        "mid": "average soft‑skills rating"
    },
    "extracurricular_activities": {
        "high": "active in extracurricular activities",
        "low": "no extracurricular involvement",
        "mid": "some extracurricular activities"
    },
    "placement_training": {
        "high": "completed placement training",
        "low": "did not complete placement training",
        "mid": "partial placement training"
    },
    "active_backlog_count": {
        "high": "multiple active backlogs (risk)",
        "low": "no active backlogs",
        "mid": "few active backlogs"
    }
}

def _shap_limiting_features(X: np.ndarray, profile_data: dict) -> dict:
    """Compute top‑3 limiting features using SHAP values.
    Returns a dict mapping API field name to a human‑readable message.
    """
    if explainer is None:
        return {}
    try:
        shap_vals = explainer.shap_values(X)
        # Handle different return types (list for each class or single array)
        if isinstance(shap_vals, list) and len(shap_vals) >= 2:
            # Assuming class 1 is "Placed"
            shap_arr = np.array(shap_vals[1])[0]
        else:
            shap_arr = np.array(shap_vals)[0]
        abs_total = np.sum(np.abs(shap_arr))
        if abs_total == 0:
            return {}
        # Determine top features by absolute contribution
        contrib_idxs = np.argsort(-np.abs(shap_arr))  # descending
        top_idxs = []
        for idx in contrib_idxs:
            if len(top_idxs) >= 3:
                break
            if np.abs(shap_arr[idx]) >= 0.01 * abs_total:
                top_idxs.append(idx)
        limiting = {}
        for idx in top_idxs:
            feat_name = FEATURE_NAMES[idx]
            api_field = SCHEMA_MAPPING.get(feat_name, feat_name)
            raw_val = profile_data.get(api_field, None)
            # Determine percentile bucket
            rng = training_ranges.get(feat_name, None)
            if rng:
                min_v, max_v = rng["min"], rng["max"]
                width = max_v - min_v
                if width > 0 and isinstance(raw_val, (int, float)):
                    pct = (raw_val - min_v) / width
                else:
                    pct = 0.5
            else:
                pct = 0.5
            # Bucket
            if pct <= 0.25:
                bucket = "low"
            elif pct >= 0.75:
                bucket = "high"
            else:
                bucket = "mid"
            # Choose message based on SHAP sign and bucket
            sign = shap_arr[idx]
            # For features where higher is better (most), use positive sign as strength.
            # For active_backlog_count, higher is worse, so invert interpretation.
            if feat_name == "active_backlog_count":
                # Higher backlogs are negative
                if sign > 0:
                    # Positive SHAP means higher value hurts placed outcome
                    bucket = "high" if pct >= 0.75 else ("low" if pct <= 0.25 else "mid")
                else:
                    # Negative SHAP means lower backlogs help outcome
                    bucket = "low" if pct <= 0.25 else ("high" if pct >= 0.75 else "mid")
            # Retrieve message template
            tmpl = SHAP_MESSAGE_TEMPLATES.get(feat_name, {})
            message = tmpl.get(bucket, f"{api_field} influence")
            limiting[api_field] = message
        return limiting
    except Exception as e:
        logging.warning(f"SHAP limiting feature computation failed: {e}")
        return {}


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
        
    if dist <= GRACE:
        return 0.0
        
    return min((dist - GRACE) * PENALTY_SLOPE, PENALTY_CAP_PER_FIELD)

async def predict(profile_data: dict) -> tuple[bool, float, dict]:
    if model is None:
        raise HTTPException(status_code=503, detail="Prediction service unavailable: Model not loaded")
        
    def do_predict():
        # Feature order based on feature_schema.py
        features = []
        for feat in FEATURE_NAMES:
            schema_key = SCHEMA_MAPPING.get(feat, feat)
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
            
        # Compute limiting features using SHAP (if prediction is negative)
        limiting_features = {} if outcome else _shap_limiting_features(X, profile_data)
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
    total_penalty = 0.0
    out_of_range_fields = []
    
    # Check all numeric features (exclude booleans)
    numeric_features = [f for f in FEATURE_NAMES if f not in ["extracurricular_activities", "placement_training"]]
    
    for feat in numeric_features:
        schema_key = SCHEMA_MAPPING.get(feat, feat)
        val = profile_data.get(schema_key, 0)
        penalty = compute_penalty(val, feat)
        if penalty > 0:
            out_of_range_fields.append(schema_key)
            total_penalty += penalty
            
    total_penalty = min(total_penalty, 0.5) # Cap total penalty
    
    # Adjust confidence, keep in [0, 1]
    confidence = max(0.0, confidence - total_penalty)
    
    return outcome, confidence, limiting_features, out_of_range_fields
