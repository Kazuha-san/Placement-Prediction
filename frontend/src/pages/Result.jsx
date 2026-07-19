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
        <Link to="/profile" className="text-blue-ink font-medium hover:underline">
          &larr; Back to profile form
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
      <div className="glass-panel p-8 text-center">
        <h2 className="font-display text-2xl font-semibold mb-8">Prediction result</h2>
        
        <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full mb-6 border-4 ${isPlaced ? 'bg-sage/40 text-sage-ink border-sage' : 'bg-pink/30 text-pink-ink border-pink'}`}>
          <span className="font-display text-xl font-semibold">
            {isPlaced ? 'Placed' : 'Not placed'}
          </span>
        </div>

        <div className="mb-8">
          <ConfidenceBadge score={result.confidence_score} />
        </div>

        {result.limiting_features && Object.keys(result.limiting_features).length > 0 && (
          <div className="mb-8 text-left bg-panel p-5 rounded-2xl border-2 border-line">
            <h3 className="font-display font-semibold mb-2">Areas for improvement</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm text-muted">
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
            className="px-6 py-2.5 bg-white hover:bg-panel border-2 border-line rounded-2xl font-medium transition-colors"
          >
            New prediction
          </Link>
          {!isGuest && (
            <Link
              to="/history"
              className="px-6 py-2.5 bg-blue hover:bg-blue-hover text-blue-ink rounded-2xl font-medium transition-colors"
            >
              View history
            </Link>
          )}
        </div>

        {isGuest && (
          <div className="mt-8 pt-6 border-t border-line">
            <p className="text-sm text-muted mb-3">
              Want to track your progress over time?
            </p>
            <Link to="/" className="text-blue-ink font-medium hover:underline">
              Sign in to unlock History and Progress
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Result;
