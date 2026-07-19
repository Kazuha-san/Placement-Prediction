import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ConfidenceBadge from '../components/ConfidenceBadge';
import Disclaimer from '../components/Disclaimer';
import ErrorBanner from '../components/ErrorBanner';

const Result = () => {
  const { isGuest } = useAuth();
  const location = useLocation();
  const { result, error } = location.state || {};

  if (error) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4">
        <ErrorBanner message={error} />
        <Link to="/profile" className="text-color-primary hover:underline">
          &larr; Back to Profile Form
        </Link>
      </div>
    );
  }

  if (!result) {
    return <Navigate to="/profile" replace />;
  }

  const isPlaced = result.outcome;

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="glass-panel p-8 rounded-2xl text-center">
        <h2 className="text-2xl font-bold mb-8">Prediction Result</h2>
        
        <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full mb-6 ${isPlaced ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
          <span className="text-2xl font-bold">
            {isPlaced ? 'Placed' : 'Not Placed'}
          </span>
        </div>

        <div className="mb-8">
          <ConfidenceBadge score={result.confidence_score} />
        </div>

        {result.limiting_features && Object.keys(result.limiting_features).length > 0 && (
          <div className="mb-8 text-left bg-color-surface-light p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Areas for Improvement:</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm text-color-text-muted">
              {Object.entries(result.limiting_features).map(([key, value]) => (
                <li key={key}>{key}: {value}</li>
              ))}
            </ul>
          </div>
        )}

        <Disclaimer />

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/profile"
            className="px-6 py-2 bg-color-surface-light hover:bg-color-surface border border-color-surface-light rounded-lg font-medium transition-colors"
          >
            New Prediction
          </Link>
          {!isGuest && (
            <Link
              to="/history"
              className="px-6 py-2 bg-color-primary hover:bg-color-primary-hover text-white rounded-lg font-medium shadow-lg shadow-color-primary/20 transition-colors"
            >
              View History
            </Link>
          )}
        </div>

        {isGuest && (
          <div className="mt-8 pt-6 border-t border-color-surface-light">
            <p className="text-sm text-color-text-muted mb-3">
              Want to track your progress over time?
            </p>
            <Link to="/" className="text-color-primary font-medium hover:underline">
              Sign in to unlock History and Progress
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Result;
