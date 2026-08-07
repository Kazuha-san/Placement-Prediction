import React from 'react';
import Tooltip from './Tooltip';

/**
 * Free-typed number entry, floor 1, hard UI ceiling 999 (per spec:
 * open-ended but capped at the UI level so the field can't be abused).
 */
const NumberField = ({ label, tooltip, name, value, onChange, onBlur, error, min = 0, max = 999 }) => {
  const handleChange = (e) => {
    let v = e.target.value;
    if (v === '') {
      onChange(e);
      return;
    }
    let num = Number(v);
    if (Number.isNaN(num)) return;
    if (num > max) num = max;
    if (num < min) num = min;
    onChange({ target: { name, value: String(num), type: 'number' } });
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
        min={min}
        max={max}
        placeholder="0"
        className={`w-full px-4 py-3 bg-card border-2 rounded-2xl focus:outline-none focus:ring-2
          focus:ring-[var(--color-primary-to)] transition-colors font-mono-readout
          ${error ? 'border-danger' : 'border-line focus:border-transparent'}`}
      />
      {error && <p className="mt-1 text-xs text-danger font-medium">{error}</p>}
    </div>
  );
};

export default NumberField;
