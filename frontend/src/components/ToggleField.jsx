import React from 'react';
import Tooltip from './Tooltip';

const ToggleField = ({ label, tooltip, name, checked, onChange, onBlur }) => {
  const handleClick = () => {
    onChange({ target: { name, checked: !checked, type: 'checkbox' } });
  };

  return (
    <div className="mb-7 flex items-center justify-between surface-card px-5 py-4">
      <div className="flex items-center pr-4">
        <span className="text-sm font-semibold text-ink">{label}</span>
        {tooltip && <Tooltip text={tooltip} />}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={handleClick}
        onBlur={onBlur}
        className="relative w-12 h-7 rounded-pill shrink-0 transition-colors duration-200"
        style={{
          background: checked
            ? 'linear-gradient(90deg, var(--color-primary-from), var(--color-primary-to))'
            : 'var(--color-line)',
        }}
      >
        <span
          className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-soft transition-transform duration-200"
          style={{ transform: checked ? 'translateX(20px)' : 'translateX(0)' }}
        />
      </button>
    </div>
  );
};

export default ToggleField;
