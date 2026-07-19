import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import SignIn from './pages/SignIn';
import ProfileForm from './pages/ProfileForm';
import Result from './pages/Result';
import History from './pages/History';
import Progress from './pages/Progress';

const ProtectedRoute = ({ children }) => {
  const { user, isGuest } = useAuth();
  
  if (isGuest) {
    return <Navigate to="/" replace />;
  }

  // Real app would also check if !user and redirect to /, but we're keeping it simple for the auth mockup
  
  return children;
};

const AuthCallback = () => {
  const navigate = useNavigate();
  const { loginSuccess } = useAuth();

  useEffect(() => {
    // Mocking an auth callback handling
    // Real implementation: check httpOnly cookies or extract JWT from URL if that's the chosen flow
    loginSuccess({ id: 'user-1', name: 'Mock User' });
    navigate('/profile', { replace: true });
  }, [loginSuccess, navigate]);

  return <div className="min-h-screen flex items-center justify-center">Authenticating...</div>;
};

const Navigation = () => {
  const { isGuest, logout } = useAuth();
  const location = useLocation();

  if (location.pathname === '/') return null;

  return (
    <nav className="bg-color-surface-light/80 backdrop-blur-md sticky top-0 z-50 border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/profile" className="font-bold text-lg tracking-tight">Placement Predictions</Link>
        <div className="flex items-center gap-6">
          <Link to="/profile" className={`text-sm font-medium hover:text-color-primary transition-colors ${location.pathname === '/profile' ? 'text-color-primary' : 'text-color-text-muted'}`}>Profile</Link>
          {!isGuest && (
            <>
              <Link to="/history" className={`text-sm font-medium hover:text-color-primary transition-colors ${location.pathname === '/history' ? 'text-color-primary' : 'text-color-text-muted'}`}>History</Link>
              <Link to="/progress" className={`text-sm font-medium hover:text-color-primary transition-colors ${location.pathname === '/progress' ? 'text-color-primary' : 'text-color-text-muted'}`}>Progress</Link>
            </>
          )}
          <button onClick={logout} className="text-sm font-medium text-color-error hover:text-red-400 transition-colors ml-4 border border-color-error px-3 py-1 rounded">
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
};

const AppContent = () => {
  const { user, isGuest } = useAuth();

  return (
    <>
      {(user || isGuest) && <Navigation />}
      <main>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/profile" element={<ProfileForm />} />
          <Route path="/result" element={<Result />} />
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
