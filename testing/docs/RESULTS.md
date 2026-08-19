# Test Execution Results

Filled in by the coding agent per `testing/AGENT_TASKS.md`. Paste raw
terminal output — do not summarize or edit it.

Date run: 2026-08-16
Machine/OS: Windows

---

## Task 1 — Environment Setup

Python version:
```
Python 3.11.9
```

Install result:
```
OK, no errors
```

---

## Task 2 — Unit Tests

```
============================= test session starts =============================
platform win32 -- Python 3.11.9, pytest-9.1.1, pluggy-1.6.0 -- D:\Projects\Placement Prediction Assignment\Codebase\Source\backend\.venv\Scripts\python.exe
cachedir: .pytest_cache
rootdir: D:\Projects\Placement Prediction Assignment\Codebase\Source\testing\testing
configfile: pytest.ini
plugins: anyio-4.14.2, asyncio-1.4.0, cov-7.1.0
asyncio: mode=Mode.AUTO, debug=False, asyncio_default_fixture_loop_scope=None, asyncio_default_test_loop_scope=function
collecting ... collected 71 items

testing\testing\unit\test_model_artifact.py::TestModelArtifactConsistency::test_TC_UT_22_model_loaded_successfully PASSED [  1%]
testing\testing\unit\test_model_artifact.py::TestModelArtifactConsistency::test_TC_UT_23_deployed_model_hyperparameters_match_report[n_estimators-400] PASSED [  2%]
testing\testing\unit\test_model_artifact.py::TestModelArtifactConsistency::test_TC_UT_23_deployed_model_hyperparameters_match_report[min_samples_split-15] PASSED [  4%]
testing\testing\unit\test_model_artifact.py::TestModelArtifactConsistency::test_TC_UT_23_deployed_model_hyperparameters_match_report[min_samples_leaf-1] PASSED [  5%]
testing\testing\unit\test_model_artifact.py::TestModelArtifactConsistency::test_TC_UT_23_deployed_model_hyperparameters_match_report[max_features-sqrt] PASSED [  7%]
testing\testing\unit\test_model_artifact.py::TestModelArtifactConsistency::test_TC_UT_23_deployed_model_hyperparameters_match_report[max_depth-12] PASSED [  8%]
testing\testing\unit\test_model_artifact.py::TestModelArtifactConsistency::test_TC_UT_23_deployed_model_hyperparameters_match_report[class_weight-None] PASSED [  9%]
testing\testing\unit\test_model_artifact.py::TestPredictionDirectionSanity::test_TC_UT_24_strong_profile_confidence_exceeds_weak_profile PASSED [ 11%]
testing\testing\unit\test_model_artifact.py::TestPredictionDirectionSanity::test_TC_UT_25_strong_profile_predicted_placed PASSED [ 12%]
testing\testing\unit\test_prediction_logic.py::TestOutOfRangePenalty::test_TC_UT_01_unknown_feature_returns_zero PASSED [ 14%]
testing\testing\unit\test_prediction_logic.py::TestOutOfRangePenalty::test_TC_UT_02_value_at_range_minimum_no_penalty PASSED [ 15%]
testing\testing\unit\test_prediction_logic.py::TestOutOfRangePenalty::test_TC_UT_03_value_at_range_maximum_no_penalty PASSED [ 16%]
testing\testing\unit\test_prediction_logic.py::TestOutOfRangePenalty::test_TC_UT_04_value_mid_range_no_penalty PASSED [ 18%]
testing\testing\unit\test_prediction_logic.py::TestOutOfRangePenalty::test_TC_UT_05_value_just_below_min_within_grace_no_penalty PASSED [ 19%]
testing\testing\unit\test_prediction_logic.py::TestOutOfRangePenalty::test_TC_UT_06_value_just_above_max_within_grace_no_penalty PASSED [ 21%]
testing\testing\unit\test_prediction_logic.py::TestOutOfRangePenalty::test_TC_UT_07_value_exactly_at_grace_boundary_no_penalty PASSED [ 22%]
testing\testing\unit\test_prediction_logic.py::TestOutOfRangePenalty::test_TC_UT_08_value_just_beyond_grace_below_min_has_small_penalty PASSED [ 23%]
testing\testing\unit\test_prediction_logic.py::TestOutOfRangePenalty::test_TC_UT_09_penalty_formula_matches_expected_calculation PASSED [ 25%]
testing\testing\unit\test_prediction_logic.py::TestOutOfRangePenalty::test_TC_UT_10_above_max_penalty_uses_same_formula_as_below_min PASSED [ 26%]
testing\testing\unit\test_prediction_logic.py::TestOutOfRangePenalty::test_TC_UT_11_extreme_out_of_range_value_penalty_is_capped PASSED [ 28%]
testing\testing\unit\test_prediction_logic.py::TestOutOfRangePenalty::test_TC_UT_12_negative_cgpa_extreme_value_penalty_capped PASSED [ 29%]
testing\testing\unit\test_prediction_logic.py::TestBucketFor::test_TC_UT_13_low_partition_representative_value PASSED [ 30%]
testing\testing\unit\test_prediction_logic.py::TestBucketFor::test_TC_UT_14_low_boundary_exact PASSED [ 32%]
testing\testing\unit\test_prediction_logic.py::TestBucketFor::test_TC_UT_15_just_above_low_boundary_is_mid PASSED [ 33%]
testing\testing\unit\test_prediction_logic.py::TestBucketFor::test_TC_UT_16_mid_partition_representative_value PASSED [ 35%]
testing\testing\unit\test_prediction_logic.py::TestBucketFor::test_TC_UT_17_just_below_high_boundary_is_mid PASSED [ 36%]
testing\testing\unit\test_prediction_logic.py::TestBucketFor::test_TC_UT_18_high_boundary_exact PASSED [ 38%]
testing\testing\unit\test_prediction_logic.py::TestBucketFor::test_TC_UT_19_high_partition_representative_value PASSED [ 39%]
testing\testing\unit\test_prediction_logic.py::TestBucketFor::test_TC_UT_20_pct_below_zero_still_classified_low PASSED [ 40%]
testing\testing\unit\test_prediction_logic.py::TestBucketFor::test_TC_UT_21_pct_above_one_still_classified_high PASSED [ 42%]
testing\testing\unit\test_schema_validation.py::TestValidProfile::test_TC_VAL_01_all_valid_values_accepted PASSED [ 43%]
testing\testing\unit\test_schema_validation.py::TestCgpaBoundaries::test_TC_VAL_02_cgpa_at_min_boundary_valid PASSED [ 45%]
testing\testing\unit\test_schema_validation.py::TestCgpaBoundaries::test_TC_VAL_03_cgpa_at_max_boundary_valid PASSED [ 46%]
testing\testing\unit\test_schema_validation.py::TestCgpaBoundaries::test_TC_VAL_04_cgpa_just_below_min_rejected PASSED [ 47%]
testing\testing\unit\test_schema_validation.py::TestCgpaBoundaries::test_TC_VAL_05_cgpa_just_above_max_rejected PASSED [ 49%]
testing\testing\unit\test_schema_validation.py::TestCgpaBoundaries::test_TC_VAL_06_cgpa_clearly_invalid_negative_rejected PASSED [ 50%]
testing\testing\unit\test_schema_validation.py::TestCgpaBoundaries::test_TC_VAL_07_cgpa_clearly_invalid_above_max_rejected PASSED [ 52%]
testing\testing\unit\test_schema_validation.py::TestBacklogsBoundaries::test_TC_VAL_08_backlogs_at_min_boundary_valid PASSED [ 53%]
testing\testing\unit\test_schema_validation.py::TestBacklogsBoundaries::test_TC_VAL_09_backlogs_at_max_boundary_valid PASSED [ 54%]
testing\testing\unit\test_schema_validation.py::TestBacklogsBoundaries::test_TC_VAL_10_backlogs_negative_rejected PASSED [ 56%]
testing\testing\unit\test_schema_validation.py::TestBacklogsBoundaries::test_TC_VAL_11_backlogs_above_max_rejected PASSED [ 57%]
testing\testing\unit\test_schema_validation.py::TestAptitudeScoreBoundaries::test_TC_VAL_12_aptitude_at_min_boundary_valid PASSED [ 59%]
testing\testing\unit\test_schema_validation.py::TestAptitudeScoreBoundaries::test_TC_VAL_13_aptitude_at_max_boundary_valid PASSED [ 60%]
testing\testing\unit\test_schema_validation.py::TestAptitudeScoreBoundaries::test_TC_VAL_14_aptitude_below_min_rejected PASSED [ 61%]
testing\testing\unit\test_schema_validation.py::TestAptitudeScoreBoundaries::test_TC_VAL_15_aptitude_above_max_rejected PASSED [ 63%]
testing\testing\unit\test_schema_validation.py::TestSoftSkillsRatingBoundaries::test_TC_VAL_16_soft_skills_at_min_boundary_valid PASSED [ 64%]
testing\testing\unit\test_schema_validation.py::TestSoftSkillsRatingBoundaries::test_TC_VAL_17_soft_skills_at_max_boundary_valid PASSED [ 66%]
testing\testing\unit\test_schema_validation.py::TestSoftSkillsRatingBoundaries::test_TC_VAL_18_soft_skills_below_min_rejected PASSED [ 67%]
testing\testing\unit\test_schema_validation.py::TestSoftSkillsRatingBoundaries::test_TC_VAL_19_soft_skills_above_max_rejected PASSED [ 69%]
testing\testing\unit\test_schema_validation.py::TestProjectsAndCertificationsBoundaries::test_TC_VAL_20_projects_at_max_boundary_valid PASSED [ 70%]
testing\testing\unit\test_schema_validation.py::TestProjectsAndCertificationsBoundaries::test_TC_VAL_21_projects_above_max_rejected PASSED [ 71%]
testing\testing\unit\test_schema_validation.py::TestProjectsAndCertificationsBoundaries::test_TC_VAL_22_certifications_at_max_boundary_valid PASSED [ 73%]
testing\testing\unit\test_schema_validation.py::TestProjectsAndCertificationsBoundaries::test_TC_VAL_23_certifications_above_max_rejected PASSED [ 74%]
testing\testing\unit\test_schema_validation.py::TestInternshipsBoundaries::test_TC_VAL_24_internships_at_max_boundary_valid PASSED [ 76%]
testing\testing\unit\test_schema_validation.py::TestInternshipsBoundaries::test_TC_VAL_25_internships_above_max_rejected PASSED [ 77%]
testing\testing\unit\test_schema_validation.py::TestInternshipsBoundaries::test_TC_VAL_26_internships_negative_rejected PASSED [ 78%]
testing\testing\unit\test_schema_validation.py::TestMissingRequiredFields::test_TC_VAL_27_missing_field_rejected[cgpa] PASSED [ 80%]
testing\testing\unit\test_schema_validation.py::TestMissingRequiredFields::test_TC_VAL_27_missing_field_rejected[internships] PASSED [ 81%]
testing\testing\unit\test_schema_validation.py::TestMissingRequiredFields::test_TC_VAL_27_missing_field_rejected[projects] PASSED [ 83%]
testing\testing\unit\test_schema_validation.py::TestMissingRequiredFields::test_TC_VAL_27_missing_field_rejected[certifications] PASSED [ 84%]
testing\testing\unit\test_schema_validation.py::TestMissingRequiredFields::test_TC_VAL_27_missing_field_rejected[aptitude_score] PASSED [ 85%]
testing\testing\unit\test_schema_validation.py::TestMissingRequiredFields::test_TC_VAL_27_missing_field_rejected[soft_skills_rating] PASSED [ 87%]
testing\testing\unit\test_schema_validation.py::TestMissingRequiredFields::test_TC_VAL_27_missing_field_rejected[extracurricular_activities] PASSED [ 88%]
testing\testing\unit\test_schema_validation.py::TestMissingRequiredFields::test_TC_VAL_27_missing_field_rejected[placement_training] PASSED [ 90%]
testing\testing\unit\test_schema_validation.py::TestMissingRequiredFields::test_TC_VAL_27_missing_field_rejected[backlogs] PASSED [ 91%]
testing\testing\unit\test_schema_validation.py::TestBooleanFieldsEquivalencePartitions::test_TC_VAL_28_extracurricular_both_partitions_valid[True] PASSED [ 92%]
testing\testing\unit\test_schema_validation.py::TestBooleanFieldsEquivalencePartitions::test_TC_VAL_28_extracurricular_both_partitions_valid[False] PASSED [ 94%]
testing\testing\unit\test_schema_validation.py::TestBooleanFieldsEquivalencePartitions::test_TC_VAL_29_placement_training_both_partitions_valid[True] PASSED [ 95%]
testing\testing\unit\test_schema_validation.py::TestBooleanFieldsEquivalencePartitions::test_TC_VAL_29_placement_training_both_partitions_valid[False] PASSED [ 97%]
testing\testing\unit\test_schema_validation.py::TestTypeCoercionAndMalformedInput::test_TC_VAL_30_string_where_float_expected_rejected PASSED [ 98%]
testing\testing\unit\test_schema_validation.py::TestTypeCoercionAndMalformedInput::test_TC_VAL_31_none_for_required_field_rejected PASSED [100%]

=============================== tests coverage ================================
_______________ coverage: platform win32, python 3.11.9-final-0 _______________

Name                        Stmts   Miss Branch BrPart  Cover   Missing
-----------------------------------------------------------------------
backend\app\prediction.py     137     32     46     13    75%   22-24, 28-30, 36-38, 81, 90, 96, 100, 113->118, 115->118, 120, 126-128, 137, 153, 172-176, 184-190, 199-200
backend\app\schemas.py         53      0      0      0   100%
-----------------------------------------------------------------------
TOTAL                         190     32     46     13    81%
============================= 71 passed in 14.99s =============================
```

---

## Task 3 — Integration Tests

Postgres setup used: Docker postgres:16 on localhost:5432

```
============================= test session starts =============================
platform win32 -- Python 3.11.9, pytest-9.1.1, pluggy-1.6.0 -- D:\Projects\Placement Prediction Assignment\Codebase\Source\backend\.venv\Scripts\python.exe
cachedir: .pytest_cache
rootdir: D:\Projects\Placement Prediction Assignment\Codebase\Source\testing
configfile: pytest.ini
plugins: anyio-4.14.2, asyncio-1.4.0, cov-7.1.0
asyncio: mode=Mode.AUTO, debug=False, asyncio_default_fixture_loop_scope=session, asyncio_default_test_loop_scope=session
collecting ... collected 13 items

testing\integration\test_history_and_progress.py::TestHistory::test_TC_IT_08_history_empty_for_new_user PASSED [  7%]
testing\integration\test_history_and_progress.py::TestHistory::test_TC_IT_09_history_returns_reverse_chronological_order PASSED [ 15%]
testing\integration\test_history_and_progress.py::TestHistory::test_TC_IT_10_history_unauthenticated_returns_401 PASSED [ 23%]
testing\integration\test_history_and_progress.py::TestHistory::test_TC_IT_11_history_guest_token_returns_401 PASSED [ 30%]
testing\integration\test_history_and_progress.py::TestProgress::test_TC_IT_12_progress_returns_chronological_order PASSED [ 38%]
testing\integration\test_history_and_progress.py::TestProgress::test_TC_IT_13_progress_unauthenticated_returns_401 PASSED [ 46%]
testing\integration\test_predict_endpoint.py::TestGuestPrediction::test_TC_IT_01_guest_prediction_returns_200_with_expected_shape PASSED [ 53%]
testing\integration\test_predict_endpoint.py::TestGuestPrediction::test_TC_IT_02_guest_prediction_not_persisted_to_db PASSED [ 61%]
testing\integration\test_predict_endpoint.py::TestGuestPrediction::test_TC_IT_03_guest_prediction_missing_field_returns_422 PASSED [ 69%]
testing\integration\test_predict_endpoint.py::TestGuestPrediction::test_TC_IT_04_guest_prediction_out_of_schema_range_returns_422 PASSED [ 76%]
testing\integration\test_predict_endpoint.py::TestAuthenticatedPrediction::test_TC_IT_05_authenticated_prediction_persists_profile_and_prediction PASSED [ 84%]
testing\integration\test_predict_endpoint.py::TestAuthenticatedPrediction::test_TC_IT_06_out_of_training_range_cgpa_flagged_and_penalized PASSED [ 92%]
testing\integration\test_predict_endpoint.py::TestAuthenticatedPrediction::test_TC_IT_07_invalid_or_expired_token_returns_403 PASSED [100%]

============================= 13 passed in 4.00s ==============================
```

---

## Task 4 — System Tests (live deployed backend)

### test_rate_limiting.py
```
TC-ST-01: Rate limiting test against https://placement-prediction-xg2e.onrender.com/predict/
Sending 20 rapid guest prediction requests (limit should be 15/minute)...

  Request  1: status=200  time=1.706s
  Request  2: status=200  time=1.501s
  Request  3: status=200  time=1.499s
  Request  4: status=200  time=1.507s
  Request  5: status=200  time=1.395s
  Request  6: status=200  time=1.397s
  Request  7: status=200  time=1.496s
  Request  8: status=200  time=1.495s
  Request  9: status=200  time=1.414s
  Request 10: status=200  time=1.487s
  Request 11: status=200  time=1.504s
  Request 12: status=200  time=1.403s
  Request 13: status=200  time=1.505s
  Request 14: status=200  time=1.593s
  Request 15: status=200  time=1.505s
  Request 16: status=429  time=0.101s
  Request 17: status=429  time=0.099s
  Request 18: status=429  time=0.102s
  Request 19: status=429  time=0.100s
  Request 20: status=429  time=0.103s

--- Summary ---
200 OK responses:        15
429 Too Many Requests:   5
RESULT: PASS - rate limiting engaged at/around the 15/minute threshold
```

### test_latency.py
```
TC-ST-02: Latency test against https://placement-prediction-xg2e.onrender.com/predict/

Warm-up request (handles Render cold start, not counted in results)...
  Warm-up: status=200  time=1.705s

Timing 10 subsequent requests...
  Request  1: status=200  time=1.713s
  Request  2: status=200  time=1.697s
  Request  3: status=200  time=1.494s
  Request  4: status=200  time=1.506s
  Request  5: status=200  time=1.687s
  Request  6: status=200  time=1.602s
  Request  7: status=200  time=1.598s
  Request  8: status=200  time=1.506s
  Request  9: status=200  time=1.680s
  Request 10: status=200  time=1.506s

--- Summary (warm requests only, cold start excluded) ---
Average: 1.599s
Best:    1.494s
Worst:   1.713s
Cold-start (first request): 1.705s
RESULT: PASS - average 1.599s is within the 2.0s target

Note: this measures end-to-end HTTP round-trip (NFR-1.1), which includes network latency - not the same as the backend-only 500ms inference target (NFR-1.4), which is only visible in backend logs, not from the client side.
```

### test_cors_and_headers.py
```
TC-ST-03: CORS + header checks against https://placement-prediction-xg2e.onrender.com

1. OPTIONS preflight from legitimate frontend origin...
   Status: 200
   Access-Control-Allow-Origin: https://placement-prediction-webapp.vercel.app
   PASS: expected 'https://placement-prediction-webapp.vercel.app'

2. Actual POST from legitimate frontend origin...
   Status: 200
   Access-Control-Allow-Origin: https://placement-prediction-webapp.vercel.app

3. OPTIONS preflight from an unauthorized/random origin...
   Status: 400
   Access-Control-Allow-Origin: None
   PASS: unauthorized origin must not be echoed back

4. HTTPS/TLS check...
   Base URL uses HTTPS: True
   PASS

--- Summary ---
TC-ST-03a (legitimate origin allowed):   PASS
TC-ST-03b (unauthorized origin blocked): PASS
TC-ST-03c (HTTPS/TLS in use):             PASS
```

### test_pii_and_guest_flow.py
```
TC-ST-04: PII exclusion + guest flow against https://placement-prediction-xg2e.onrender.com

1. Health check...
   /health -> 200 {'status': 'ok'}

2. Guest prediction (no auth)...
   Status: 200
   Response keys: ['profile_id', 'user_id', 'outcome', 'confidence_score', 'limiting_features', 'out_of_range_fields', 'id', 'created_at', 'disclaimer', 'profile']
   Profile keys:  ['cgpa', 'internships', 'projects', 'certifications', 'aptitude_score', 'soft_skills_rating', 'extracurricular_activities', 'placement_training', 'backlogs', 'id', 'user_id', 'created_at']
   PII field names found in response: NONE
   PASS: no PII fields present in guest prediction response

3. Guest prediction user_id is null: None -> PASS

4. Response completeness:
   outcome present:      True
   confidence present:   True
   disclaimer present:   True

--- Summary ---
TC-ST-04a (PII excluded):        PASS
TC-ST-04b (guest user_id null):  PASS
TC-ST-04c (response complete):   PASS
```

---

## Task 5 — Demo Login Check

```
  % Total    % Received % Xferd  Average Speed  Time    Time    Time   Current
                                 Dload  Upload  Total   Spent   Left   Speed
  0      0   0      0   0      0      0      0                              0100    204   0    204   0      0    301      0                              0100    204   0    204   0      0    301      0                              0100    204   0    204   0      0    301      0                              0
HTTP/1.1 200 OK
Date: Sun, 16 Aug 2026 16:51:06 GMT
Content-Type: application/json
Transfer-Encoding: chunked
Connection: keep-alive
rndr-id: 32ff5c82-aebf-4571
Server: cloudflare
Set-Cookie: access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3ODc1MDM4NjYsInN1YiI6IjAwMDAwMDAwLTAwMDAtNDAwMC04MDAwLTAwMDAwMDAwMDAwMSIsImlzX2d1ZXN0IjpmYWxzZX0.aBd6uHd_8A-dhBEEiB9vbJOLU2VSFXk8EFOV57-_-jg; HttpOnly; Max-Age=604800; Path=/; SameSite=none; Secure
vary: Accept-Encoding
x-render-origin-server: uvicorn
cf-cache-status: DYNAMIC
CF-RAY: a2c1f1196bef1494-BOM
alt-svc: h3=":443"; ma=86400

{"user":{"id":"00000000-0000-4000-8000-000000000001","name":"Demo Student","email":"demo.student@placement-predictor.app","created_at":"2026-08-09T06:21:57.447152","semester":6,"year":3},"is_guest":false}
```

---

---

## Task 6 — Additional Integration Tests

```
============================= test session starts =============================
platform win32 -- Python 3.11.9, pytest-9.1.1, pluggy-1.6.0 -- D:\Projects\Placement Prediction Assignment\Codebase\Source\backend\.venv\Scripts\python.exe
cachedir: .pytest_cache
rootdir: D:\Projects\Placement Prediction Assignment\Codebase\Source\testing
configfile: pytest.ini
plugins: anyio-4.14.2, asyncio-1.4.0, cov-7.1.0
asyncio: mode=Mode.AUTO, debug=False, asyncio_default_fixture_loop_scope=session, asyncio_default_test_loop_scope=session
collecting ... collected 7 items

testing\integration\test_account_deletion_and_timeout.py::TestAccountDeletion::test_TC_IT_14a_delete_account_removes_user_row PASSED [ 14%]
testing\integration\test_account_deletion_and_timeout.py::TestAccountDeletion::test_TC_IT_14b_delete_account_cascades_to_profiles_and_predictions PASSED [ 28%]
testing\integration\test_account_deletion_and_timeout.py::TestAccountDeletion::test_TC_IT_14c_delete_account_clears_auth_cookie PASSED [ 42%]
testing\integration\test_account_deletion_and_timeout.py::TestAccountDeletion::test_TC_IT_14d_unauthenticated_delete_returns_401 PASSED [ 57%]
testing\integration\test_account_deletion_and_timeout.py::TestInferenceTimeoutFallback::test_TC_IT_15a_inference_exceeding_timeout_returns_503 PASSED [ 71%]
testing\integration\test_account_deletion_and_timeout.py::TestInferenceTimeoutFallback::test_TC_IT_15b_timed_out_prediction_not_saved_to_history PASSED [ 85%]
testing\integration\test_account_deletion_and_timeout.py::TestSlowInferenceLogging::test_TC_IT_16_inference_over_500ms_logs_warning PASSED [100%]

============================== 7 passed in 6.10s ==============================
```

## Task 7 — JMeter Load Test

### Console Summary
```
Creating summariser <summary>
Created the tree successfully using D:\Projects\Placement Prediction Assignment\Codebase\Source\testing\system\nfr_load_test.jmx
Starting standalone test @ August 17, 2026 3:27:12 PM IST (1786960632604)
Waiting for possible Shutdown/StopTestNow/HeapDump/ThreadDump message on port 4445
summary +    104 in 00:00:19 =    5.4/s Avg:   686 Min:   139 Max:  2646 Err:     6 (5.77%) Active: 2 Started: 102 Finished: 100
summary +      4 in 00:00:30 =    0.1/s Avg:  1579 Min:  1463 Max:  1788 Err:     0 (0.00%) Active: 2 Started: 102 Finished: 100
summary =    108 in 00:00:49 =    2.2/s Avg:   719 Min:   139 Max:  2646 Err:     6 (5.56%)
summary +      4 in 00:00:30 =    0.1/s Avg:  1551 Min:  1462 Max:  1596 Err:     0 (0.00%) Active: 2 Started: 102 Finished: 100
summary =    112 in 00:01:19 =    1.4/s Avg:   749 Min:   139 Max:  2646 Err:     6 (5.36%)
summary +      4 in 00:00:30 =    0.1/s Avg:  1574 Min:  1385 Max:  1685 Err:     0 (0.00%) Active: 2 Started: 102 Finished: 100
summary =    116 in 00:01:49 =    1.1/s Avg:   778 Min:   139 Max:  2646 Err:     6 (5.17%)
summary +      4 in 00:00:30 =    0.1/s Avg:  1705 Min:  1567 Max:  1789 Err:     0 (0.00%) Active: 2 Started: 102 Finished: 100
summary =    120 in 00:02:19 =    0.9/s Avg:   808 Min:   139 Max:  2646 Err:     6 (5.00%)
summary +      4 in 00:00:30 =    0.1/s Avg:  1448 Min:  1363 Max:  1490 Err:     0 (0.00%) Active: 2 Started: 102 Finished: 100
summary =    124 in 00:02:49 =    0.7/s Avg:   829 Min:   139 Max:  2646 Err:     6 (4.84%)
summary +      4 in 00:00:30 =    0.1/s Avg:  1656 Min:  1497 Max:  1884 Err:     0 (0.00%) Active: 2 Started: 102 Finished: 100
summary =    128 in 00:03:19 =    0.6/s Avg:   855 Min:   139 Max:  2646 Err:     6 (4.69%)
summary +      4 in 00:00:30 =    0.1/s Avg:  1576 Min:  1455 Max:  1693 Err:     0 (0.00%) Active: 2 Started: 102 Finished: 100
summary =    132 in 00:03:49 =    0.6/s Avg:   877 Min:   139 Max:  2646 Err:     6 (4.55%)
summary +      4 in 00:00:30 =    0.1/s Avg:  1653 Min:  1571 Max:  1773 Err:     0 (0.00%) Active: 2 Started: 102 Finished: 100
summary =    136 in 00:04:19 =    0.5/s Avg:   900 Min:   139 Max:  2646 Err:     6 (4.41%)
summary +      4 in 00:00:30 =    0.1/s Avg:  1600 Min:  1483 Max:  1696 Err:     0 (0.00%) Active: 2 Started: 102 Finished: 100
summary =    140 in 00:04:49 =    0.5/s Avg:   920 Min:   139 Max:  2646 Err:     6 (4.29%)
summary +      4 in 00:00:30 =    0.1/s Avg:  1672 Min:  1558 Max:  1786 Err:     0 (0.00%) Active: 2 Started: 102 Finished: 100
summary =    144 in 00:05:19 =    0.5/s Avg:   940 Min:   139 Max:  2646 Err:     6 (4.17%)
summary +      4 in 00:00:30 =    0.1/s Avg:  1703 Min:  1468 Max:  2097 Err:     1 (25.00%) Active: 2 Started: 102 Finished: 100
summary =    148 in 00:05:49 =    0.4/s Avg:   961 Min:   139 Max:  2646 Err:     7 (4.73%)
summary +      4 in 00:00:30 =    0.1/s Avg:  1684 Min:  1601 Max:  1784 Err:     0 (0.00%) Active: 2 Started: 102 Finished: 100
summary =    152 in 00:06:19 =    0.4/s Avg:   980 Min:   139 Max:  2646 Err:     7 (4.61%)
summary +      4 in 00:00:30 =    0.1/s Avg:  1478 Min:  1458 Max:  1496 Err:     0 (0.00%) Active: 2 Started: 102 Finished: 100
summary =    156 in 00:06:49 =    0.4/s Avg:   993 Min:   139 Max:  2646 Err:     7 (4.49%)
summary +      4 in 00:00:30 =    0.1/s Avg:  1704 Min:  1597 Max:  1793 Err:     0 (0.00%) Active: 2 Started: 102 Finished: 100
summary =    160 in 00:07:19 =    0.4/s Avg:  1011 Min:   139 Max:  2646 Err:     7 (4.38%)
summary +      4 in 00:00:30 =    0.1/s Avg:  1584 Min:  1472 Max:  1694 Err:     0 (0.00%) Active: 2 Started: 102 Finished: 100
summary =    164 in 00:07:49 =    0.3/s Avg:  1025 Min:   139 Max:  2646 Err:     7 (4.27%)
summary +      4 in 00:00:30 =    0.1/s Avg:  1581 Min:  1468 Max:  1797 Err:     0 (0.00%) Active: 2 Started: 102 Finished: 100
summary =    168 in 00:08:19 =    0.3/s Avg:  1038 Min:   139 Max:  2646 Err:     7 (4.17%)
summary +      4 in 00:00:30 =    0.1/s Avg:  1602 Min:  1493 Max:  1668 Err:     0 (0.00%) Active: 2 Started: 102 Finished: 100
summary =    172 in 00:08:49 =    0.3/s Avg:  1051 Min:   139 Max:  2646 Err:     7 (4.07%)
summary +      4 in 00:00:30 =    0.1/s Avg:  1751 Min:  1469 Max:  2077 Err:     1 (25.00%) Active: 2 Started: 102 Finished: 100
summary =    176 in 00:09:20 =    0.3/s Avg:  1067 Min:   139 Max:  2646 Err:     8 (4.55%)
summary +      4 in 00:00:30 =    0.1/s Avg:  1583 Min:  1474 Max:  1691 Err:     0 (0.00%) Active: 1 Started: 102 Finished: 101
summary =    180 in 00:09:49 =    0.3/s Avg:  1078 Min:   139 Max:  2646 Err:     8 (4.44%)
summary =    180 in 00:09:49 =    0.3/s Avg:  1078 Min:   139 Max:  2646 Err:     8 (4.44%)
Tidying up ...    @ August 17, 2026 3:37:02 PM IST (1786961222005)
... end of run
```

### HTML Report Statistics

**Thread Group 1 (NFR-1.2 Concurrency Capacity) - GET /health**
- Samples: 100
- Error %: 5.00%
- Avg Response Time: 638.44 ms
- Min Response Time: 139.00 ms
- Max Response Time: 2646.00 ms
- Throughput: 10.02 req/sec

**Thread Group 2 (NFR-1.3 Sustained Throughput) - POST /predict/ (guest)**
- Samples: 80
- Error %: 3.75%
- Avg Response Time: 1629.36 ms
- Min Response Time: 1363.00 ms
- Max Response Time: 2531.00 ms
- Throughput: 0.14 req/sec

---

## Task 8 — Selenium UI Tests

```
============================= test session starts =============================
platform win32 -- Python 3.11.9, pytest-9.1.1, pluggy-1.6.0 -- D:\Projects\Placement Prediction Assignment\Codebase\Source\backend\.venv\Scripts\python.exe
cachedir: .pytest_cache
rootdir: D:\Projects\Placement Prediction Assignment\Codebase\Source\testing
configfile: pytest.ini
plugins: anyio-4.14.2, asyncio-1.4.0, cov-7.1.0
asyncio: mode=Mode.AUTO, debug=False, asyncio_default_fixture_loop_scope=session, asyncio_default_test_loop_scope=session
collecting ... collected 8 items

testing\selenium\test_ui_flows.py::TestPredictButtonState::test_TC_UI_01_predict_button_enabled_on_fresh_form_with_valid_defaults PASSED [ 12%]
testing\selenium\test_ui_flows.py::TestPredictButtonState::test_TC_UI_02_predict_button_stays_enabled_after_re_entering_valid_values PASSED [ 25%]
testing\selenium\test_ui_flows.py::TestPredictButtonState::test_TC_UI_03_predict_button_disabled_with_out_of_range_value PASSED [ 37%]
testing\selenium\test_ui_flows.py::TestInlineValidationErrors::test_TC_UI_04_out_of_range_projects_shows_inline_error_text PASSED [ 50%]
testing\selenium\test_ui_flows.py::TestInlineValidationErrors::test_TC_UI_05_valid_certifications_value_shows_no_error PASSED [ 62%]
testing\selenium\test_ui_flows.py::TestInlineValidationErrors::test_TC_UI_06_aptitude_score_zero_accepted_matching_backend_schema PASSED [ 75%]
testing\selenium\test_ui_flows.py::TestGuestModeUI::test_TC_UI_07_guest_result_shows_not_saved_banner_and_signin_link PASSED [ 87%]
testing\selenium\test_ui_flows.py::TestGuestModeUI::test_TC_UI_08_guest_has_no_history_nav_link PASSED [100%]

============================= 8 passed in 43.09s ==============================
```

## Task 9 — Combined Coverage

```
============================= test session starts =============================
platform win32 -- Python 3.11.9, pytest-9.1.1, pluggy-1.6.0 -- D:\Projects\Placement Prediction Assignment\Codebase\Source\backend\.venv\Scripts\python.exe
cachedir: .pytest_cache
rootdir: D:\Projects\Placement Prediction Assignment\Codebase\Source\testing
configfile: pytest.ini
plugins: anyio-4.14.2, asyncio-1.4.0, cov-7.1.0
asyncio: mode=Mode.AUTO, debug=False, asyncio_default_fixture_loop_scope=session, asyncio_default_test_loop_scope=session
collecting ... collected 92 items

testing\unit\test_model_artifact.py::TestModelArtifactConsistency::test_TC_UT_22_model_loaded_successfully PASSED [  1%]
testing\unit\test_model_artifact.py::TestModelArtifactConsistency::test_TC_UT_23_deployed_model_hyperparameters_match_report[n_estimators-400] PASSED [  2%]
testing\unit\test_model_artifact.py::TestModelArtifactConsistency::test_TC_UT_23_deployed_model_hyperparameters_match_report[min_samples_split-15] PASSED [  3%]
testing\unit\test_model_artifact.py::TestModelArtifactConsistency::test_TC_UT_23_deployed_model_hyperparameters_match_report[min_samples_leaf-1] PASSED [  4%]
testing\unit\test_model_artifact.py::TestModelArtifactConsistency::test_TC_UT_23_deployed_model_hyperparameters_match_report[max_features-sqrt] PASSED [  5%]
testing\unit\test_model_artifact.py::TestModelArtifactConsistency::test_TC_UT_23_deployed_model_hyperparameters_match_report[max_depth-12] PASSED [  6%]
testing\unit\test_model_artifact.py::TestModelArtifactConsistency::test_TC_UT_23_deployed_model_hyperparameters_match_report[class_weight-None] PASSED [  7%]
testing\unit\test_model_artifact.py::TestPredictionDirectionSanity::test_TC_UT_24_strong_profile_confidence_exceeds_weak_profile PASSED [  8%]
testing\unit\test_model_artifact.py::TestPredictionDirectionSanity::test_TC_UT_25_strong_profile_predicted_placed PASSED [  9%]
testing\unit\test_prediction_logic.py::TestOutOfRangePenalty::test_TC_UT_01_unknown_feature_returns_zero PASSED [ 10%]
testing\unit\test_prediction_logic.py::TestOutOfRangePenalty::test_TC_UT_01b_zero_width_range_returns_zero PASSED [ 11%]
testing\unit\test_prediction_logic.py::TestOutOfRangePenalty::test_TC_UT_02_value_at_range_minimum_no_penalty PASSED [ 13%]
testing\unit\test_prediction_logic.py::TestOutOfRangePenalty::test_TC_UT_03_value_at_range_maximum_no_penalty PASSED [ 14%]
testing\unit\test_prediction_logic.py::TestOutOfRangePenalty::test_TC_UT_04_value_mid_range_no_penalty PASSED [ 15%]
testing\unit\test_prediction_logic.py::TestOutOfRangePenalty::test_TC_UT_05_value_just_below_min_within_grace_no_penalty PASSED [ 16%]
testing\unit\test_prediction_logic.py::TestOutOfRangePenalty::test_TC_UT_06_value_just_above_max_within_grace_no_penalty PASSED [ 17%]
testing\unit\test_prediction_logic.py::TestOutOfRangePenalty::test_TC_UT_07_value_exactly_at_grace_boundary_no_penalty PASSED [ 18%]
testing\unit\test_prediction_logic.py::TestOutOfRangePenalty::test_TC_UT_08_value_just_beyond_grace_below_min_has_small_penalty PASSED [ 19%]
testing\unit\test_prediction_logic.py::TestOutOfRangePenalty::test_TC_UT_09_penalty_formula_matches_expected_calculation PASSED [ 20%]
testing\unit\test_prediction_logic.py::TestOutOfRangePenalty::test_TC_UT_10_above_max_penalty_uses_same_formula_as_below_min PASSED [ 21%]
testing\unit\test_prediction_logic.py::TestOutOfRangePenalty::test_TC_UT_11_extreme_out_of_range_value_penalty_is_capped PASSED [ 22%]
testing\unit\test_prediction_logic.py::TestOutOfRangePenalty::test_TC_UT_12_negative_cgpa_extreme_value_penalty_capped PASSED [ 23%]
testing\unit\test_prediction_logic.py::TestBucketFor::test_TC_UT_13_low_partition_representative_value PASSED [ 25%]
testing\unit\test_prediction_logic.py::TestBucketFor::test_TC_UT_14_low_boundary_exact PASSED [ 26%]
testing\unit\test_prediction_logic.py::TestBucketFor::test_TC_UT_15_just_above_low_boundary_is_mid PASSED [ 27%]
testing\unit\test_prediction_logic.py::TestBucketFor::test_TC_UT_16_mid_partition_representative_value PASSED [ 28%]
testing\unit\test_prediction_logic.py::TestBucketFor::test_TC_UT_17_just_below_high_boundary_is_mid PASSED [ 29%]
testing\unit\test_prediction_logic.py::TestBucketFor::test_TC_UT_18_high_boundary_exact PASSED [ 30%]
testing\unit\test_prediction_logic.py::TestBucketFor::test_TC_UT_19_high_partition_representative_value PASSED [ 31%]
testing\unit\test_prediction_logic.py::TestBucketFor::test_TC_UT_20_pct_below_zero_still_classified_low PASSED [ 32%]
testing\unit\test_prediction_logic.py::TestBucketFor::test_TC_UT_21_pct_above_one_still_classified_high PASSED [ 33%]
testing\unit\test_schema_validation.py::TestValidProfile::test_TC_VAL_01_all_valid_values_accepted PASSED [ 34%]
testing\unit\test_schema_validation.py::TestCgpaBoundaries::test_TC_VAL_02_cgpa_at_min_boundary_valid PASSED [ 35%]
testing\unit\test_schema_validation.py::TestCgpaBoundaries::test_TC_VAL_03_cgpa_at_max_boundary_valid PASSED [ 36%]
testing\unit\test_schema_validation.py::TestCgpaBoundaries::test_TC_VAL_04_cgpa_just_below_min_rejected PASSED [ 38%]
testing\unit\test_schema_validation.py::TestCgpaBoundaries::test_TC_VAL_05_cgpa_just_above_max_rejected PASSED [ 39%]
testing\unit\test_schema_validation.py::TestCgpaBoundaries::test_TC_VAL_06_cgpa_clearly_invalid_negative_rejected PASSED [ 40%]
testing\unit\test_schema_validation.py::TestCgpaBoundaries::test_TC_VAL_07_cgpa_clearly_invalid_above_max_rejected PASSED [ 41%]
testing\unit\test_schema_validation.py::TestBacklogsBoundaries::test_TC_VAL_08_backlogs_at_min_boundary_valid PASSED [ 42%]
testing\unit\test_schema_validation.py::TestBacklogsBoundaries::test_TC_VAL_09_backlogs_at_max_boundary_valid PASSED [ 43%]
testing\unit\test_schema_validation.py::TestBacklogsBoundaries::test_TC_VAL_10_backlogs_negative_rejected PASSED [ 44%]
testing\unit\test_schema_validation.py::TestBacklogsBoundaries::test_TC_VAL_11_backlogs_above_max_rejected PASSED [ 45%]
testing\unit\test_schema_validation.py::TestAptitudeScoreBoundaries::test_TC_VAL_12_aptitude_at_min_boundary_valid PASSED [ 46%]
testing\unit\test_schema_validation.py::TestAptitudeScoreBoundaries::test_TC_VAL_13_aptitude_at_max_boundary_valid PASSED [ 47%]
testing\unit\test_schema_validation.py::TestAptitudeScoreBoundaries::test_TC_VAL_14_aptitude_below_min_rejected PASSED [ 48%]
testing\unit\test_schema_validation.py::TestAptitudeScoreBoundaries::test_TC_VAL_15_aptitude_above_max_rejected PASSED [ 50%]
testing\unit\test_schema_validation.py::TestSoftSkillsRatingBoundaries::test_TC_VAL_16_soft_skills_at_min_boundary_valid PASSED [ 51%]
testing\unit\test_schema_validation.py::TestSoftSkillsRatingBoundaries::test_TC_VAL_17_soft_skills_at_max_boundary_valid PASSED [ 52%]
testing\unit\test_schema_validation.py::TestSoftSkillsRatingBoundaries::test_TC_VAL_18_soft_skills_below_min_rejected PASSED [ 53%]
testing\unit\test_schema_validation.py::TestSoftSkillsRatingBoundaries::test_TC_VAL_19_soft_skills_above_max_rejected PASSED [ 54%]
testing\unit\test_schema_validation.py::TestProjectsAndCertificationsBoundaries::test_TC_VAL_20_projects_at_max_boundary_valid PASSED [ 55%]
testing\unit\test_schema_validation.py::TestProjectsAndCertificationsBoundaries::test_TC_VAL_21_projects_above_max_rejected PASSED [ 56%]
testing\unit\test_schema_validation.py::TestProjectsAndCertificationsBoundaries::test_TC_VAL_22_certifications_at_max_boundary_valid PASSED [ 57%]
testing\unit\test_schema_validation.py::TestProjectsAndCertificationsBoundaries::test_TC_VAL_23_certifications_above_max_rejected PASSED [ 58%]
testing\unit\test_schema_validation.py::TestInternshipsBoundaries::test_TC_VAL_24_internships_at_max_boundary_valid PASSED [ 59%]
testing\unit\test_schema_validation.py::TestInternshipsBoundaries::test_TC_VAL_25_internships_above_max_rejected PASSED [ 60%]
testing\unit\test_schema_validation.py::TestInternshipsBoundaries::test_TC_VAL_26_internships_negative_rejected PASSED [ 61%]
testing\unit\test_schema_validation.py::TestMissingRequiredFields::test_TC_VAL_27_missing_field_rejected[cgpa] PASSED [ 63%]
testing\unit\test_schema_validation.py::TestMissingRequiredFields::test_TC_VAL_27_missing_field_rejected[internships] PASSED [ 64%]
testing\unit\test_schema_validation.py::TestMissingRequiredFields::test_TC_VAL_27_missing_field_rejected[projects] PASSED [ 65%]
testing\unit\test_schema_validation.py::TestMissingRequiredFields::test_TC_VAL_27_missing_field_rejected[certifications] PASSED [ 66%]
testing\unit\test_schema_validation.py::TestMissingRequiredFields::test_TC_VAL_27_missing_field_rejected[aptitude_score] PASSED [ 67%]
testing\unit\test_schema_validation.py::TestMissingRequiredFields::test_TC_VAL_27_missing_field_rejected[soft_skills_rating] PASSED [ 68%]
testing\unit\test_schema_validation.py::TestMissingRequiredFields::test_TC_VAL_27_missing_field_rejected[extracurricular_activities] PASSED [ 69%]
testing\unit\test_schema_validation.py::TestMissingRequiredFields::test_TC_VAL_27_missing_field_rejected[placement_training] PASSED [ 70%]
testing\unit\test_schema_validation.py::TestMissingRequiredFields::test_TC_VAL_27_missing_field_rejected[backlogs] PASSED [ 71%]
testing\unit\test_schema_validation.py::TestBooleanFieldsEquivalencePartitions::test_TC_VAL_28_extracurricular_both_partitions_valid[True] PASSED [ 72%]
testing\unit\test_schema_validation.py::TestBooleanFieldsEquivalencePartitions::test_TC_VAL_28_extracurricular_both_partitions_valid[False] PASSED [ 73%]
testing\unit\test_schema_validation.py::TestBooleanFieldsEquivalencePartitions::test_TC_VAL_29_placement_training_both_partitions_valid[True] PASSED [ 75%]
testing\unit\test_schema_validation.py::TestBooleanFieldsEquivalencePartitions::test_TC_VAL_29_placement_training_both_partitions_valid[False] PASSED [ 76%]
testing\unit\test_schema_validation.py::TestTypeCoercionAndMalformedInput::test_TC_VAL_30_string_where_float_expected_rejected PASSED [ 77%]
testing\unit\test_schema_validation.py::TestTypeCoercionAndMalformedInput::test_TC_VAL_31_none_for_required_field_rejected PASSED [ 78%]
testing\integration\test_account_deletion_and_timeout.py::TestAccountDeletion::test_TC_IT_14a_delete_account_removes_user_row PASSED [ 79%]
testing\integration\test_account_deletion_and_timeout.py::TestAccountDeletion::test_TC_IT_14b_delete_account_cascades_to_profiles_and_predictions PASSED [ 80%]
testing\integration\test_account_deletion_and_timeout.py::TestAccountDeletion::test_TC_IT_14c_delete_account_clears_auth_cookie PASSED [ 81%]
testing\integration\test_account_deletion_and_timeout.py::TestAccountDeletion::test_TC_IT_14d_unauthenticated_delete_returns_401 PASSED [ 82%]
testing\integration\test_account_deletion_and_timeout.py::TestInferenceTimeoutFallback::test_TC_IT_15a_inference_exceeding_timeout_returns_503 PASSED [ 83%]
testing\integration\test_account_deletion_and_timeout.py::TestInferenceTimeoutFallback::test_TC_IT_15b_timed_out_prediction_not_saved_to_history PASSED [ 84%]
testing\integration\test_account_deletion_and_timeout.py::TestSlowInferenceLogging::test_TC_IT_16_inference_over_500ms_logs_warning PASSED [ 85%]
testing\integration\test_history_and_progress.py::TestHistory::test_TC_IT_08_history_empty_for_new_user PASSED [ 86%]
testing\integration\test_history_and_progress.py::TestHistory::test_TC_IT_09_history_returns_reverse_chronological_order PASSED [ 88%]
testing\integration\test_history_and_progress.py::TestHistory::test_TC_IT_10_history_unauthenticated_returns_401 PASSED [ 89%]
testing\integration\test_history_and_progress.py::TestHistory::test_TC_IT_11_history_guest_token_returns_401 PASSED [ 90%]
testing\integration\test_history_and_progress.py::TestProgress::test_TC_IT_12_progress_returns_chronological_order PASSED [ 91%]
testing\integration\test_history_and_progress.py::TestProgress::test_TC_IT_13_progress_unauthenticated_returns_401 PASSED [ 92%]
testing\integration\test_predict_endpoint.py::TestGuestPrediction::test_TC_IT_01_guest_prediction_returns_200_with_expected_shape PASSED [ 93%]
testing\integration\test_predict_endpoint.py::TestGuestPrediction::test_TC_IT_02_guest_prediction_not_persisted_to_db PASSED [ 94%]
testing\integration\test_predict_endpoint.py::TestGuestPrediction::test_TC_IT_03_guest_prediction_missing_field_returns_422 PASSED [ 95%]
testing\integration\test_predict_endpoint.py::TestGuestPrediction::test_TC_IT_04_guest_prediction_out_of_schema_range_returns_422 PASSED [ 96%]
testing\integration\test_predict_endpoint.py::TestAuthenticatedPrediction::test_TC_IT_05_authenticated_prediction_persists_profile_and_prediction PASSED [ 97%]
testing\integration\test_predict_endpoint.py::TestAuthenticatedPrediction::test_TC_IT_06_out_of_training_range_cgpa_flagged_and_penalized PASSED [ 98%]
testing\integration\test_predict_endpoint.py::TestAuthenticatedPrediction::test_TC_IT_07_invalid_or_expired_token_returns_403 PASSED [100%]

=============================== tests coverage ================================
_______________ coverage: platform win32, python 3.11.9-final-0 _______________

Name                        Stmts   Miss Branch BrPart  Cover   Missing
-----------------------------------------------------------------------
backend\app\prediction.py     137     26     46     10    80%   22-24, 28-30, 36-38, 81, 90, 96, 100, 113->118, 115->118, 120, 126-128, 153, 172-176, 187-190
backend\app\schemas.py         53      0      0      0   100%
-----------------------------------------------------------------------
TOTAL                         190     26     46     10    85%
============================= 92 passed in 11.65s =============================
```

---

## Anything unexpected?

