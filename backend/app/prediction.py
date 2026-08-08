import asyncio
import json
import logging
import os
import time

import joblib
import numpy as np
import pandas as pd
import shap
from fastapi import HTTPException

from app.config import settings
from app.ml_data.feature_schema import FEATURE_NAMES

logger = logging.getLogger(__name__)

# --- Model + explainer (loaded once at startup) ---

try:
    model = joblib.load(settings.MODEL_PATH)
except Exception as e:
    logger.error(f"Could not load model: {e}")
    model = None

try:
    explainer = shap.TreeExplainer(model) if model is not None else None
except Exception as e:
    logger.warning(f"SHAP explainer could not be created: {e}")
    explainer = None

try:
    _ranges_path = os.path.join(os.path.dirname(settings.MODEL_PATH), "training_ranges.json")
    with open(_ranges_path) as f:
        TRAINING_RANGES = json.load(f)
except Exception as e:
    logger.warning(f"Could not load training ranges: {e}")
    TRAINING_RANGES = {}

# Model feature name -> API field name
SCHEMA_MAPPING = {
    "workshops_certifications": "certifications",
    "aptitude_test_score": "aptitude_score",
    "active_backlog_count": "backlogs",
}

GRACE = 0.15  # ignore anything within 15% of the range width past the boundary
PENALTY_SLOPE = 0.05
PENALTY_CAP_PER_FIELD = 0.15
MAX_TOTAL_PENALTY = 0.5

KEY_FACTOR_MESSAGES = {
    "cgpa": {"high": "strong CGPA", "low": "CGPA below placement threshold", "mid": "CGPA slightly below peer average"},
    "internships": {"high": "multiple internships completed", "low": "no internships completed yet", "mid": "few internships, consider gaining more experience"},
    "projects": {"high": "impressive project portfolio", "low": "limited project experience", "mid": "moderate number of projects"},
    "workshops_certifications": {"high": "extensive certifications and workshops", "low": "no certifications or workshops", "mid": "some certifications/workshops"},
    "aptitude_test_score": {"high": "high aptitude test score", "low": "low aptitude test score", "mid": "average aptitude test score"},
    "soft_skills_rating": {"high": "excellent soft-skills rating", "low": "soft-skills rating needs improvement", "mid": "average soft-skills rating"},
    "extracurricular_activities": {"high": "active in extracurricular activities", "low": "no extracurricular involvement", "mid": "some extracurricular activities"},
    "placement_training": {"high": "completed placement training", "low": "did not complete placement training", "mid": "partial placement training"},
    "active_backlog_count": {"high": "multiple active backlogs (risk)", "low": "no active backlogs", "mid": "few active backlogs"},
}

# For most features, a higher raw value is "better" (higher percentile -> "high" bucket
# stays "high"). Backlogs are the opposite - a higher value is worse, so its bucket
# needs inverting relative to the others when deciding strength vs weakness wording.
INVERTED_FEATURES = {"active_backlog_count"}


def _bucket_for(pct: float) -> str:
    if pct <= 0.25:
        return "low"
    if pct >= 0.75:
        return "high"
    return "mid"


def _key_factors(X: np.ndarray, profile_data: dict) -> dict:
    """Top-3 features driving this specific prediction, as human-readable messages."""
    if explainer is None:
        return {}
    try:
        shap_vals = explainer.shap_values(X)
        # SHAP's return shape varies by version:
        #  - list of one array per class: [class0_array, class1_array]
        #  - single ndarray shaped (n_samples, n_features, n_classes)
        #  - single ndarray shaped (n_samples, n_features) for binary/regression output
        # Always resolve to a flat 1D array of per-feature contributions for class 1 ("Placed").
        if isinstance(shap_vals, list) and len(shap_vals) >= 2:
            shap_arr = np.array(shap_vals[1])[0]
        else:
            arr = np.array(shap_vals)
            if arr.ndim == 3:
                shap_arr = arr[0, :, 1]
            else:
                shap_arr = arr[0]

        abs_total = np.sum(np.abs(shap_arr))
        if abs_total == 0:
            return {}

        ranked = np.argsort(-np.abs(shap_arr))
        top_idxs = [i for i in ranked if np.abs(shap_arr[i]) >= 0.01 * abs_total][:3]

        factors = {}
        for idx in top_idxs:
            feat_name = FEATURE_NAMES[idx]
            api_field = SCHEMA_MAPPING.get(feat_name, feat_name)
            raw_val = profile_data.get(api_field)

            rng = TRAINING_RANGES.get(feat_name)
            pct = 0.5
            if rng and isinstance(raw_val, (int, float)):
                width = rng["max"] - rng["min"]
                if width > 0:
                    pct = (raw_val - rng["min"]) / width

            bucket = _bucket_for(pct)
            if feat_name in INVERTED_FEATURES and bucket != "mid":
                bucket = "low" if bucket == "high" else "high"

            template = KEY_FACTOR_MESSAGES.get(feat_name, {})
            factors[api_field] = template.get(bucket, f"{api_field} influenced this result")

        return factors
    except Exception as e:
        logger.warning(f"Key-factor computation failed: {e}")
        return {}


def _out_of_range_penalty(value: float, feature_name: str) -> float:
    rng = TRAINING_RANGES.get(feature_name)
    if not rng:
        return 0.0
    width = rng["max"] - rng["min"]
    if width <= 0:
        return 0.0

    if value < rng["min"]:
        dist = (rng["min"] - value) / width
    elif value > rng["max"]:
        dist = (value - rng["max"]) / width
    else:
        return 0.0

    if dist <= GRACE:
        return 0.0
    return min((dist - GRACE) * PENALTY_SLOPE, PENALTY_CAP_PER_FIELD)


async def predict(profile_data: dict) -> tuple[bool, float, dict, list[str]]:
    if model is None:
        raise HTTPException(status_code=503, detail="Prediction service unavailable: model not loaded")

    def _run():
        features = []
        for feat in FEATURE_NAMES:
            key = SCHEMA_MAPPING.get(feat, feat)
            if feat in ("extracurricular_activities", "placement_training"):
                features.append(1 if profile_data.get(key) else 0)
            else:
                features.append(profile_data.get(key, 0))

        X = pd.DataFrame([features], columns=FEATURE_NAMES)

        if hasattr(model, "predict_proba"):
            proba = model.predict_proba(X)[0]
            if len(proba) > 1:
                confidence = float(proba[1])  # proba[1] = P(Placed)
                outcome = confidence >= 0.5
            else:
                outcome = bool(model.predict(X)[0])
                confidence = 1.0 if outcome else 0.0
        else:
            outcome = bool(model.predict(X)[0])
            confidence = 1.0 if outcome else 0.0

        return outcome, confidence, _key_factors(X, profile_data)

    try:
        start = time.time()
        outcome, confidence, key_factors = await asyncio.wait_for(asyncio.to_thread(_run), timeout=1.9)
        if (time.time() - start) > 0.5:
            logger.warning("Inference exceeded 500ms target")
    except asyncio.TimeoutError:
        raise HTTPException(status_code=503, detail="Prediction service unavailable: inference timeout")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Prediction service unavailable: {e}")

    total_penalty = 0.0
    out_of_range_fields = []
    numeric_features = [f for f in FEATURE_NAMES if f not in ("extracurricular_activities", "placement_training")]
    for feat in numeric_features:
        key = SCHEMA_MAPPING.get(feat, feat)
        penalty = _out_of_range_penalty(profile_data.get(key, 0), feat)
        if penalty > 0:
            out_of_range_fields.append(key)
            total_penalty += penalty

    confidence = max(0.0, confidence - min(total_penalty, MAX_TOTAL_PENALTY))
    return outcome, confidence, key_factors, out_of_range_fields
