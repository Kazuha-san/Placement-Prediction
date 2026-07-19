import React from 'react';
import Tooltip from './Tooltip';

const FormField = ({ label, tooltip, type, name, value, onChange, onBlur, error, min, max, step }) => {
  const isCheckbox = type === 'checkbox';

  return (
    <div className="mb-6">
      <div className="flex items-center mb-1.5">
        <label htmlFor={name} className="block text-sm font-medium text-ink">
          {label}
        </label>
        {tooltip && <Tooltip text={tooltip} />}
      </div>
      
      {isCheckbox ? (
        <div className="flex items-center mt-2">
          <input
            type="checkbox"
            id={name}
            name={name}
            checked={value}
            onChange={onChange}
            onBlur={onBlur}
            className="w-5 h-5 accent-[#D9CDEF] bg-white border-2 border-line-strong rounded-md focus:ring-blue focus:ring-2"
          />
          <span className="ml-2 text-sm text-muted">Yes</span>
        </div>
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          min={min}
          max={max}
          step={step}
          className={`w-full px-4 py-2.5 bg-white border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue transition-colors ${error ? 'border-coral' : 'border-line focus:border-blue'}`}
        />
      )}
      
      {error && (
        <p className="mt-1 text-xs text-coral font-medium">{error}</p>
      )}
    </div>
  );
};

export default FormField;
