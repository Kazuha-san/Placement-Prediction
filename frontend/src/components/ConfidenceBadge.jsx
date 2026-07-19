import React from 'react';

const ConfidenceBadge = ({ score }) => {
  // Convert 0-1 scale to percentage if necessary, assuming score is 0-100 based on schema output
  const percentage = Math.round(score * 100);
  
  let colorClass = "bg-sage/40 text-sage-ink";
  if (percentage < 40) {
    colorClass = "bg-coral-bg text-coral";
  } else if (percentage < 70) {
    colorClass = "bg-yellow/50 text-yellow-ink";
  }

  return (
    <div className={`inline-flex items-center px-4 py-1.5 rounded-full font-mono-readout text-sm font-semibold ${colorClass}`}>
      {percentage}% confidence
    </div>
  );
};

export default ConfidenceBadge;
