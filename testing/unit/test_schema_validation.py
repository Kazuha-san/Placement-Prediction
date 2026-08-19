"""
TC-UT-03.x / TC-VAL-xx - Unit Tests: ProfileCreate Schema Validation

Module under test: backend/app/schemas.py -> ProfileCreate
Requirement:       FR-1.4 (boundary validation), FR-1.5 (missing field rejection),
                    FR-3.2 (out-of-range highlight)
Technique:         Black-Box - Equivalence Partitioning + Boundary Value Analysis

Field constraints (from schemas.py):
    cgpa                        : float, 0 <= x <= 10
    internships                 : int,   0 <= x <= 10
    projects                    : int,   0 <= x <= 50
    certifications               : int,   0 <= x <= 50
    aptitude_score               : float, 0 <= x <= 100
    soft_skills_rating           : float, 0 <= x <= 10
    extracurricular_activities   : bool,  required
    placement_training           : bool,  required
    backlogs                    : int,   0 <= x <= 10
"""
import pytest
from pydantic import ValidationError

from app.schemas import ProfileCreate

VALID_PROFILE = dict(
    cgpa=8.5,
    internships=2,
    projects=5,
    certifications=3,
    aptitude_score=75.0,
    soft_skills_rating=7.5,
    extracurricular_activities=True,
    placement_training=True,
    backlogs=0,
)


def make_profile(**overrides):
    data = {**VALID_PROFILE, **overrides}
    return ProfileCreate(**data)


class TestValidProfile:
    def test_TC_VAL_01_all_valid_values_accepted(self):
        p = make_profile()
        assert p.cgpa == 8.5


class TestCgpaBoundaries:
    """CGPA valid range: 0-10 (per schemas.py Field(ge=0, le=10))"""

    def test_TC_VAL_02_cgpa_at_min_boundary_valid(self):
        assert make_profile(cgpa=0.0).cgpa == 0.0

    def test_TC_VAL_03_cgpa_at_max_boundary_valid(self):
        assert make_profile(cgpa=10.0).cgpa == 10.0

    def test_TC_VAL_04_cgpa_just_below_min_rejected(self):
        with pytest.raises(ValidationError):
            make_profile(cgpa=-0.1)

    def test_TC_VAL_05_cgpa_just_above_max_rejected(self):
        with pytest.raises(ValidationError):
            make_profile(cgpa=10.1)

    def test_TC_VAL_06_cgpa_clearly_invalid_negative_rejected(self):
        with pytest.raises(ValidationError):
            make_profile(cgpa=-1.0)

    def test_TC_VAL_07_cgpa_clearly_invalid_above_max_rejected(self):
        with pytest.raises(ValidationError):
            make_profile(cgpa=10.5)


class TestBacklogsBoundaries:
    """Backlogs valid range: 0-10 (integer)"""

    def test_TC_VAL_08_backlogs_at_min_boundary_valid(self):
        assert make_profile(backlogs=0).backlogs == 0

    def test_TC_VAL_09_backlogs_at_max_boundary_valid(self):
        assert make_profile(backlogs=10).backlogs == 10

    def test_TC_VAL_10_backlogs_negative_rejected(self):
        with pytest.raises(ValidationError):
            make_profile(backlogs=-1)

    def test_TC_VAL_11_backlogs_above_max_rejected(self):
        with pytest.raises(ValidationError):
            make_profile(backlogs=11)


class TestAptitudeScoreBoundaries:
    """Aptitude score valid range: 0-100"""

    def test_TC_VAL_12_aptitude_at_min_boundary_valid(self):
        assert make_profile(aptitude_score=0.0).aptitude_score == 0.0

    def test_TC_VAL_13_aptitude_at_max_boundary_valid(self):
        assert make_profile(aptitude_score=100.0).aptitude_score == 100.0

    def test_TC_VAL_14_aptitude_below_min_rejected(self):
        with pytest.raises(ValidationError):
            make_profile(aptitude_score=-0.5)

    def test_TC_VAL_15_aptitude_above_max_rejected(self):
        with pytest.raises(ValidationError):
            make_profile(aptitude_score=100.5)


class TestSoftSkillsRatingBoundaries:
    """Soft skills rating valid range: 0-10"""

    def test_TC_VAL_16_soft_skills_at_min_boundary_valid(self):
        assert make_profile(soft_skills_rating=0.0).soft_skills_rating == 0.0

    def test_TC_VAL_17_soft_skills_at_max_boundary_valid(self):
        assert make_profile(soft_skills_rating=10.0).soft_skills_rating == 10.0

    def test_TC_VAL_18_soft_skills_below_min_rejected(self):
        with pytest.raises(ValidationError):
            make_profile(soft_skills_rating=-1.0)

    def test_TC_VAL_19_soft_skills_above_max_rejected(self):
        with pytest.raises(ValidationError):
            make_profile(soft_skills_rating=10.1)


class TestProjectsAndCertificationsBoundaries:
    """Projects & certifications valid range: 0-50 (integer)"""

    def test_TC_VAL_20_projects_at_max_boundary_valid(self):
        assert make_profile(projects=50).projects == 50

    def test_TC_VAL_21_projects_above_max_rejected(self):
        with pytest.raises(ValidationError):
            make_profile(projects=51)

    def test_TC_VAL_22_certifications_at_max_boundary_valid(self):
        assert make_profile(certifications=50).certifications == 50

    def test_TC_VAL_23_certifications_above_max_rejected(self):
        with pytest.raises(ValidationError):
            make_profile(certifications=51)


class TestInternshipsBoundaries:
    """Internships valid range: 0-10 (integer)"""

    def test_TC_VAL_24_internships_at_max_boundary_valid(self):
        assert make_profile(internships=10).internships == 10

    def test_TC_VAL_25_internships_above_max_rejected(self):
        with pytest.raises(ValidationError):
            make_profile(internships=11)

    def test_TC_VAL_26_internships_negative_rejected(self):
        with pytest.raises(ValidationError):
            make_profile(internships=-1)


class TestMissingRequiredFields:
    """FR-1.5 - missing required field must be rejected"""

    @pytest.mark.parametrize("field", list(VALID_PROFILE.keys()))
    def test_TC_VAL_27_missing_field_rejected(self, field):
        data = {k: v for k, v in VALID_PROFILE.items() if k != field}
        with pytest.raises(ValidationError):
            ProfileCreate(**data)


class TestBooleanFieldsEquivalencePartitions:
    """extracurricular_activities / placement_training - both boolean partitions"""

    @pytest.mark.parametrize("value", [True, False])
    def test_TC_VAL_28_extracurricular_both_partitions_valid(self, value):
        assert make_profile(extracurricular_activities=value).extracurricular_activities == value

    @pytest.mark.parametrize("value", [True, False])
    def test_TC_VAL_29_placement_training_both_partitions_valid(self, value):
        assert make_profile(placement_training=value).placement_training == value


class TestTypeCoercionAndMalformedInput:
    """Error Guessing - malformed / wrong-type input"""

    def test_TC_VAL_30_string_where_float_expected_rejected(self):
        with pytest.raises(ValidationError):
            make_profile(cgpa="not-a-number")

    def test_TC_VAL_31_none_for_required_field_rejected(self):
        with pytest.raises(ValidationError):
            make_profile(cgpa=None)
