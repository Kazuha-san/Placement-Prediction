import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorBanner = ({ message }) => {
  if (!message) return null;

  return (
    <div className="flex items-center gap-2 p-4 mb-6 bg-danger-bg border border-danger-line rounded-2xl text-danger">
      <AlertCircle className="w-5 h-5 shrink-0" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
};

export default ErrorBanner;
