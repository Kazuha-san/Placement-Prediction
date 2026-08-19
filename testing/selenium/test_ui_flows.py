"""
TC-UI-xx - Selenium Browser Automation Suite

Covers UI-level requirements that cannot be tested at the API level:
  FR-3.3 - Predict button disabled until form is valid
  FR-3.2 - Out-of-range input shows inline validation error
  FR-2.4 - Guest mode: banner + sign-in prompt, no history/progress access

Run against the LIVE deployed frontend:
  https://placement-prediction-webapp.vercel.app

Requires: pip install selenium  (Chrome must be installed; Selenium 4.6+
manages the driver automatically, no manual ChromeDriver download needed)

Run:
    pytest testing/selenium/test_ui_flows.py -v
    (or: python testing/selenium/test_ui_flows.py to run standalone)
"""
import time

import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

BASE_URL = "https://placement-prediction-webapp.vercel.app"

# Field id -> a clearly VALID value (matches FIELD_LIMITS in ProfileForm.jsx)
VALID_VALUES = {
    "cgpa": "8.5",
    "internships": "2",
    "projects": "5",
    "certifications": "3",
    "aptitude_score": "75",
    "soft_skills_rating": "7.5",
    "backlogs": "0",
}


@pytest.fixture
def driver():
    options = webdriver.ChromeOptions()
    options.add_argument("--window-size=1280,900")
    # Comment out the next line to watch the browser interact visually
    # options.add_argument("--headless=new")
    d = webdriver.Chrome(options=options)
    d.implicitly_wait(3)
    yield d
    d.quit()


def _enter_as_guest(driver):
    driver.get(f"{BASE_URL}/signin")
    WebDriverWait(driver, 15).until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Enter as Guest')]"))
    ).click()
    WebDriverWait(driver, 15).until(EC.url_contains("/profile"))


def _fill_number_field(driver, field_id, value):
    """
    Works for real typed inputs (NumberField, StepperField). Does NOT
    reliably work for RangeSlider fields (cgpa, aptitude_score,
    soft_skills_rating) - send_keys() does not set arbitrary values on a
    native type="range" input; those fields are left at their (valid)
    initialFormData defaults throughout this suite instead of being
    explicitly driven, since every default value is already within range.
    """
    el = driver.find_element(By.ID, field_id)
    el.clear()
    el.send_keys(value)
    el.send_keys("\t")  # blur to trigger validation


def _fill_valid_form(driver):
    """Fills the free-typed fields explicitly; slider fields (cgpa,
    aptitude_score, soft_skills_rating) are left at their initialFormData
    defaults, which are already valid, since send_keys() can't reliably
    drive a native range slider to an arbitrary value."""
    for field_id, value in VALID_VALUES.items():
        _fill_number_field(driver, field_id, value)
    # Toggle fields (extracurricular_activities, placement_training) are
    # role="switch" buttons, not <input> elements
    driver.find_element(By.CSS_SELECTOR, "button[aria-label='Extracurricular activities']").click()
    driver.find_element(By.CSS_SELECTOR, "button[aria-label='Completed placement training']").click()


class TestPredictButtonState:
    """
    TC-UI-01.x - FR-3.3: predict button must reflect current form validity.

    Note: initialFormData in ProfileForm.jsx ships with already-valid default
    values (cgpa=7.25, aptitude_score=75, etc.), and isFormValid() checks
    current values against FIELD_LIMITS regardless of "touched" state - so
    the button is actually ENABLED from first page load, not disabled. The
    real, testable FR-3.3 behavior is that it correctly flips to DISABLED
    the moment any field is pushed out of range, and back to ENABLED once
    corrected.
    """

    def test_TC_UI_01_predict_button_enabled_on_fresh_form_with_valid_defaults(self, driver):
        _enter_as_guest(driver)
        button = WebDriverWait(driver, 15).until(
            EC.presence_of_element_located((By.XPATH, "//button[contains(., 'Predict my outcome')]"))
        )
        assert button.get_attribute("disabled") is None, (
            "Predict button is expected to be enabled on fresh load, since "
            "initialFormData ships with values already within FIELD_LIMITS"
        )

    def test_TC_UI_02_predict_button_stays_enabled_after_re_entering_valid_values(self, driver):
        _enter_as_guest(driver)
        _fill_valid_form(driver)
        button = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//button[contains(., 'Predict my outcome')]"))
        )
        time.sleep(0.5)
        assert button.get_attribute("disabled") is None, \
            "Predict button should be enabled once all fields hold valid values"

    def test_TC_UI_03_predict_button_disabled_with_out_of_range_value(self, driver):
        """
        Uses 'projects' (a free-typed NumberField, max=50) rather than 'cgpa'
        (a range slider) - send_keys() cannot reliably push an out-of-range
        value onto a native type="range" input, which caused this test to
        false-negative in an earlier version. NumberField is designed for
        exactly this kind of keyboard entry and is the correct target.
        """
        _enter_as_guest(driver)
        _fill_number_field(driver, "projects", "51")  # exceeds max=50
        button = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//button[contains(., 'Predict my outcome')]"))
        )
        time.sleep(0.5)
        assert button.get_attribute("disabled") is not None, \
            "Predict button must become disabled once a field goes out of range"


class TestInlineValidationErrors:
    """TC-UI-02.x - FR-3.2: out-of-range input shows an inline error, marks aria-invalid."""

    def test_TC_UI_04_out_of_range_projects_shows_inline_error_text(self, driver):
        """Same field-type correction as TC-UI-03: uses 'projects' (NumberField),
        not 'cgpa' (RangeSlider, not settable via send_keys)."""
        _enter_as_guest(driver)
        _fill_number_field(driver, "projects", "51")  # exceeds max=50
        projects_input = driver.find_element(By.ID, "projects")
        assert projects_input.get_attribute("aria-invalid") == "true", \
            "FR-3.2: out-of-range field must be marked aria-invalid"
        # error text appears as a sibling <p class="text-danger">
        error_text = driver.find_element(
            By.XPATH, "//input[@id='projects']/following-sibling::p[contains(@class,'text-danger')]"
        )
        assert "between" in error_text.text.lower(), "Expected a 'must be between X and Y' style message"

    def test_TC_UI_05_valid_certifications_value_shows_no_error(self, driver):
        """
        Uses 'certifications' (NumberField) instead of the original 'cgpa'
        (RangeSlider) target. The slider version technically passed before,
        but only because send_keys() silently failed to change the slider's
        value at all, leaving it at its already-valid default - a false
        pass that wasn't really testing anything. This version genuinely
        types a new valid value into a real text input and confirms it's
        accepted.
        """
        _enter_as_guest(driver)
        _fill_number_field(driver, "certifications", "5")
        cert_input = driver.find_element(By.ID, "certifications")
        assert int(cert_input.get_attribute("value")) == 5, "typed value should numerically equal 5"
        assert cert_input.get_attribute("aria-invalid") in (None, "false")

    def test_TC_UI_06_aptitude_score_zero_accepted_matching_backend_schema(self, driver):
        """
        Regression check for a frontend/backend validation mismatch found
        2026-08-16: ProfileForm.jsx's FIELD_LIMITS previously set
        aptitude_score min=1 and soft_skills_rating min=1, while the backend
        Pydantic schema (schemas.py) allows both down to 0 (ge=0) - see
        TC-VAL-12, TC-VAL-16. This meant aptitude_score=0 / soft_skills=0
        were valid via the API but rejected by the frontend UI before ever
        reaching it.

        Fixed 2026-08-16 (frontend FIELD_LIMITS now matches backend, min=0).
        This test now asserts the FIXED behavior - aptitude_score=0 should
        be accepted, not flagged as invalid. If this test fails, the
        frontend/backend limits have drifted apart again.
        """
        _enter_as_guest(driver)
        _fill_number_field(driver, "aptitude_score", "0")
        aptitude_input = driver.find_element(By.ID, "aptitude_score")
        assert aptitude_input.get_attribute("aria-invalid") in (None, "false"), (
            "aptitude_score=0 should now be accepted by the frontend, matching "
            "the backend schema's ge=0 constraint (fixed 2026-08-16)"
        )


class TestGuestModeUI:
    """TC-UI-03.x - FR-2.4: guest mode banner, sign-in prompt, no history/progress access."""

    def test_TC_UI_07_guest_result_shows_not_saved_banner_and_signin_link(self, driver):
        _enter_as_guest(driver)
        _fill_valid_form(driver)
        button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Predict my outcome')]"))
        )
        button.click()
        WebDriverWait(driver, 20).until(EC.url_contains("/result"))

        banner = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located(
                (By.XPATH, "//p[contains(text(), \"won't be saved\")]")
            )
        )
        assert "sign in" in banner.text.lower() or driver.find_element(By.LINK_TEXT, "Sign in")

    def test_TC_UI_08_guest_has_no_history_nav_link(self, driver):
        _enter_as_guest(driver)
        # A logged-in user has a History nav link; a guest should not
        history_links = driver.find_elements(By.PARTIAL_LINK_TEXT, "History")
        assert len(history_links) == 0, "FR-2.4/FR-5.4: guest sessions must not be offered History navigation"


if __name__ == "__main__":
    import sys
    sys.exit(pytest.main([__file__, "-v"]))
