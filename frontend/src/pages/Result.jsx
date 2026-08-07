import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Disclaimer from '../components/Disclaimer';
import ErrorBanner from '../components/ErrorBanner';
import { CheckCircle2, XCircle, Sparkles, ArrowRight, Bell } from 'lucide-react';
import BackButton from '../components/BackButton';

const Result = () => {
  const { isGuest } = useAuth();
  const location = useLocation();
  const { result, error } = location.state || {};

  if (error) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 page-enter">
        <BackButton to="/profile" label="Back to form" />
        <ErrorBanner message={error} />
      </div>
    );
  }

  if (!result) {
    return <Navigate to="/profile" replace />;
  }

  const isPlaced = result.outcome;
  const percentage = Math.round(result.confidence_score * 100);
  const factors = result.limiting_features ? Object.entries(result.limiting_features) : [];

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 page-enter">
      <BackButton to="/profile" label="Back to form" />
      <div className="surface-card p-6 md:p-10 text-center relative overflow-hidden">
        <div
          className="absolute top-0 left-0 right-0 h-40 opacity-25 pointer-events-none"
          style={{
            background: isPlaced
              ? 'radial-gradient(ellipse at top, var(--color-success), transparent 70%)'
              : 'radial-gradient(ellipse at top, var(--color-danger), transparent 70%)',
          }}
        />

        <div className="relative">
          <p className="text-sm font-semibold uppercase tracking-wide text-muted mb-6">Your prediction</p>

          {/* Hero score */}
          <div className="flex flex-col items-center mb-3">
            <span className="font-display font-semibold leading-none text-ink" style={{ fontSize: 'clamp(3.5rem, 12vw, 5.5rem)' }}>
              {percentage}%
            </span>
            <span className="text-muted text-sm mt-1">confidence</span>
          </div>

          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-pill font-semibold mb-8"
            style={{
              backgroundColor: isPlaced ? 'var(--color-success-bg)' : 'var(--color-danger-bg)',
              color: isPlaced ? 'var(--color-success)' : 'var(--color-danger)',
              border: `1px solid ${isPlaced ? 'var(--color-success-line)' : 'var(--color-danger-line)'}`,
            }}
          >
            {isPlaced ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
            {isPlaced ? 'Likely to be placed' : 'Not likely, yet'}
          </div>

          {factors.length > 0 && (
            <div className="mb-8 text-left">
              <div className="flex items-center gap-1.5 mb-3">
                <Sparkles size={16} className="text-muted" />
                <h3 className="font-display font-semibold text-ink text-sm">What's shaping this</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {factors.map(([key, value]) => (
                  <span key={key} className="chip px-4 py-2 text-sm">
                    <span className="font-semibold capitalize">{key.replace(/_/g, ' ')}:</span> {value}
                  </span>
                ))}
              </div>
            </div>
          )}

          <Disclaimer />

          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
            <Link to="/profile" className="btn-secondary px-6 py-2.5 font-medium">
              New prediction
            </Link>
            {!isGuest && (
              <Link to="/history" className="btn-primary px-6 py-2.5 font-medium">
                View history
              </Link>
            )}
          </div>
        </div>
      </div>

      {isGuest && (
        <div className="mt-5 surface-card p-5 flex items-center gap-4">
          <div className="chip p-2.5 shrink-0"><Bell size={18} /></div>
          <p className="text-sm text-muted flex-1">
            This result won't be saved. Sign in to keep it and track your progress over time.
          </p>
          <Link to="/signin" className="text-sm font-semibold text-ink flex items-center gap-1 shrink-0 hover:underline">
            Sign in <ArrowRight size={14} />
          </Link>
        </div>
      )}
    </div>
  );
};

export default Result;
