import React from 'react';
import { FileQuestion } from 'lucide-react';

const EmptyState = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-panel rounded-3xl border-2 border-dashed border-line-strong">
      <FileQuestion className="w-12 h-12 text-blue-ink/40 mb-4" />
      <p className="text-muted text-lg">{message}</p>
    </div>
  );
};

export default EmptyState;
