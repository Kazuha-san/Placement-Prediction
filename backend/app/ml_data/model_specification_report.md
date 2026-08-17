# Placement Prediction Model -- Specification & Training Report

**Model version:** 2.0.0
**Trained on:** 2026-07-20
**Algorithm:** RandomForestClassifier
**Dataset version:** v1_50000

## Input Features

- cgpa
- internships
- projects
- workshops_certifications
- aptitude_test_score
- soft_skills_rating
- extracurricular_activities
- placement_training
- active_backlog_count

## Hyperparameters

| Parameter | Value |
|---|---|
| n_estimators | 400 |
| min_samples_split | 15 |
| min_samples_leaf | 1 |
| max_features | sqrt |
| max_depth | 12 |
| class_weight | None |

## Cross-Validation Results (5-fold, training set)

| Metric | Mean | Std |
|---|---|---|
| accuracy | 0.8109 | 0.0048 |
| precision | 0.8127 | 0.0045 |
| recall | 0.8045 | 0.0088 |
| f1 | 0.8086 | 0.0054 |
| roc_auc | 0.8923 | 0.0040 |

## Test Set Performance

| Metric | Value |
|---|---|
| Accuracy | 0.8081 |
| Precision | 0.8108 |
| Recall | 0.8002 |
| F1 Score | 0.8054 |
| ROC-AUC | 0.8927 |

## Overfitting Check

| Split | Accuracy |
|---|---|
| Train | 0.8744 |
| Cross-validation (mean) | 0.8109 |
| Test | 0.8081 |

## SRS Compliance

SRS v1.0 requires a minimum accuracy of 75%. Achieved test accuracy: 80.81%. **PASS**

## Files Produced

- `placement_prediction_model.pkl`
- `placement_prediction_model_metadata.json`
- `model_specification_report.md`