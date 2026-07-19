import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
  const { user, isGuest } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user || isGuest) {
      navigate('/profile', { replace: true });
    }
  }, [user, isGuest, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle floating background elements via tailwind classes or inline styles */}
      <div 
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue/10 rounded-full blur-3xl"
        style={{ animation: 'float 8s ease-in-out infinite' }}
      ></div>
      <div 
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink/10 rounded-full blur-3xl"
        style={{ animation: 'float 10s ease-in-out infinite reverse' }}
      ></div>

      <div className="z-10 flex flex-col items-center text-center animate-[fadeIn_1s_ease-out]">
        <h1 className="font-display text-5xl md:text-6xl font-bold mb-6 text-ink tracking-tight">
          Placement Predictions
        </h1>
        <p className="text-lg md:text-xl text-muted mb-10 max-w-2xl">
          Get a rough estimate of your placement odds before the season starts.
        </p>
        <button
          onClick={() => navigate('/signin')}
          className="py-4 px-8 bg-blue text-blue-ink font-semibold rounded-2xl hover:bg-blue-hover transition-colors shadow-lg hover:shadow-xl text-lg flex items-center gap-2 group"
        >
          Get Started
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Landing;
