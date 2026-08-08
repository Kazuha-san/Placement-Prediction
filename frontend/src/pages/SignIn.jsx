import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertCircle } from 'lucide-react';
import BackButton from '../components/BackButton';
import { api } from '../services/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
// Flip VITE_ENABLE_DEMO_LOGIN=false in frontend/.env to remove the demo link entirely.
const DEMO_LOGIN_ENABLED = import.meta.env.VITE_ENABLE_DEMO_LOGIN !== 'false';

const SignIn = () => {
  const navigate = useNavigate();
  const { user, isGuest, loginAsGuest, refreshUser } = useAuth();
  const [demoError, setDemoError] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  useEffect(() => {
    if (user || isGuest) {
      navigate('/profile', { replace: true });
    }
  }, [user, isGuest, navigate]);

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/auth/google/login`;
  };

  const handleGuestLogin = () => {
    loginAsGuest();
    navigate('/profile', { replace: true });
  };

  const handleDemoLogin = async () => {
    setDemoError(false);
    setDemoLoading(true);
    try {
      await api.loginDemo();
      await refreshUser();
      navigate('/history');
    } catch (err) {
      setDemoError(true);
    } finally {
      setDemoLoading(false);
    }
  };

  const urlParams = new URLSearchParams(window.location.search);
  const errorParam = urlParams.get('error');

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden page-enter">
      <div className="hero-wash absolute inset-0" />
      <div
        className="absolute inset-0 opacity-30 mix-blend-overlay"
        style={{ background: 'radial-gradient(circle at 30% 20%, white 0%, transparent 55%)' }}
      />

      <div className="relative z-10 w-full max-w-md">
        <BackButton to="/" label="Back to home" className="text-ink/70 hover:text-ink px-1" />
        <div className="glass-card p-8 md:p-10">
        <div className="flex flex-col items-center text-center">
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-ink mb-2">
            Welcome
          </h1>
          <p className="text-muted text-sm mb-8 max-w-xs">
            Sign in to save your predictions and track your progress over time.
          </p>
        </div>

        {errorParam && (
          <div className="mb-6 p-3 bg-danger-bg text-danger border border-danger-line rounded-xl text-sm flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            Authentication failed. Please try again.
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={handleGoogleLogin}
            className="w-full py-3.5 px-4 bg-card border-2 border-line rounded-pill font-semibold text-ink
              flex items-center justify-center gap-2.5 hover:border-line-strong hover:bg-panel
              transition-colors"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <div className="relative my-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-line" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-card text-muted uppercase tracking-wide">or</span>
            </div>
          </div>

          <button
            onClick={handleGuestLogin}
            className="w-full py-3.5 px-4 rounded-pill font-medium text-muted hover:text-ink
              hover:bg-panel transition-colors"
          >
            Enter as Guest
          </button>
        </div>

        <p className="text-xs text-muted text-center mt-7">
          Guest sessions aren't saved. Sign in with Google to keep your history.
        </p>

        {DEMO_LOGIN_ENABLED && (
          <>
            <p className="text-xs text-muted text-center mt-2">
              Reviewing this project?{' '}
              <button
                onClick={handleDemoLogin}
                disabled={demoLoading}
                className="underline hover:text-ink transition-colors disabled:opacity-50"
              >
                {demoLoading ? 'Loading demo…' : 'Open the demo student account'}
              </button>{' '}
              to see it with sample history already in it.
            </p>
            {demoError && (
              <p className="text-xs text-danger text-center mt-2">
                Could not open the demo account. Please try again.
              </p>
            )}
          </>
        )}
        </div>
      </div>
    </div>
  );
};

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"/>
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6.1 29.6 4 24 4c-7.5 0-14 4.2-17.7 10.7z"/>
    <path fill="#4CAF50" d="M24 44c5.5 0 10.4-2.1 14.1-5.5l-6.5-5.5C29.6 34.6 26.9 35.6 24 35.6c-5.2 0-9.6-3.3-11.2-7.9l-6.6 5.1C9.9 39.7 16.4 44 24 44z"/>
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.5 5.5C41.5 35.9 44 30.4 44 24c0-1.3-.1-2.7-.4-3.5z"/>
  </svg>
);

export default SignIn;
