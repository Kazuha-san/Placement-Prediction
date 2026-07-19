import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const SignIn = () => {
  const navigate = useNavigate();
  const { loginAsGuest } = useAuth();

  const handleGoogleLogin = () => {
    // Redirect to backend OAuth endpoint
    window.location.href = `${API_BASE_URL}/auth/google/login`;
  };

  const handleMicrosoftLogin = () => {
    // Redirect to backend OAuth endpoint
    window.location.href = `${API_BASE_URL}/auth/microsoft/login`;
  };

  const handleGuestLogin = () => {
    loginAsGuest();
    navigate('/profile');
  };

  // Check for error in query params (e.g. user denied access)
  const urlParams = new URLSearchParams(window.location.search);
  const errorParam = urlParams.get('error');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md p-8 glass-panel rounded-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Placement Predictions</h1>
        <p className="text-color-text-muted text-center mb-8">
          Evaluate your academic profile and predict your placement outcome.
        </p>

        {errorParam && (
          <div className="mb-6 p-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded text-sm text-center">
            Authentication failed. Please try again.
          </div>
        )}

        <div className="flex flex-col gap-4">
          <button
            onClick={handleGoogleLogin}
            className="w-full py-3 px-4 bg-white text-gray-800 font-medium rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
          >
            Continue with Google
          </button>
          <button
            onClick={handleMicrosoftLogin}
            className="w-full py-3 px-4 bg-[#00a4ef] text-white font-medium rounded-lg hover:bg-[#0092d6] transition-colors flex items-center justify-center gap-2"
          >
            Continue with Microsoft
          </button>
          
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-color-surface-light"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-color-surface text-color-text-muted rounded-full">Or</span>
            </div>
          </div>

          <button
            onClick={handleGuestLogin}
            className="w-full py-3 px-4 bg-color-surface-light text-color-text-main font-medium rounded-lg hover:bg-color-surface transition-colors border border-color-surface-light hover:border-color-text-muted"
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
