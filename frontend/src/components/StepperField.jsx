import React from 'react';
import { Minus, Plus } from 'lucide-react';
import Tooltip from './Tooltip';

/**
 * Up/down stepper with a "10+" cap label on the final step.
 * value is a number 1-10 internally; 10 displays as "10+".
 */
const StepperField = ({ label, tooltip, name, value, onChange, onBlur, min = 0, max = 10 }) => {
  const numValue = (value !== undefined && value !== null && value !== '' && !Number.isNaN(Number(value))) ? Number(value) : min;
  const displayValue = numValue >= max ? `${max}+` : String(numValue);

  const fireChange = (next) => {
    const clamped = Math.max(min, Math.min(max, next));
    onChange({ target: { name, value: clamped, type: 'number' } });
  };

  const handleInputChange = (e) => {
    let num = Number(e.target.value);
    if (Number.isNaN(num)) return;
    fireChange(num);
  };

  return (
    <div className="mb-7">
      <div className="flex items-center mb-2">
        <label htmlFor={name} className="block text-sm font-semibold text-ink">{label}</label>
        {tooltip && <Tooltip text={tooltip} />}
      </div>

      <div className="flex items-center gap-3 surface-card px-3 py-2 w-fit">
        <button
          type="button"
          onClick={() => fireChange(numValue - 1)}
          onBlur={onBlur}
          disabled={numValue <= min}
          aria-label={`Decrease ${label}`}
          className="w-10 h-10 rounded-full flex items-center justify-center border border-line
            hover:border-line-strong hover:bg-panel transition-colors disabled:opacity-30 disabled:pointer-events-none"
        >
          <Minus size={16} />
        </button>

        <span className="font-mono-readout text-lg font-semibold text-ink w-14 text-center select-none">
          {displayValue}
        </span>

        <input
          type="number"
          id={name}
          name={name}
          value={value}
          onChange={handleInputChange}
          onBlur={onBlur}
          className="sr-only"
        />

        <button
          type="button"
          onClick={() => fireChange(numValue + 1)}
          onBlur={onBlur}
          disabled={numValue >= max}
          aria-label={`Increase ${label}`}
          className="w-10 h-10 rounded-full flex items-center justify-center border border-line
            hover:border-line-strong hover:bg-panel transition-colors disabled:opacity-30 disabled:pointer-events-none"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
};

export default StepperField;
