"""
TC-UT-01.x - White-Box Unit Tests: Out-of-Range Penalty Calculator

Module under test: backend/app/prediction.py -> _out_of_range_penalty()
Requirement:       FR-1.4 (boundary validation), NFR-1.6 (model quality guardrail)
Technique:         White-Box (statement/branch coverage) + Boundary Value Analysis

_out_of_range_penalty(value, feature_name) logic being covered:
    1. No training range known for feature       -> return 0.0            [branch A]
    2. Zero-width range (max == min)              -> return 0.0            [branch B]
    3. value within [min, max]                    -> return 0.0            [branch C]
    4. value outside range but within GRACE band   -> return 0.0            [branch D]
    5. value outside range beyond GRACE            -> return penalty > 0    [branch E]
    6. penalty exceeds PENALTY_CAP_PER_FIELD (0.15) -> capped               [branch F]

Constants (from prediction.py):
    GRACE = 0.15
    PENALTY_SLOPE = 0.05
    PENALTY_CAP_PER_FIELD = 0.15

Training range used throughout: cgpa -> min=4.21, max=9.95 (width = 5.74)
"""
import math

import pytest

from app.prediction import (
    GRACE,
    PENALTY_CAP_PER_FIELD,
    PENALTY_SLOPE,
    TRAINING_RANGES,
    _bucket_for,
    _out_of_range_penalty,
)

CGPA_MIN = TRAINING_RANGES["cgpa"]["min"]   # 4.21
CGPA_MAX = TRAINING_RANGES["cgpa"]["max"]   # 9.95
CGPA_WIDTH = CGPA_MAX - CGPA_MIN            # 5.74


class TestOutOfRangePenalty:
    # --- Branch A: unknown feature name -> no training range entry ---
    def test_TC_UT_01_unknown_feature_returns_zero(self):
        assert _out_of_range_penalty(999, "not_a_real_feature") == 0.0

    # --- Branch B: zero-width range (max == min) - previously documented but
    # never actually implemented; added to close a real branch-coverage gap.
    def test_TC_UT_01b_zero_width_range_returns_zero(self, monkeypatch):
        from app import prediction as prediction_module

        monkeypatch.setitem(
            prediction_module.TRAINING_RANGES, "zero_width_test_feature", {"min": 5.0, "max": 5.0}
        )
        assert _out_of_range_penalty(999, "zero_width_test_feature") == 0.0
        assert _out_of_range_penalty(-999, "zero_width_test_feature") == 0.0

    # --- Branch C: value inside the known training range ---
    def test_TC_UT_02_value_at_range_minimum_no_penalty(self):
        assert _out_of_range_penalty(CGPA_MIN, "cgpa") == 0.0

    def test_TC_UT_03_value_at_range_maximum_no_penalty(self):
        assert _out_of_range_penalty(CGPA_MAX, "cgpa") == 0.0

    def test_TC_UT_04_value_mid_range_no_penalty(self):
        mid = (CGPA_MIN + CGPA_MAX) / 2
        assert _out_of_range_penalty(mid, "cgpa") == 0.0

    # --- Branch D: outside range but inside the 15% grace band ---
    def test_TC_UT_05_value_just_below_min_within_grace_no_penalty(self):
        # dist/width must be <= GRACE (0.15) to stay penalty-free
        value = CGPA_MIN - (CGPA_WIDTH * GRACE * 0.5)  # dist = 7.5% of width
        assert _out_of_range_penalty(value, "cgpa") == 0.0

    def test_TC_UT_06_value_just_above_max_within_grace_no_penalty(self):
        value = CGPA_MAX + (CGPA_WIDTH * GRACE * 0.5)
        assert _out_of_range_penalty(value, "cgpa") == 0.0

    def test_TC_UT_07_value_exactly_at_grace_boundary_no_penalty(self):
        # dist == GRACE exactly -> "dist <= GRACE" branch, not the penalty branch
        value = CGPA_MIN - (CGPA_WIDTH * GRACE)
        assert _out_of_range_penalty(value, "cgpa") == 0.0

    # --- Branch E: outside grace band -> positive, uncapped penalty ---
    def test_TC_UT_08_value_just_beyond_grace_below_min_has_small_penalty(self):
        # dist slightly over GRACE -> smallest possible nonzero penalty
        value = CGPA_MIN - (CGPA_WIDTH * (GRACE + 0.01))
        penalty = _out_of_range_penalty(value, "cgpa")
        assert penalty > 0.0
        assert penalty < PENALTY_CAP_PER_FIELD

    def test_TC_UT_09_penalty_formula_matches_expected_calculation(self):
        # dist = 0.30 (30% of width past the boundary)
        value = CGPA_MIN - (CGPA_WIDTH * 0.30)
        expected = min((0.30 - GRACE) * PENALTY_SLOPE, PENALTY_CAP_PER_FIELD)
        assert math.isclose(_out_of_range_penalty(value, "cgpa"), expected, rel_tol=1e-9)

    def test_TC_UT_10_above_max_penalty_uses_same_formula_as_below_min(self):
        value = CGPA_MAX + (CGPA_WIDTH * 0.30)
        expected = min((0.30 - GRACE) * PENALTY_SLOPE, PENALTY_CAP_PER_FIELD)
        assert math.isclose(_out_of_range_penalty(value, "cgpa"), expected, rel_tol=1e-9)

    # --- Branch F: penalty capped at PENALTY_CAP_PER_FIELD ---
    def test_TC_UT_11_extreme_out_of_range_value_penalty_is_capped(self):
        # Wildly out of range - should hit the cap, not exceed it
        penalty = _out_of_range_penalty(CGPA_MIN - (CGPA_WIDTH * 5), "cgpa")
        assert penalty == PENALTY_CAP_PER_FIELD

    def test_TC_UT_12_negative_cgpa_extreme_value_penalty_capped(self):
        penalty = _out_of_range_penalty(-100.0, "cgpa")
        assert penalty == PENALTY_CAP_PER_FIELD


class TestBucketFor:
    """
    TC-UT-02.x - White-Box Unit Tests: Percentile Bucketing (_bucket_for)
    Technique: Equivalence Partitioning across the 3 buckets + Boundary Value Analysis
    Partitions: low (<=0.25), mid (0.25 < pct < 0.75), high (>=0.75)
    """

    def test_TC_UT_13_low_partition_representative_value(self):
        assert _bucket_for(0.10) == "low"

    def test_TC_UT_14_low_boundary_exact(self):
        assert _bucket_for(0.25) == "low"

    def test_TC_UT_15_just_above_low_boundary_is_mid(self):
        assert _bucket_for(0.2501) == "mid"

    def test_TC_UT_16_mid_partition_representative_value(self):
        assert _bucket_for(0.50) == "mid"

    def test_TC_UT_17_just_below_high_boundary_is_mid(self):
        assert _bucket_for(0.7499) == "mid"

    def test_TC_UT_18_high_boundary_exact(self):
        assert _bucket_for(0.75) == "high"

    def test_TC_UT_19_high_partition_representative_value(self):
        assert _bucket_for(0.90) == "high"

    def test_TC_UT_20_pct_below_zero_still_classified_low(self):
        # pct can go negative if raw_val is below training min (see predict())
        assert _bucket_for(-0.5) == "low"

    def test_TC_UT_21_pct_above_one_still_classified_high(self):
        assert _bucket_for(1.5) == "high"
