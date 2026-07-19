import React from 'react';

const Disclaimer = () => {
  return (
    <div className="mt-6 p-4 bg-color-surface-light rounded-lg border border-yellow-500/30 text-sm text-color-text-muted">
      <p>
        <strong className="text-yellow-500">Disclaimer:</strong> This prediction is a probabilistic estimate based on historical data and is intended for self-assessment only. It does not guarantee any actual placement outcome.
      </p>
    </div>
  );
};

export default Disclaimer;
