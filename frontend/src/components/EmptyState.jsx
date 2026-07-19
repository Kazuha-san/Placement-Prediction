import React from 'react';
import { FileQuestion } from 'lucide-react';

const EmptyState = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-color-surface-light rounded-xl border border-color-surface-light glass-panel">
      <FileQuestion className="w-12 h-12 text-color-text-muted mb-4 opacity-50" />
      <p className="text-color-text-muted text-lg">{message}</p>
    </div>
  );
};

export default EmptyState;
