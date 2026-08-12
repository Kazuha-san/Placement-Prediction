import React from 'react';
import Tooltip from './Tooltip';

/**
 * Free-typed number entry (projects, certifications). Types normally like any
 * number field - no artificial typing restriction - but never silently
 * corrects an out-of-range value. Instead it flags invalid immediately as
 * the person types, and stays invalid until they fix it themselves. This is
 * intentional: silently clamping "9999" to "50" with no feedback hides the
 * mistake instead of catching it.
 */
const NumberField = ({ label, tooltip, name, value, onChange, onBlur, error, min = 0, max = 50 }) => {
  const handleChange = (e) => {
    // Pass the raw typed value straight through, untouched - validation
    // (in ProfileForm) decides if it's valid, this field never "fixes" it.
    onChange({ target: { name, value: e.target.value, type: 'number' } });
  };

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
        onBlur={onBlur}
        placeholder="0"
        aria-invalid={!!error}
        className={`w-full px-4 py-3 bg-card border-2 rounded-2xl focus:outline-none focus:ring-2
          focus:ring-[var(--color-primary-to)] transition-colors font-mono-readout
          ${error ? 'border-danger' : 'border-line focus:border-transparent'}`}
      />
      {error && <p className="mt-1 text-xs text-danger font-medium">{error}</p>}
      {!error && <p className="mt-1 text-xs text-muted">0–{max}</p>}
    </div>
  );
};

export default NumberField;
