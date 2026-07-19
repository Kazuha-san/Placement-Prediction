import React from 'react';
import Tooltip from './Tooltip';

const FormField = ({ label, tooltip, type, name, value, onChange, onBlur, error, min, max, step }) => {
  const isCheckbox = type === 'checkbox';

  return (
    <div className="mb-4">
      <div className="flex items-center mb-1">
        <label htmlFor={name} className="block text-sm font-medium text-color-text-main">
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
            className="w-4 h-4 text-color-primary bg-color-surface border-gray-600 rounded focus:ring-color-primary focus:ring-2"
          />
          <span className="ml-2 text-sm text-color-text-muted">Yes</span>
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
          className={`w-full px-3 py-2 bg-color-surface border rounded focus:outline-none focus:ring-2 focus:ring-color-primary ${error ? 'border-color-error' : 'border-color-surface-light'}`}
        />
      )}
      
      {error && (
        <p className="mt-1 text-xs text-color-error">{error}</p>
      )}
    </div>
  );
};

export default FormField;
