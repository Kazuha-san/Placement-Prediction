import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import SignIn from './pages/SignIn';
import ProfileForm from './pages/ProfileForm';
import Result from './pages/Result';
import History from './pages/History';
import Progress from './pages/Progress';

const ProtectedRoute = ({ children }) => {
  const { user, isGuest } = useAuth();
  
  if (isGuest || !user) {
    return <Navigate to="/signin" replace />;
  }
  
  return children;
};

const RequireSessionRoute = ({ children }) => {
  const { user, isGuest } = useAuth();
  if (!user && !isGuest) {
    return <Navigate to="/signin" replace />;
  }
  return children;
};

const AuthCallback = () => {
  const navigate = useNavigate();
  const { loginSuccess } = useAuth();

  useEffect(() => {
    loginSuccess();
    navigate('/profile', { replace: true });
  }, [loginSuccess, navigate]);

  return <div className="min-h-screen flex items-center justify-center">Authenticating...</div>;
};

const Navigation = () => {
  const { user, isGuest, logout } = useAuth();
  const location = useLocation();

  if (location.pathname === '/') return null;

  return (
    <nav className="bg-cream/95 backdrop-blur-sm sticky top-0 z-50 border-b-2 border-line">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/profile" className="font-display font-semibold text-lg tracking-tight">Placement Predictions</Link>
        <div className="flex items-center gap-6">
          <Link to="/profile" className={`text-sm font-medium hover:text-blue-ink transition-colors ${location.pathname === '/profile' ? 'text-blue-ink' : 'text-muted'}`}>Profile</Link>
          {!isGuest && (
            <>
              <Link to="/history" className={`text-sm font-medium hover:text-blue-ink transition-colors ${location.pathname === '/history' ? 'text-blue-ink' : 'text-muted'}`}>History</Link>
              <Link to="/progress" className={`text-sm font-medium hover:text-blue-ink transition-colors ${location.pathname === '/progress' ? 'text-blue-ink' : 'text-muted'}`}>Progress</Link>
            </>
          )}
          {!isGuest && user && (
            <span className="text-sm text-muted mr-2">{user.name || user.email}</span>
          )}
          {isGuest && (
            <span className="text-sm text-muted mr-2 italic">Guest session</span>
          )}
          <button onClick={logout} className="text-sm font-medium text-coral hover:bg-coral-bg transition-colors ml-4 border-2 border-coral-line px-3 py-1 rounded-xl">
            Sign out
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
          <Route path="/" element={<Landing />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/profile" element={<RequireSessionRoute><ProfileForm /></RequireSessionRoute>} />
          <Route path="/result" element={<RequireSessionRoute><Result /></RequireSessionRoute>} />
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
