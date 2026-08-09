import React from 'react';
import Tooltip from './Tooltip';

/**
 * Gradient-filled slider. Same prop contract as the original component
 * (label, tooltip, name, value, onChange, onBlur, min, max, step) so it
 * drops into ProfileForm without changes to the surrounding logic.
 */
const RangeSlider = ({ label, tooltip, name, value, onChange, onBlur, min, max, step, typicalMin, typicalMax, unit = '' }) => {
  const minVal = parseFloat(min);
  const maxVal = parseFloat(max);
  const val = parseFloat(value) || 0;
  const fillPercent = Math.max(0, Math.min(100, ((val - minVal) / (maxVal - minVal)) * 100));

  const typMinVal = typicalMin != null ? parseFloat(typicalMin) : null;
  const typMaxVal = typicalMax != null ? parseFloat(typicalMax) : null;

  return (
    <div className="mb-7">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <label htmlFor={name} className="block text-sm font-semibold text-ink">
            {label}
          </label>
          {tooltip && <Tooltip text={tooltip} />}
        </div>
        <span className="font-mono-readout text-sm font-semibold text-ink chip px-3 py-1">
          {value}{unit}
        </span>
      </div>

      <div className="relative py-2">
        <div className="absolute top-1/2 -translate-y-1/2 w-full h-2.5 bg-line rounded-pill pointer-events-none" />
        {typMinVal != null && typMaxVal != null && (
          <div
            className="absolute top-1/2 -translate-y-1/2 h-2.5 bg-sage/40 rounded-pill pointer-events-none"
            style={{
              left: `${((typMinVal - minVal) / (maxVal - minVal)) * 100}%`,
              width: `${((typMaxVal - typMinVal) / (maxVal - minVal)) * 100}%`,
            }}
          />
        )}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-2.5 rounded-pill pointer-events-none"
          style={{
            width: `${fillPercent}%`,
            background: 'linear-gradient(90deg, var(--color-primary-from), var(--color-primary-to))',
          }}
        />
        <input
          type="range"
          id={name}
          name={name}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className="relative w-full h-7 appearance-none bg-transparent cursor-pointer z-10
            [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:bg-transparent
            [&::-webkit-slider-runnable-track]:rounded-pill
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
            [&::-webkit-slider-thumb]:mt-[-7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-[var(--color-primary-to)]
            [&::-webkit-slider-thumb]:shadow-soft [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:duration-150 hover:[&::-webkit-slider-thumb]:scale-110
            active:[&::-webkit-slider-thumb]:scale-95
            [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:bg-transparent [&::-moz-range-track]:rounded-pill
            [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-[3px] [&::-moz-range-thumb]:border-[var(--color-primary-to)]"
        />
      </div>
      <div className="flex justify-between mt-1 text-xs text-muted">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
};

export default RangeSlider;
