**Software Requirements Specification**

*for*

**Placement Predictions: An AI-Based Placement Prediction System**

*IEEE Std 830-1998 Format*

Version 1.0

**Prepared by:**

Sagar Shrivastava

(0126AL241104)

Department of Artificial Intelligence and Machine Learning

Oriental College of Technology, Bhopal

Date: 28 June 2026

Revision History

1. Introduction

1.1 Purpose

1.2 Scope

1.3 Definitions, Acronyms, and Abbreviations

1.4 References

1.5 Overview

2. Overall Description

2.1 Product Perspective

2.2 Product Functions

2.3 User Classes and Characteristics

2.4 Operating Environment

2.5 Design and Implementation Constraints

2.6 Assumptions and Dependencies

3. Specific Requirements

3.1 External Interface Requirements

3.1.1 User Interface

3.1.2 Hardware Interfaces

3.1.3 Software Interfaces

3.1.4 Communications Interfaces

3.2 Functional Requirements

3.2.1 User Authentication Module

3.2.2 Profile Entry Module

3.2.3 Placement Prediction Module

3.2.4 Prediction History Module

3.2.5 Use Cases

3.3 Performance Requirements

3.3.1 Response Time

3.3.2 Throughput and Capacity

3.3.3 Model Inference Performance

3.4 Design Constraints

3.5 Software System Attributes

3.5.1 Reliability

3.5.2 Availability

3.5.3 Security

3.5.4 Maintainability

3.5.5 Usability

3.6 AI/ML

3.6.1 Model Specification

3.6.2 Data Management

3.6.3 Guardrails

3.6.4 Ethics

3.6.5 Model Lifecycle and Operations

## Revision History

| **Author's Name** | **Date**   | **Description**                                               | **Version** |
|-------------------|------------|---------------------------------------------------------------|-------------|
| Sagar Shrivastava | 28/06/2026 | Initial draft of the SRS for the Placement Prediction System. | 1.0         |

# 1. Introduction

## 1.1 Purpose

This is the software requirement specifications for Placement Predictions, an AI-based campus placement prediction system. The system takes a student's academic results, skills and activities throughout the college years as input and uses a trained machine learning model to tell the probability of the student getting a placement offer. This SRS covers the full scope of the system.

This document is intended for the development team, college faculty, project evaluators/testers and anyone responsible for future maintenance.

## 1.2 Scope

Placement Predictions is a web-based software that allows students to evaluate their academic and skill profile and receive a prediction of placement outcome along with a confidence percentage. The system's primary goal is to help students assess their current situation and identify the areas for improvement before the placement season starts.

This system acts as a decision support tool used only for self-assessment by the student. The prediction is treated as an indicator rather than a definitive result. The system will not take part in actual placement process itself.

## 1.3 Definitions, Acronyms, and Abbreviations

| **Term**         | **Definition**                                                                                                                                                                             |
|------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| SRS              | Software Requirements Specification.                                                                                                                                                       |
| CGPA             | Cumulative Grade Point Average, a summary measure of a student's academic performance.                                                                                                     |
| Confidence Score | The probability, expressed as a percentage, that the model assigns to a predicted outcome.                                                                                                 |
| Feature          | An individual measurable input variable used by the model.                                                                                                                                 |
| FR               | Functional Requirement identifier.                                                                                                                                                         |
| NFR              | Non-Functional Requirement identifier.                                                                                                                                                     |
| Model            | The trained machine learning classifier used to generate placement predictions.                                                                                                            |
| OAuth 2.0        | An open standard authorization protocol that allows users to sign in using an existing account from a trusted provider (e.g., Google) without sharing their password with the application. |
| Guest Mode       | A one-time use session that allows a student to submit a prediction without creating or signing into an account. No data is saved during a guest session.                                  |

## 1.4 References

- IEEE Std 830-1998, IEEE Recommended Practice for Software Requirements Specifications.

- Karl E. Wiegers, Software Requirements, 3rd Edition, Microsoft Press.

- scikit-learn documentation, https://scikit-learn.org/stable/documentation.html

- Kumbhar, R. (2025). Placement Prediction Dataset. Kaggle. https://www.kaggle.com/datasets/ruchikakumbhar/placement-prediction-dataset

## 1.5 Overview

The rest of this document is structured as follows:

Section 2 provides a general description of the product -- covering its context, main functions, intended users, operating environment, known constraints, and assumptions.

Section 3 goes into the full technical specification, including external interfaces, functional and non-functional requirements, use cases, performance targets, design constraints, system quality attributes, and requirements specific to the AI/ML components.

Readers who only need a surface-level understanding of the system can stop after Section 2. Those involved in implementation, testing, or formal evaluation should go through Section 3 completely.

# 2. Overall Description

## 2.1 Product Perspective

Placement Predictions is a standalone web application and is not part of any existing institutional system. The system is built around three layers: a browser-based frontend through which students enter data and view results, a backend application server that runs the trained ML model and handles all the logic and a relational database that stores user accounts and prediction history. The system uses the Placement Prediction Dataset (Kumbhar, R., 2025, Kaggle) as its training data source.

## 2.2 Product Functions

The system covers the following core functions:

- User sign-in via Google OAuth 2.0, with a Guest Mode option for one-time use without creating an account.

- Collection of a student's academic and skill data through a structured input form.

- Generating a placement likelihood prediction using a trained ML classifier.

- Displaying the result along with a confidence score and suggestions for what the student could improve.

- A progress chart showing the student's confidence score trend across multiple submissions over time.

- Secure storage of prediction records and the ability for students to retrieve their history.

## 2.3 User Classes and Characteristics

| **User Class**          | **Characteristics**                                                                                                              |
|-------------------------|----------------------------------------------------------------------------------------------------------------------------------|
| Student (Authenticated) | Primary end user. Signs in via Google and submits academic/skill data to view personal predictions, history, and progress chart. |
| Student (Guest)         | One-time user. Submits a single prediction without signing in. No data is saved and history/progress features are not available. |

## 2.4 Operating Environment

- Client: Any modern web browser (Chrome, Firefox, Edge, Safari) on desktop or mobile. No software installation is needed on the client side.

- Server: A Python 3.12 backend (FastAPI or Flask) that loads and serves the trained scikit-learn model. Deployment can be on a cloud platform or the institution's own server.

- Database: A relational database such as PostgreSQL for persistent data storage.

<span id="_Toc234928813" class="anchor"></span>

## 2.5 Design and Implementation Constraints

- The accuracy of predictions is directly dependent on the quality of the historical training data. A small or biased dataset will limit model performance.

- Data entered by students is self-reported. Cross-verification against official institution records is out of scope.

- The backend and ML model must be built in Python. The frontend must use React as the JavaScript framework.

- All student data must be stored and transmitted in accordance with applicable data privacy regulations.

## 2.6 Assumptions and Dependencies

- The system's ML model is trained on the Placement Prediction Dataset (Kumbhar, R., 2025, Kaggle), a publicly available, labelled dataset containing student academic and skill attributes alongside actual placement outcomes.

- Students are assumed to enter their data accurately. The system has no mechanism to verify self-reported values.

- The system relies on third-party libraries including scikit-learn, pandas, FastAPI/Flask, and React, as well as a cloud or institutional hosting provider for deployment.

- OAuth 2.0 sign-in depends on the availability of the Google identity provider service. Any downtime of this external service will affect authentication.

# 3. Specific Requirements

## 3.1 External Interface Requirements

### 3.1.1 User Interface

The UI includes the following main screens:

- A sign-in screen with ‘Continue with Google’ and ‘Continue as Guest’ options.

- A data-entry form with inline field validation.

- A results screen that shows the predicted outcome and confidence score.

- A history view listing all past predictions for the logged-in student in reverse chronological order.

- A progress chart view displaying the student's confidence score trend over time.

The design is kept simple and form-based with clear field labels, tooltips on fields and sufficient colour contrast to meet basic accessibility requirements.

### 3.1.2 Hardware Interfaces

No specific hardware interfaces are required. The system runs entirely through a web browser on any standard device with a network connection.

### 3.1.3 Software Interfaces

- Frontend Framework: React with a CSS utility framework (Tailwind CSS), communicating with the backend over a REST/JSON API.

- Backend Framework: Python-based REST API (FastAPI) exposing endpoints for prediction, authentication, and dashboard data.

- ML Library: scikit-learn classifier loaded into the backend as a serialized model (.pkl/.joblib file) at server start-up.

- Database: Relational database service (PostgreSQL) used for storing user accounts, profiles, and prediction history.

- Authentication: Google Identity Services (OAuth 2.0) for third-party sign-in.

### 3.1.4 Communications Interfaces

Client to server communication uses HTTPS with a REST/JSON API. Session authentication is handled through JWT tokens. OAuth 2.0 flows use standard redirect-based communication with the respective identity providers. No additional protocols such as email or FTP are required for any of the core features.

<span id="_Toc234928821" class="anchor"></span>

## 3.2 Functional Requirements

### 3.2.1 User Authentication Module

- FR-1.1: The system shall provide a "Continue with Google" sign-in option using OAuth 2.0, allowing students to authenticate without creating a separate account or password.

- FR-1.2: On selecting an OAuth option, the system shall redirect the user to the chosen provider's authentication page. On successful authentication, the system shall create a new user account or retrieve the existing one linked to that identity automatically.

- FR-1.3: If the OAuth provider returns an error or the user denies access, the system shall display an appropriate error message and return the user to the sign-in screen without creating any account.

- FR-1.4: The system shall provide a Guest Mode option that allows a student to submit a single prediction without signing in. No data from a guest session shall be saved to any account or persistent storage.

- FR-1.5: Prediction history and the progress chart shall not be available in Guest Mode. The system shall display a prompt inviting the guest to sign in to access these features after a prediction is made.

### 3.2.2 Profile Entry Module

- FR-2.1: When a logged-in student accesses the profile form, the system shall present input fields for CGPA, number of completed internships, number of completed projects, number of workshops/certifications, aptitude test score, soft skills rating, extracurricular activities, placement training status, and active backlog count.

- FR-2.2: If any field contains a value outside its valid range (for example, a CGPA value above 10 or a negative backlog count) the system shall reject the submission, highlight the problematic field and display an inline error message.

- FR-2.3: The "Predict" button shall remain disabled until all form fields have been filled in and validation has passed for each one.

### 3.2.3 Placement Prediction Module

- FR-3.1: On clicking "Predict" the system shall transmit the profile data to the trained binary classification model for inference.

- FR-3.2: On receiving the model's response, the system shall display the predicted outcome (Placed or Not Placed) and the associated confidence score on the result screen.

- FR-3.3: If the prediction service does not respond within the defined time period, the system shall display a "service unavailable, please try again" message. No incomplete or partial prediction shall be written to the student's history in this case.

### 3.2.4 Prediction History Module

- FR-4.1: Each successfully generated prediction shall be saved to the student's account with a timestamp recording when it was made.

- FR-4.2: On opening the "History" tab, all past predictions for the logged-in student shall be displayed in reverse chronological order, with the most recent entry at the top.

- FR-4.3: When a logged-in student opens the "Progress" view, the system shall render a line chart plotting the student's confidence score across all past predictions in chronological order, to allow the student to track their improvement over time.

### 3.2.5 Use Cases

**Use Case 1: Student Receives a Placement Prediction**

*Description:* A logged-in student fills in their academic and skill profile and receives a placement prediction along with suggestions on which areas to improve.

*Actors:*

- Primary actor: Student.

- Stakeholders: College/Institution.

*Trigger Condition:* Student clicks the "Predict" button after completing and validating the profile form.

*Precondition:* Student has a registered account and is currently logged in. All form fields are complete and free of validation errors.

*Postcondition:* A prediction record has been stored in the student's history and the result is visible on the current screen.

*Basic Flow:*

1.  Student enters values for CGPA, internships, projects, workshops/certifications, aptitude test score, soft skills rating, extracurricular activities, placement training status, and backlog count into the form.

2.  Student clicks the "Predict" button.

3.  The system forwards the validated profile data to the backend prediction service.

4.  The ML model returns its predicted class label and confidence score to the backend.

5.  The system identifies which input features contributed most to the predicted outcome.

6.  The result screen shows the predicted outcome and confidence score. The prediction is also saved to the student's history.

*Alternate Paths:*

- Path A - Validation Failure: If any field fails validation (e.g., negative CGPA), the system blocks the form submission at Step 2, highlights the invalid field, and shows an inline error message. The student corrects the value and resubmits.

- Path B - Prediction Service Unavailable: If the prediction service does not respond within the timeout at Step 3, the system displays a "service unavailable, please try again" message. The incomplete prediction is not logged to the student's history.

**  
**

**Use Case 2: Student Views Prediction History**

*Description:* A logged-in student opens the History tab to review previous placement predictions and track how their profile outcomes have changed over time.

*Actors:*

- Primary: Student.

- Stakeholders: College/Institution, database service provider.

*Trigger Condition:* Student selects the "History" tab from the navigation menu.

*Precondition*: Student is registered, logged in, and has at least one prior prediction stored in the system.

*Postcondition:* The student has been able to view their full prediction history, and optionally the complete details of any selected past entry.

*Basic Flow:*

7.  Student navigates to the "History" tab.

8.  The system queries the database and retrieves all prediction records linked to the student's account.

9.  The retrieved records are sorted in reverse chronological order, with the most recent prediction at the top.

10. The system displays each record showing the timestamp, predicted outcome, and confidence score.

11. The student may click on any individual record to expand it and view the full details that were generated at that time.

*Alternate Paths:*

- Path A - No History Available: If no prediction records exist for the student at Step 2, the system displays an informational message ("No predictions yet - submit your profile to get started") rather than an empty list.

- Path B - Retrieval Failure: If the history service fails to return data at Step 2, the system displays a "couldn't load history, please try again" error message. The page must not crash or display a blank screen.

## 3.3 Performance Requirements

### 3.3.1 Response Time

- NFR-1.1: On submission of a prediction request, the system shall return the result to the student within 2 seconds under normal operating conditions.

### 3.3.2 Throughput and Capacity

- NFR-2.1: The system shall support a minimum of 100 concurrent active sessions without the response time target specified in NFR-1.1 being breached.

- NFR-2.2: The system shall be capable of handling a sustained throughput of at least 500 prediction requests per hour with no measurable degradation in response time.<span id="_Toc234928830" class="anchor"></span>

### 3.3.3 Model Inference Performance

- NFR-3.1: From the moment a prediction request reaches the backend, the model shall complete inference and return its output within 500 milliseconds.

- NFR-3.2: Any inference that exceeds the 500 ms threshold shall be logged automatically for performance monitoring. Such delays must not cause the user-facing response to exceed the timeout defined in FR-3.3.

## 3.4 Design Constraints

- The system shall comply with applicable data privacy regulations for all storage and handling of student records.

- The trained model file shall be kept under 200 MB in size to remain compatible with standard cloud hosting tiers.

- All API responses shall be structured according to the JSON format defined in the project's API specification.

- Development must use the technology stack defined in Section 2.4.

## 3.5 Software System Attributes

### 3.5.1 Reliability

The system should have a proper fallback when the prediction service is temporarily unavailable, meaning the user sees a clear error message and no submitted data is lost.

### 3.5.2 Availability

The system should maintain a minimum uptime of 98% during academic terms, calculated on a monthly basis.

### 3.5.3 Security

- All data transfers should be protected using HTTPS/TLS.

- OAuth 2.0 tokens must be validated server-side on every authenticated request.

- Access to any individual student's records should be restricted to that student only.

### 3.5.4 Maintainability

The codebase shall follow a modular structure with clear separation between the prediction service, API layer, and frontend. Each layer must be independently updatable or replaceable without requiring changes to the other layers.

### 3.5.5 Usability

A first-time student user shall be able to complete the profile entry form and obtain a prediction result within 5 minutes, relying only on the inline field guidance provided within the interface itself.<span id="_Toc234928838" class="anchor"></span>

## 3.6 AI/ML

### 3.6.1 Model Specification

- The system shall use a supervised binary classification model based on Random Forest, trained on historical student placement records.

- The input features are CGPA, number of internships completed, number of projects completed, number of workshops/certifications completed, aptitude test score, soft skills rating, extracurricular activities, placement training status, and active backlog count.

- The target label is the placement outcome (placed or not placed). The model shall output both a class prediction and a confidence score for that prediction.

- The model should have a minimum accuracy of 75% or above to be used.

### 3.6.2 Data Management

The system's ML model is trained on the Placement Prediction Dataset (Kumbhar, R., 2025, Kaggle), a publicly available dataset. All personally identifiable information (name, status, stature, etc) and protected attributes (caste, religion, gender, etc) must be removed before the data is used in model training.

### 3.6.3 Guardrails

All input values shall be validated before being passed to the model. Any profile containing out-of-range or implausible values shall be rejected prior to inference. If any required field is absent, the system shall not generate a prediction and shall instead return a validation error to the user.

### 3.6.4 Ethics

All prediction results should be presented as probabilistic estimates rather than definitive outcomes. A disclaimer must appear on every result screen shown to the student.

### 3.6.5 Model Lifecycle and Operations

The model should be retrained on a regular schedule at least once per academic year, or earlier if prediction accuracy drops below an agreed threshold. Before each deployment, the new model version shall be logged with its training date, the dataset version it was trained on and its validation performance metrics.
