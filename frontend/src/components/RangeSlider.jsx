import React from 'react';
import Tooltip from './Tooltip';

const RangeSlider = ({
  label,
  tooltip,
  name,
  value,
  onChange,
  onBlur,
  min,
  max,
  step,
  typicalMin,
  typicalMax,
  unit = ''
}) => {
  const minVal = parseFloat(min);
  const maxVal = parseFloat(max);
  const typMin = parseFloat(typicalMin);
  const typMax = parseFloat(typicalMax);

  const leftPercent = Math.max(0, Math.min(100, ((typMin - minVal) / (maxVal - minVal)) * 100));
  const widthPercent = Math.max(0, Math.min(100 - leftPercent, ((typMax - typMin) / (maxVal - minVal)) * 100));

  return (
    <div className="mb-6">
      <div className="flex items-center mb-2">
        <label htmlFor={name} className="block text-sm font-medium text-ink">
          {label}
        </label>
        {tooltip && <Tooltip text={tooltip} />}
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative flex-1 py-2">
          {/* Track background */}
          <div className="absolute top-1/2 -translate-y-1/2 w-full h-2 bg-line rounded-full pointer-events-none"></div>
          
          {/* Typical range shaded band */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 h-2 bg-sage/40 pointer-events-none rounded-full"
            style={{ left: `${leftPercent}%`, width: `${widthPercent}%` }}
          ></div>
          
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
            className="relative w-full h-6 appearance-none bg-transparent cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-blue-ink [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:bg-blue focus:outline-none z-10"
          />
        </div>
        <div className="w-16 text-right font-mono-readout text-sm font-semibold text-ink shrink-0">
          {value}{unit}
        </div>
      </div>
      <div className="flex justify-between mt-1 text-xs text-muted">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
};

export default RangeSlider;
