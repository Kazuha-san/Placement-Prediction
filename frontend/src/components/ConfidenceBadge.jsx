import React from 'react';

const ConfidenceBadge = ({ score }) => {
  const percentage = Math.round(score * 100);

  let style = { bg: 'var(--color-success-bg)', line: 'var(--color-success-line)', text: 'var(--color-success)' };
  if (percentage < 40) {
    style = { bg: 'var(--color-danger-bg)', line: 'var(--color-danger-line)', text: 'var(--color-danger)' };
  } else if (percentage < 70) {
    style = { bg: 'var(--color-warning-bg)', line: 'var(--color-warning-bg)', text: 'var(--color-warning)' };
  }

  return (
    <div
      className="inline-flex items-center px-4 py-1.5 rounded-pill font-mono-readout text-sm font-semibold border"
      style={{ backgroundColor: style.bg, borderColor: style.line, color: style.text }}
    >
      {percentage}% confidence
    </div>
  );
};

export default ConfidenceBadge;
