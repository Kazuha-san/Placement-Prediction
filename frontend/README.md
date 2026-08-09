# Placement Predictions Frontend

React + Vite frontend for the **Placement Predictions** app. Lets a student enter
their academic profile, get a placement confidence score with the key factors
behind it, and track their prediction history over time.

## Tech stack
- **Framework:** React 18
- **Build tool:** Vite
- **Routing:** React Router
- **Styling:** Tailwind CSS v4

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment variables** — copy `.env.example` to `.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   VITE_ENABLE_DEMO_LOGIN=true   # set to false to hide the demo-account link entirely
   ```

3. **Start the dev server**
   ```bash
   npm run dev
   ```
   Runs at `http://localhost:5173`.

   From the repo root, `python scripts/run_dev.py` (or `scripts/run_dev.bat`
   on Windows) starts this and the backend together in one step.

4. **Build for production**
   ```bash
   npm run build
   ```
   Output goes to `dist/`.

## Deploying to Vercel

Set the **Root Directory** to `frontend` when importing the repo. Vercel
auto-detects Vite (build: `npm run build`, output: `dist`) - no need to
override those. Add the two env vars above (pointing `VITE_API_BASE_URL` at
the real deployed backend), then deploy.

`vercel.json` in this folder rewrites all paths to `index.html` - required
because this is a single-page app with client-side routes (e.g.
`/auth/callback`); without it, a direct load of any route other than `/`
404s on Vercel.

## Key features

- **Google sign-in** and a **guest mode** (try it without an account, nothing saved).
- **Demo account** (toggle via `VITE_ENABLE_DEMO_LOGIN`) - lets a reviewer see
  the app fully populated with sample history, no real login needed.
- **Light/dark theme**, defaults to light, persisted in `localStorage`.
- Guest sessions guard against the browser Back button silently abandoning
  the session without confirmation (`GuestExitGuard`).

## Project structure

```
src/
  pages/          One file per route (Landing, SignIn, ProfileForm, Result, History, Settings, ...)
  components/      Shared UI: modals, form fields, TopBar/Drawer, ConfirmModal, etc.
  context/         AuthContext (user/guest session), ThemeContext (light/dark)
  services/api.js  All backend fetch calls
```
