import React from 'react';
import { FileQuestion } from 'lucide-react';

const EmptyState = ({ message, icon: Icon = FileQuestion }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-panel rounded-card border-2 border-dashed border-line-strong">
      <div className="chip p-4 mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <p className="text-muted text-base max-w-sm">{message}</p>
    </div>
  );
};

export default EmptyState;
