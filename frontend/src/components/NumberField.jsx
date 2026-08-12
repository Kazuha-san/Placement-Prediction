import React, { useState } from 'react';
import Tooltip from './Tooltip';

/**
 * Free-typed number entry (projects, certifications).
 *
 * Two UI-level rules, enforced before validation ever sees the value:
 * - Negative numbers can't be entered at all - not via the "-" key, not via
 *   paste, not via the native up/down arrows or mouse-wheel scroll.
 * - Typing (or pasting) a value above `max` clears the field back to empty
 *   immediately and shows the range error, rather than leaving the
 *   out-of-range number sitting in the box.
 */
const NumberField = ({ label, tooltip, name, value, onChange, onBlur, error, min = 0, max = 50 }) => {
  const [overflowError, setOverflowError] = useState(null);

  const handleChange = (e) => {
    // Digits only - strips a "-" that slipped in via paste, plus "+"/"e"
    // etc, so a negative or scientific-notation value can never land here.
    const digitsOnly = e.target.value.replace(/[^0-9]/g, '');

    if (digitsOnly !== '' && Number(digitsOnly) > max) {
      // Out of range on the high end: clear it back to empty instead of
      // letting the bad value sit in the field, but keep the range message
      // up so the person still sees why it was rejected.
      setOverflowError(`${label} must be between ${min} and ${max}`);
      onChange({ target: { name, value: '', type: 'number' } });
      return;
    }

    setOverflowError(null);
    onChange({ target: { name, value: digitsOnly, type: 'number' } });
  };

  const handleKeyDown = (e) => {
    // Block the minus (and +/e, which type="number" would otherwise accept)
    // at the keystroke level - never lets a negative value get typed in the
    // first place.
    if (['-', '+', 'e', 'E'].includes(e.key)) {
      e.preventDefault();
    }
  };

  const handleWheel = (e) => {
    // Scrolling while the field happens to be focused shouldn't silently
    // change the value - only the up/down arrows should. Blurring drops
    // focus so the browser's native wheel-to-step behavior has nothing to
    // act on.
    e.target.blur();
  };

  const displayError = overflowError || error;

  return (
    <div className="mb-7">
      <div className="flex items-center mb-1.5">
        <label htmlFor={name} className="block text-sm font-semibold text-ink">{label}</label>
        {tooltip && <Tooltip text={tooltip} />}
      </div>
      <input
        type="number"
        id={name}
        name={name}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onWheel={handleWheel}
        onBlur={onBlur}
        min={min}
        max={max}
        placeholder="0"
        aria-invalid={!!displayError}
        className={`w-full px-4 py-3 bg-card border-2 rounded-2xl focus:outline-none focus:ring-2
          focus:ring-[var(--color-primary-to)] transition-colors font-mono-readout
          ${displayError ? 'border-danger' : 'border-line focus:border-transparent'}`}
      />
      {displayError && <p className="mt-1 text-xs text-danger font-medium">{displayError}</p>}
      {!displayError && <p className="mt-1 text-xs text-muted">0–{max}</p>}
    </div>
  );
};

export default NumberField;
