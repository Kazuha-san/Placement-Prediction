import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const SignIn = () => {
  const navigate = useNavigate();
  const { user, isGuest, loginAsGuest, loginAsDevUser } = useAuth();

  useEffect(() => {
    if (user || isGuest) {
      navigate('/profile', { replace: true });
    }
  }, [user, isGuest, navigate]);

  const handleGoogleLogin = () => {
    // Redirect to backend OAuth endpoint
    window.location.href = `${API_BASE_URL}/auth/google/login`;
  };

  const handleGuestLogin = () => {
    loginAsGuest();
    navigate('/profile');
  };

  const handleDevPreview = () => {
    loginAsDevUser();
    navigate('/history');
  };

  // Check for error in query params (e.g. user denied access)
  const urlParams = new URLSearchParams(window.location.search);
  const errorParam = urlParams.get('error');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md p-8 glass-panel">
        <h1 className="font-display text-3xl font-semibold mb-2 text-center">Placement Predictions</h1>
        <p className="text-muted text-center mb-8">
          Evaluate your academic profile and predict your placement outcome.
        </p>

        {errorParam && (
          <div className="mb-6 p-3 bg-coral-bg text-coral border border-coral-line rounded-xl text-sm text-center">
            Authentication failed. Please try again.
          </div>
        )}

        <div className="flex flex-col gap-4">
          <button
            onClick={handleGoogleLogin}
            className="w-full py-3 px-4 bg-blue text-blue-ink font-medium rounded-2xl hover:bg-blue-hover transition-colors flex items-center justify-center gap-2"
          >
            Continue with Google
          </button>
          
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-line"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted">Or</span>
            </div>
          </div>

          <button
            onClick={handleGuestLogin}
            className="w-full py-3 px-4 bg-white text-ink font-medium rounded-2xl hover:bg-panel transition-colors border-2 border-line hover:border-pink"
          >
            Continue as Guest
          </button>

          {import.meta.env.DEV && (
            <button
              onClick={handleDevPreview}
              className="w-full py-2 px-4 text-xs text-muted font-medium rounded-2xl hover:bg-panel transition-colors border border-dashed border-line-strong"
            >
              Dev: preview signed-in screens (mock data)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
