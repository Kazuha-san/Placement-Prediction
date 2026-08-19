"""
TC-UT-04.x - Model Artifact Integration Sanity Checks

Requirement: NFR-1.6 (model accuracy - see note below)
Scope note:  Model TRAINING/accuracy validation is OUT OF SCOPE for this test
             suite - no training script or dataset ships in this repo, only
             the pre-trained artifact (placement_prediction_model.pkl).
             NFR-1.6 compliance (test_accuracy=0.8081 against an SRS minimum
             of 75%) is evidenced by `model_specification_report.md`
             (independently produced by the project author) and is CITED
             here, not re-verified by retraining.

What IS in scope and checked here:
  1. Artifact consistency - the loaded .pkl's hyperparameters match what
     model_specification_report.md documents, catching a "wrong/stale
     artifact deployed" class of integration bug.
  2. Prediction direction sanity - a strong vs. weak profile should produce
     outcomes/confidence in the expected relative direction, confirming the
     model is wired up correctly (correct feature order, no silent
     scrambling) end-to-end. This is a smoke test, not an accuracy claim.
"""
import pytest

from app.prediction import model

# Hyperparameters as documented in model_specification_report.md
REPORTED_HYPERPARAMETERS = {
    "n_estimators": 400,
    "min_samples_split": 15,
    "min_samples_leaf": 1,
    "max_features": "sqrt",
    "max_depth": 12,
    "class_weight": None,
}


class TestModelArtifactConsistency:
    def test_TC_UT_22_model_loaded_successfully(self):
        assert model is not None, "Model failed to load - see prediction.py startup logs"

    @pytest.mark.parametrize("param,expected", list(REPORTED_HYPERPARAMETERS.items()))
    def test_TC_UT_23_deployed_model_hyperparameters_match_report(self, param, expected):
        """
        Confirms the .pkl shipped in backend/app/ml_data/ is the same model
        described in model_specification_report.md - guards against an
        outdated or mismatched artifact being deployed silently.
        """
        actual_params = model.get_params()
        assert actual_params[param] == expected, (
            f"{param}={actual_params[param]!r} does not match reported "
            f"value {expected!r} in model_specification_report.md"
        )


class TestPredictionDirectionSanity:
    """
    Not an accuracy test. Confirms the model responds in the expected
    relative direction to obviously-strong vs. obviously-weak profiles,
    which would fail if feature order were scrambled or the wrong
    columns were being passed in.
    """

    STRONG_PROFILE = {
        "cgpa": 9.5,
        "internships": 4,
        "projects": 7,
        "certifications": 5,
        "aptitude_score": 95.0,
        "soft_skills_rating": 4.8,
        "extracurricular_activities": True,
        "placement_training": True,
        "backlogs": 0,
    }

    WEAK_PROFILE = {
        "cgpa": 4.5,
        "internships": 0,
        "projects": 0,
        "certifications": 0,
        "aptitude_score": 25.0,
        "soft_skills_rating": 1.5,
        "extracurricular_activities": False,
        "placement_training": False,
        "backlogs": 5,
    }

    @pytest.mark.asyncio
    async def test_TC_UT_24_strong_profile_confidence_exceeds_weak_profile(self):
        from app.prediction import predict

        strong_outcome, strong_conf, _, _ = await predict(self.STRONG_PROFILE)
        weak_outcome, weak_conf, _, _ = await predict(self.WEAK_PROFILE)

        assert strong_conf > weak_conf, (
            f"Strong profile confidence ({strong_conf}) should exceed weak "
            f"profile confidence ({weak_conf}) - possible feature order or "
            f"schema mapping bug"
        )

    @pytest.mark.asyncio
    async def test_TC_UT_25_strong_profile_predicted_placed(self):
        from app.prediction import predict

        outcome, confidence, _, _ = await predict(self.STRONG_PROFILE)
        assert outcome is True, (
            f"Strong profile predicted outcome={outcome} (confidence={confidence}) "
            f"- expected 'Placed' for a clearly strong profile"
        )
