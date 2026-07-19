# Improvements.md (v2) — Placement Predictions

Follow-up review after the real model integration and OAuth Stage 1 (cookie/redirect plumbing) were completed. This supersedes the original `improvements.md` — status of every prior item is listed first, followed by newly found items.

---

## Status of Previous Items

| # | Item | Status |
|---|---|---|
| 1 | OAuth flow disconnected end-to-end | ✅ Fixed (Stage 1 — see item 1 below for what's still pending in Stage 2) |
| 2 | Frontend never attaches auth token | ✅ Fixed — `credentials: 'include'` added to all requests, `/auth/me` added, cookie read correctly in `deps.py` |
| 3 | Route guard lets unauthenticated non-guest users through | ✅ Fixed — `if (isGuest \|\| !user)` |
| 4 | NFR-3.1/3.2 conflated into one hard failure | ✅ Fixed — 1.9s overall timeout (aligned with NFR-1.1), separate `logging.warning` if inference exceeds 500ms without failing the request |
| 5 | `training_ranges.json` missing / gitignored | ✅ Fixed — file present, removed from `.gitignore` |
| 6 | Hardcoded `localhost:8000` | ✅ Fixed — `VITE_API_BASE_URL` env var used throughout |
| 7 | CORS wildcard + credentials conflict | ✅ Fixed — explicit `settings.FRONTEND_URL` used |
| 8 | Feature order hardcoded instead of imported | ✅ Fixed — imports `FEATURE_NAMES` from `feature_schema.py`, with a `schema_mapping` dict correctly bridging the model's real feature names (`workshops_certifications`, `aptitude_test_score`, `active_backlog_count`) to the API's shorter schema names |
| 9 | `print()` instead of `logging` | ✅ Fixed |

All cleanup.md items (root README, frontend README, `App.css`, `hero.png`, `package.json` name, `.gitignore`, `.gitattributes`) are also done — see remaining small misses in the Cleanup section below.

---

## New / Remaining Items

### 1. Class label order still unverified (carried over from MODEL_INTEGRATION_PLAN.md item 4)

`prediction_service.py` still contains:
```python
# Assumes class 1 is "Placed"
if len(proba) > 1:
    confidence = float(proba[1])
    outcome = confidence >= 0.5
```
Nothing in the codebase shows `model.classes_` was actually checked to confirm this assumption. This is the one verification step from the model integration plan that doesn't look confirmed yet — and it's the kind of bug that fails **silently**: if the real encoding is reversed (`0 = Placed, 1 = Not Placed`), every prediction and confidence score would be inverted with no error thrown anywhere.

**Action:** run
```python
import joblib
model = joblib.load("placement_prediction_model.pkl")
print(model.classes_)
```
and confirm which index actually corresponds to "Placed." Fix the `proba[...]` index if it's not 1. Once confirmed, it's worth adding a one-line comment recording what was checked (e.g., `# Verified: classes_ = [False, True], index 1 = Placed`) so this doesn't need re-deriving later.

### 2. OAuth Stage 2 — real token verification still pending (expected, not a bug)

This was always the planned second stage, not a gap in the current work: `callback_google`/`callback_microsoft` still assign hardcoded identities (`test@example.com`, `test@microsoft.com`) rather than verifying the real authorization code/ID token via `google-auth` / `msal`. Flagging here just so it stays tracked as the next concrete step, now that Stage 1's cookie/redirect plumbing is confirmed working.

### 3. Guest login never calls the backend's `/auth/guest` endpoint

`AuthContext.jsx`'s `loginAsGuest()` only sets client-side state (`setIsGuest(true)`) and never calls `POST /auth/guest`. This currently works by coincidence rather than by design — `get_current_user_or_guest` treats "no token at all" and "an explicit guest-flagged token" identically (both resolve to `None`/guest). Not breaking anything today, but the `/auth/guest` endpoint is effectively dead code from the frontend's side, and if that dependency's logic ever changes, this coincidental equivalence could silently stop holding. Worth either wiring the frontend to actually call `/auth/guest`, or removing the endpoint if it's decided to stay client-side-only.

---

## Cleanup — Small Remaining Misses

### 4. `.gitattributes` marks `*.joblib` as binary but not `*.pkl`

The real model file is now `placement_prediction_model.pkl`, not a `.joblib` file. Add:
```
*.pkl binary
```
to `.gitattributes` alongside the existing `*.joblib binary` line (can leave the old line too, in case a joblib file is ever reintroduced, or replace it — either is fine).

### 5. `frontend/README.md` incorrectly states "Styling: Vanilla CSS"

The project actually uses Tailwind CSS (`index.css` imports `tailwindcss`, `@tailwindcss/vite` is a dependency). Update the README's Tech Stack section to say Tailwind CSS instead of Vanilla CSS.

### 6. Leftover unused `react.svg` and `vite.svg` in `frontend/src/assets/`

Same category as the already-cleaned-up `hero.png` — these are default Vite scaffold assets, confirmed unreferenced anywhere in `src/` or `index.html`. Delete both.
