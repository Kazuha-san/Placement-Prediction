import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorBanner = ({ message }) => {
  if (!message) return null;
  
  return (
    <div className="flex items-center gap-2 p-4 mb-6 bg-coral-bg border-2 border-coral-line rounded-2xl text-coral">
      <AlertCircle className="w-5 h-5 shrink-0" />
      <p>{message}</p>
    </div>
  );
};

export default ErrorBanner;
