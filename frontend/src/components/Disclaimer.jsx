import React from 'react';
import { Info } from 'lucide-react';

const Disclaimer = () => {
  return (
    <div className="mt-6 p-4 bg-warning-bg rounded-2xl text-sm text-muted text-left flex gap-2.5">
      <Info size={16} className="text-warning shrink-0 mt-0.5" />
      <p>
        <strong className="text-ink font-display">Estimate only.</strong> This prediction is a
        probabilistic read based on historical data, meant for self-assessment. It doesn't
        guarantee any actual placement outcome.
      </p>
    </div>
  );
};

export default Disclaimer;
