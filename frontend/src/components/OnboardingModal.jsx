import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import Select from './Select';

const SEMESTERS = Array.from({ length: 8 }, (_, i) => i + 1);
const YEARS = [1, 2, 3, 4];

/**
 * Shown once, right after a brand-new user's first successful Google
 * sign-in, before they land on the main app. `onComplete` receives
 * { displayName, semester, year } — wire this to whatever profile-update
 * call your backend exposes (see SETUP.md).
 */
const OnboardingModal = ({ onComplete, error }) => {
  const [displayName, setDisplayName] = useState('');
  const [semester, setSemester] = useState('');
  const [year, setYear] = useState('');
  const [touched, setTouched] = useState(false);

  const isValid = displayName.trim().length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (!isValid) return;
    onComplete({ displayName: displayName.trim(), semester: semester || null, year: year || null });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 scrim scrim-enter" />
      <div className="relative z-10 w-full max-w-md glass-card p-8 page-enter">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="chip p-4 mb-4"><UserPlus size={24} /></div>
          <h2 className="font-display text-xl font-semibold text-ink mb-1">Set up your profile</h2>
          <p className="text-sm text-muted max-w-xs">
            Just a couple of details so your predictions make sense at a glance.
          </p>
          {error && (
            <p className="mt-2 text-xs text-danger font-medium">
              {error}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="displayName" className="block text-sm font-semibold text-ink mb-1.5">
              Display name <span style={{ color: 'var(--color-danger)' }}>*</span>
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="What should we call you?"
              className={`w-full px-4 py-3 bg-card border-2 rounded-2xl focus:outline-none focus:ring-2
                focus:ring-[var(--color-primary-to)] transition-colors
                ${touched && !isValid ? 'border-danger' : 'border-line focus:border-transparent'}`}
            />
            {touched && !isValid && (
              <p className="mt-1 text-xs text-danger font-medium">Display name is required</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="semester" className="block text-sm font-semibold text-ink mb-1.5">
                Semester <span className="text-muted font-normal">(optional)</span>
              </label>
              <Select
                id="semester"
                value={semester}
                onChange={setSemester}
                options={SEMESTERS.map((s) => ({ value: String(s), label: `Semester ${s}` }))}
              />
            </div>
            <div>
              <label htmlFor="year" className="block text-sm font-semibold text-ink mb-1.5">
                Year <span className="text-muted font-normal">(optional)</span>
              </label>
              <Select
                id="year"
                value={year}
                onChange={setYear}
                options={YEARS.map((y) => ({ value: String(y), label: `Year ${y}` }))}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary font-semibold py-3.5 mt-2">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default OnboardingModal;
