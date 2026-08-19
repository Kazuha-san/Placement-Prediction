# Manual UAT Checklist — Fill In As You Go

4 test cases, mapped to SRS Use Cases UC-01 to UC-04. Do them in order.
For each step: do the action, write what you actually saw under "Observed",
circle/write Pass or Fail. Don't overthink the "Observed" column — a short
honest sentence is enough ("worked as expected", "button stayed grey", etc).

---

## TC-UAT-01 — Google Sign-In Flow (UC-01)

**Setup:** Use a real Google account. Start logged out (clear cookies or use incognito).

| # | Step | Expected Result | Observed | Pass/Fail |
|---|---|---|---|---|
| 1 | Go to the site, click "Continue with Google" | Redirects to Google's login/consent screen | the google screen showed correctly | Pass |
| 2 | Approve the Google consent screen | Redirects back into the app |the redirection worked correctly | Pass |
| 3 | (First-time login only) | App prompts you to enter a display name | Yes it did | Pass |
| 4 | Enter a display name and submit | You're taken into the app, username/email visible somewhere (e.g. nav bar) | yes its visible in the side panel | Pass |
| 5 | Click Logout | You're signed out, returned to sign-in screen | logged out successfully |Pass |
| 6 | Sign in again with the same Google account | You're logged back in WITHOUT being asked for a username again | no username was asked the second time, i was in myown account with my username only | Pass |

**Overall TC-UAT-01 result:** Pass — Notes: __everything worked as intended__

---

## TC-UAT-02 — Full Prediction Flow (UC-02)

**Setup:** Logged in (from TC-UAT-01).

| # | Step | Expected Result | Observed | Pass/Fail |
|---|---|---|---|---|
| 1 | Go to the profile form | All 9 fields visible (CGPA, internships, projects, certifications, aptitude, soft skills, extracurricular, placement training, backlogs) | all visible | Pass |
| 2 | Leave the form incomplete/invalid | "Predict my outcome" button is disabled or shows an error | its disabled | Pass |
| 3 | Fill in all fields with valid values | Button becomes enabled | button becomes clickable |Pass |
| 4 | Click "Predict my outcome" | Result screen appears |yes it does |Pass |
| 5 | Check the result screen | Shows outcome (Placed/Not likely), a confidence %, and 1-3 key influencing factors |yes all three are shown |Pass |
| 6 | Go to History | The prediction you just made appears in the list |yes it does |Pass |

**Overall TC-UAT-02 result:** Pass  Notes: __everything worked as intended__


---

## TC-UAT-03 — History & Progress Viewing (UC-03)

**Setup:** Logged in, with at least one prior prediction (from TC-UAT-02).

| # | Step | Expected Result | Observed | Pass/Fail |
|---|---|---|---|---|
| 1 | Open the History tab | Predictions listed, most recent first, each with timestamp/outcome/confidence |all of it was visible |Pass |
| 2 | Click into the Progress/chart view | A line chart shows confidence over time, oldest to newest, left to right |yes it does |Pass |
| 3 | Click an individual history entry | It expands to show full details of that prediction |yes it does |Pass |
| 4 | Log in with a brand-new account (or ask: is there a fresh account you can test?) that has zero predictions, open History | Shows a "No predictions yet" message — NOT a blank/broken screen |is says NO PREDICTIONS YET |Pass |

**Overall TC-UAT-03 result:** Pass / Fail — Notes: __everything worked as intended__


---

## TC-UAT-04 — Guest Mode Flow (UC-04)

**Setup:** Log out completely / use incognito.

| # | Step | Expected Result | Observed | Pass/Fail |
|---|---|---|---|---|
| 1 | Click "Enter as Guest" | Goes straight into the profile form, no login needed |direct to form fill up as i clicked| Pass |
| 2 | Fill the form and predict | Result screen appears same as logged-in flow |same screen |Pass |
| 3 | Check the result screen | Shows outcome/confidence/factors PLUS a banner: "This result won't be saved. Sign in to keep it..." with a Sign in link |it does show all four things, with a clickable sign in link |Pass |
| 4 | Look for History/Progress nav links | They should NOT be present/accessible in guest mode |no option of hamburget button |Pass |
| 5 | Start filling a new guest prediction, then try to navigate away (browser back button) partway through | A confirmation prompt should appear before losing your entered data |yes it did both on pc and mobile |Pass |

**Overall TC-UAT-04 result:** Pass / Fail — Notes: __everything worked as intended__


---

## Summary (fill in last)

| Test Case | Result | Blocking issues found? |
|---|---|---|
| TC-UAT-01 (Google Sign-In) |Pass | None |
| TC-UAT-02 (Prediction Flow) |Pass |None |
| TC-UAT-03 (History/Progress) |Pass | None|
| TC-UAT-04 (Guest Mode) | Pass|None |

Once this is filled in, send it back and I'll fold it into the final document.
