# Placement Predictions — SRS (Agent-Readable Edition)

> AI-based campus placement prediction system. Source: `SRS_PlacementPredictions_v1_2.docx`, IEEE Std 830-1998 format, v1.0, 28 June 2026, Sagar Shrivastava, Dept. of AI & ML, Oriental College of Technology, Bhopal.
> Reformatted for readability — no content removed or altered from the original.

---

## 0. Quick Reference (TL;DR for agents)

**What it is:** Web app where students enter academic/skill data and get an ML-predicted placement probability (self-assessment tool only — does not participate in actual placement process).

**Stack (mandatory, not optional):**
| Layer | Tech |
|---|---|
| Frontend | React + Tailwind CSS |
| Backend | Python 3.14, FastAPI or Flask |
| ML | scikit-learn, Random Forest, binary classifier, loaded as `.pkl`/`.joblib` at server start-up |
| Database | PostgreSQL (relational) |
| Auth | OAuth 2.0 — Google Identity Services + Microsoft Identity Platform; sessions via JWT |
| Comms | HTTPS + REST/JSON API |

**Core entities/flows:** Auth (Google/Microsoft/Guest) → Profile form (9 fields) → Predict → Result (label + confidence + top contributing features) → History → Progress chart.

**Training data:** [Placement Prediction Dataset, Kumbhar R., 2025, Kaggle](https://www.kaggle.com/datasets/ruchikakumbhar/placement-prediction-dataset) — PII and protected attributes must be stripped before training.

**Hard numeric targets to build against:**
- Prediction response to user: ≤ 2s (NFR-1.1)
- Model inference only: ≤ 500ms (NFR-3.1), logged if exceeded (NFR-3.2)
- ≥ 100 concurrent sessions without breaching NFR-1.1 (NFR-2.1)
- ≥ 500 predictions/hour sustained (NFR-2.2)
- Model file < 200MB (design constraint)
- Model minimum accuracy ≥ 75% to be deployed (3.6.1)
- Uptime ≥ 98%/month during academic terms (NFR Availability)
- New user: form-to-result in ≤ 5 minutes, self-service via inline guidance only (Usability)

---

## 1. Introduction

### 1.1 Purpose
SRS for Placement Predictions, an AI-based campus placement prediction system. Takes a student's academic results, skills, and activities as input; a trained ML model outputs the probability of getting a placement offer. Covers full system scope. Audience: development team, college faculty, project evaluators/testers, future maintainers.

### 1.2 Scope
Web-based software. Students input their academic/skill profile and receive a placement outcome prediction + confidence percentage. Goal: help students self-assess and identify improvement areas before placement season.

**Important framing constraint:** This is a decision-support / self-assessment tool only. The prediction is an indicator, not a definitive result. **The system does not participate in the actual placement process.**

### 1.3 Definitions, Acronyms, Abbreviations
| Term | Definition |
|---|---|
| SRS | Software Requirements Specification |
| CGPA | Cumulative Grade Point Average |
| Confidence Score | Probability (%) the model assigns to a predicted outcome |
| Feature | An individual measurable input variable used by the model |
| FR | Functional Requirement identifier |
| NFR | Non-Functional Requirement identifier |
| Model | The trained ML classifier generating predictions |
| OAuth 2.0 | Open standard authorization protocol for third-party sign-in (e.g. Google, Microsoft) without sharing passwords |
| Guest Mode | One-time session for a prediction without account creation/login. No data saved. |

### 1.4 References
- IEEE Std 830-1998, IEEE Recommended Practice for Software Requirements Specifications.
- Karl E. Wiegers, *Software Requirements*, 3rd Edition, Microsoft Press.
- scikit-learn documentation — https://scikit-learn.org/stable/documentation.html
- Kumbhar, R. (2025). Placement Prediction Dataset. Kaggle. https://www.kaggle.com/datasets/ruchikakumbhar/placement-prediction-dataset

### 1.5 Overview of this document
- **Section 2** — general description: context, functions, users, environment, constraints, assumptions. (Sufficient for surface-level understanding.)
- **Section 3** — full technical spec: interfaces, functional/non-functional requirements, use cases, performance targets, design constraints, quality attributes, AI/ML requirements. (Required reading for implementation/testing/evaluation.)

---

## 2. Overall Description

### 2.1 Product Perspective
Standalone web application, not integrated with any existing institutional system. Three layers:
1. **Frontend** (browser) — data entry + results display.
2. **Backend application server** — runs the trained ML model, handles all logic.
3. **Relational database** — stores user accounts and prediction history.

Training data source: Placement Prediction Dataset (Kumbhar, R., 2025, Kaggle).

### 2.2 Product Functions
- Sign-in via Google or Microsoft OAuth 2.0, plus Guest Mode (one-time, no account).
- Structured input form collecting a student's academic and skill data.
- ML-based placement likelihood prediction.
- Result display: outcome + confidence score + improvement suggestions.
- Progress chart: confidence score trend across multiple submissions over time.
- Secure storage of prediction records + history retrieval.

### 2.3 User Classes and Characteristics
| User Class | Characteristics |
|---|---|
| **Student (Authenticated)** | Primary end user. Signs in via Google or Microsoft. Submits academic/skill data to view personal predictions, history, and progress chart. |
| **Student (Guest)** | One-time user. Submits a single prediction without signing in. No data saved; history/progress features unavailable. |

### 2.4 Operating Environment
- **Client:** Any modern browser (Chrome, Firefox, Edge, Safari), desktop or mobile. No client-side install.
- **Server:** Python 3.14 backend (FastAPI or Flask) serving a trained scikit-learn model. Cloud or institutional hosting.
- **Database:** Relational DB such as PostgreSQL.

### 2.5 Design and Implementation Constraints
- Prediction accuracy is directly dependent on training data quality; a small/biased dataset limits model performance.
- Student-entered data is self-reported — cross-verification against official institution records is **out of scope**.
- Backend + ML model **must** be Python. Frontend **must** be React.
- All student data must be stored/transmitted per applicable data privacy regulations.

### 2.6 Assumptions and Dependencies
- ML model trained on the Placement Prediction Dataset (Kumbhar, R., 2025, Kaggle) — public, labelled, contains student academic/skill attributes + actual placement outcomes.
- Students are assumed to enter data accurately; system has no way to verify self-reported values.
- Relies on third-party libraries: scikit-learn, pandas, FastAPI/Flask, React; plus cloud/institutional hosting.
- OAuth 2.0 sign-in depends on Google and Microsoft identity provider uptime — any downtime there affects authentication.

---

## 3. Specific Requirements

### 3.1 External Interface Requirements

#### 3.1.1 User Interface
Main screens:
- Sign-in screen: "Continue with Google", "Continue with Microsoft", "Continue as Guest".
- Data-entry form with inline field validation.
- Results screen: predicted outcome + confidence score.
- History view: all past predictions for the logged-in student, reverse chronological order.
- Progress chart view: confidence score trend over time.

Design principles: simple, form-based, clear field labels, tooltips, sufficient colour contrast for basic accessibility.

#### 3.1.2 Hardware Interfaces
None required. Runs entirely in-browser on any standard device with a network connection.

#### 3.1.3 Software Interfaces
| Component | Detail |
|---|---|
| Frontend Framework | React + Tailwind CSS, REST/JSON API to backend |
| Backend Framework | Python REST API (FastAPI), endpoints for prediction, authentication, dashboard data |
| ML Library | scikit-learn classifier, loaded as serialized `.pkl`/`.joblib` at server start-up |
| Database | PostgreSQL — user accounts, profiles, prediction history |
| Authentication | Google Identity Services + Microsoft Identity Platform (OAuth 2.0) |

#### 3.1.4 Communications Interfaces
- Client↔server: HTTPS, REST/JSON API.
- Session auth: JWT tokens.
- OAuth 2.0: standard redirect-based flows with identity providers.
- No email/FTP or other protocols required for core features.

---

### 3.2 Functional Requirements

#### 3.2.1 User Authentication Module
| ID | Requirement |
|---|---|
| FR-1.1 | Provide "Continue with Google" and "Continue with Microsoft" sign-in via OAuth 2.0 — no separate account/password needed. |
| FR-1.2 | On selecting an OAuth option, redirect to provider's auth page. On success, create a new account or retrieve the existing one linked to that identity, automatically. |
| FR-1.3 | If OAuth provider errors or user denies access, show an appropriate error message and return to sign-in screen; no account created. |
| FR-1.4 | Provide Guest Mode: one prediction without sign-in. No guest-session data saved to any account or persistent storage. |
| FR-1.5 | History and progress chart unavailable in Guest Mode. After a guest prediction, prompt the guest to sign in to unlock these features. |

#### 3.2.2 Profile Entry Module
| ID | Requirement |
|---|---|
| FR-2.1 | On accessing the profile form, present fields for: CGPA, number of completed internships, number of completed projects, number of workshops/certifications, aptitude test score, soft skills rating, extracurricular activities, placement training status, active backlog count. |
| FR-2.2 | If any field is out of valid range (e.g. CGPA > 10, negative backlog count), reject submission, highlight the field, show inline error. |
| FR-2.3 | "Predict" button stays disabled until all fields are filled and pass validation. |

#### 3.2.3 Placement Prediction Module
| ID | Requirement |
|---|---|
| FR-3.1 | On "Predict" click, transmit profile data to the trained binary classification model for inference. |
| FR-3.2 | On receiving the model's response, display predicted outcome (**Placed** / **Not Placed**) + confidence score on the result screen. |
| FR-3.3 | If the prediction service doesn't respond within the defined timeout, show "service unavailable, please try again"; no incomplete/partial prediction written to history. |

#### 3.2.4 Prediction History Module
| ID | Requirement |
|---|---|
| FR-4.1 | Each successful prediction is saved to the student's account with a timestamp. |
| FR-4.2 | "History" tab shows all past predictions for the logged-in student, reverse chronological (most recent first). |
| FR-4.3 | "Progress" view renders a line chart of confidence score across all past predictions, chronological order, so the student can track improvement. |

#### 3.2.5 Use Cases

**Use Case 1: Student Receives a Placement Prediction**

| | |
|---|---|
| **Description** | A logged-in student fills in their academic/skill profile and receives a prediction + improvement suggestions. |
| **Primary actor** | Student |
| **Stakeholders** | College/Institution |
| **Trigger** | Student clicks "Predict" after completing and validating the profile form. |
| **Precondition** | Student registered and logged in. All form fields complete, no validation errors. |
| **Postcondition** | Prediction record stored in student's history; result visible on screen. |

*Basic Flow:*
1. Student enters CGPA, internships, projects, workshops/certifications, aptitude test score, soft skills rating, extracurricular activities, placement training status, backlog count.
2. Student clicks "Predict".
3. System forwards validated profile data to the backend prediction service.
4. ML model returns predicted class label + confidence score to the backend.
5. System identifies which input features contributed most to the predicted outcome.
6. Result screen shows predicted outcome + confidence score; prediction saved to history.

*Alternate Paths:*
- **Path A — Validation Failure:** Any field fails validation (e.g. negative CGPA) → block submission at Step 2, highlight invalid field, inline error. Student corrects and resubmits.
- **Path B — Prediction Service Unavailable:** No response within timeout at Step 3 → show "service unavailable, please try again". Incomplete prediction is **not** logged to history.

**Use Case 2: Student Views Prediction History**

| | |
|---|---|
| **Description** | A logged-in student opens the History tab to review previous predictions and track outcome changes over time. |
| **Primary actor** | Student |
| **Stakeholders** | College/Institution, database service provider |
| **Trigger** | Student selects "History" tab from nav menu. |
| **Precondition** | Student registered, logged in, has ≥1 prior prediction stored. |
| **Postcondition** | Student has viewed full prediction history, and optionally full details of any selected past entry. |

*Basic Flow:*
1. Student navigates to "History" tab.
2. System queries the database, retrieves all prediction records linked to the account.
3. Records sorted reverse chronological (most recent first).
4. System displays each record: timestamp, predicted outcome, confidence score.
5. Student may click any record to expand full details generated at that time.

*Alternate Paths:*
- **Path A — No History Available:** No records exist → show "No predictions yet — submit your profile to get started" instead of an empty list.
- **Path B — Retrieval Failure:** History service fails → show "couldn't load history, please try again". Page must not crash or show blank screen.

---

### 3.3 Performance Requirements

#### 3.3.1 Response Time
| ID | Requirement |
|---|---|
| NFR-1.1 | On submission of a prediction request, return result to student within **2 seconds** under normal operating conditions. |

#### 3.3.2 Throughput and Capacity
| ID | Requirement |
|---|---|
| NFR-2.1 | Support a minimum of **100 concurrent active sessions** without breaching the NFR-1.1 response time target. |
| NFR-2.2 | Handle sustained throughput of **≥ 500 prediction requests/hour** with no measurable response-time degradation. |

#### 3.3.3 Model Inference Performance
| ID | Requirement |
|---|---|
| NFR-3.1 | From the moment a prediction request reaches the backend, the model shall complete inference and return output within **500 milliseconds**. |
| NFR-3.2 | Any inference exceeding the 500ms threshold shall be **logged automatically** for performance monitoring. Such delays must not cause the user-facing response to exceed the timeout defined in FR-3.3. |

---

### 3.4 Design Constraints
- Comply with applicable data privacy regulations for all storage/handling of student records.
- Trained model file must stay **under 200 MB** (compatible with standard cloud hosting tiers).
- All API responses structured per the project's JSON API specification.
- Development must use the technology stack defined in Section 2.4.

---

### 3.5 Software System Attributes

#### 3.5.1 Reliability
Proper fallback when the prediction service is temporarily unavailable — clear error message shown, no submitted data lost.

#### 3.5.2 Availability
Minimum uptime of **98%** during academic terms, calculated monthly.

#### 3.5.3 Security
- All data transfers protected via HTTPS/TLS.
- OAuth 2.0 tokens validated **server-side** on every authenticated request.
- Access to any individual student's records restricted to that student only.

#### 3.5.4 Maintainability
Modular codebase with clear separation between prediction service, API layer, and frontend. Each layer independently updatable/replaceable without changes to the others.

#### 3.5.5 Usability
A first-time student user shall complete the profile entry form and obtain a prediction result within **5 minutes**, relying only on inline field guidance in the interface (no external help needed).

---

### 3.6 AI/ML

#### 3.6.1 Model Specification
- Supervised **binary classification** model based on **Random Forest**, trained on historical student placement records.
- **Input features (9):** CGPA, number of internships completed, number of projects completed, number of workshops/certifications completed, aptitude test score, soft skills rating, extracurricular activities, placement training status, active backlog count.
- **Target label:** placement outcome (placed / not placed).
- Model outputs both a **class prediction** and a **confidence score**.
- **Minimum accuracy 75%** required for the model to be used/deployed.

#### 3.6.2 Data Management
- Trained on the Placement Prediction Dataset (Kumbhar, R., 2025, Kaggle) — publicly available.
- **Must remove before training:**
  - PII: name, status, stature, etc.
  - Protected attributes: caste, religion, gender, etc.

#### 3.6.3 Guardrails
- All input values validated before being passed to the model.
- Any profile with out-of-range or implausible values → **rejected prior to inference**.
- Any required field missing → **no prediction generated**; return a validation error instead.

#### 3.6.4 Ethics
- All prediction results presented as **probabilistic estimates**, not definitive outcomes.
- A **disclaimer must appear on every result screen** shown to the student.

#### 3.6.5 Model Lifecycle and Operations
- Model retrained on a regular schedule, **at least once per academic year**, or earlier if prediction accuracy drops below an agreed threshold.
- Before each deployment, log the new model version with: training date, dataset version trained on, and validation performance metrics.

---

## Revision History
| Author | Date | Description | Version |
|---|---|---|---|
| Sagar Shrivastava | 28/06/2026 | Initial draft of the SRS for the Placement Prediction System. | 1.0 |

---

## Appendix: Requirement ID Index (for cross-referencing in code/PRs)

**Functional Requirements**
- Auth: FR-1.1, FR-1.2, FR-1.3, FR-1.4, FR-1.5
- Profile Entry: FR-2.1, FR-2.2, FR-2.3
- Prediction: FR-3.1, FR-3.2, FR-3.3
- History: FR-4.1, FR-4.2, FR-4.3

**Non-Functional Requirements**
- Response Time: NFR-1.1
- Throughput/Capacity: NFR-2.1, NFR-2.2
- Model Inference: NFR-3.1, NFR-3.2
