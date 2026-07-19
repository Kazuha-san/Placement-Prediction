import React from 'react';

const ConfidenceBadge = ({ score }) => {
  // Convert 0-1 scale to percentage if necessary, assuming score is 0-100 based on schema output
  const percentage = Math.round(score * 100);
  
  let colorClass = "bg-green-500/20 text-green-400 border-green-500/30";
  if (percentage < 40) {
    colorClass = "bg-red-500/20 text-red-400 border-red-500/30";
  } else if (percentage < 70) {
    colorClass = "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
  }

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full border text-sm font-semibold ${colorClass}`}>
      {percentage}% Confidence
    </div>
  );
};

export default ConfidenceBadge;
