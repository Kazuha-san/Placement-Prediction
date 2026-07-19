import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorBanner = ({ message }) => {
  if (!message) return null;
  
  return (
    <div className="flex items-center gap-2 p-4 mb-6 bg-red-500/10 border border-color-error rounded-lg text-color-error">
      <AlertCircle className="w-5 h-5 shrink-0" />
      <p>{message}</p>
    </div>
  );
};

export default ErrorBanner;
