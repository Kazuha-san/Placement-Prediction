import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Landing from './pages/Landing';
import SignIn from './pages/SignIn';
import ProfileForm from './pages/ProfileForm';
import Result from './pages/Result';
import History from './pages/History';
import Settings from './pages/Settings';
import Drawer from './components/Drawer';
import OnboardingModal from './components/OnboardingModal';
import { Menu } from 'lucide-react';
import { api } from './services/api';

const ProtectedRoute = ({ children }) => {
  const { user, isGuest } = useAuth();
  if (isGuest || !user) return <Navigate to="/signin" replace />;
  return children;
};

const RequireSessionRoute = ({ children }) => {
  const { user, isGuest } = useAuth();
  if (!user && !isGuest) return <Navigate to="/signin" replace />;
  return children;
};

const AuthCallback = () => {
  const navigate = useNavigate();
  const { loginSuccess } = useAuth();

  useEffect(() => {
    loginSuccess();
    navigate('/profile', { replace: true });
  }, [loginSuccess, navigate]);

  return <div className="min-h-screen flex items-center justify-center text-muted">Signing you in...</div>;
};

/**
 * Top bar. Guests (and logged-out visitors) get a minimal bar with no
 * drawer trigger at all — they only ever move through Landing → Sign in
 * → Form → Result. Authenticated users get the drawer trigger.
 */
const TopBar = () => {
  const { user, isGuest, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (location.pathname === '/') return null; // Landing has its own nav baked into the hero

  const handleLogout = async () => {
    setDrawerOpen(false);
    await logout();
    navigate('/');
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-cream/85 backdrop-blur-md border-b border-line">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to={user ? '/profile' : '/'} className="font-display font-semibold text-ink">
            Placement Predictions
          </Link>

          {user && !isGuest && (
            <button
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-panel transition-colors"
            >
              <Menu size={20} />
            </button>
          )}

          {isGuest && (
            <span className="text-sm text-muted italic">Guest session</span>
          )}
        </div>
      </header>

      {user && !isGuest && (
        <Drawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          user={user}
          onLogout={handleLogout}
        />
      )}
    </>
  );
};

const AppContent = () => {
  const { user, isGuest, refreshUser } = useAuth();
  // A brand-new authenticated user (no display name set yet) sees the
  // onboarding popup once, before anything else. Swap `needsOnboarding`
  // for your backend's real signal (see SETUP.md).
  const needsOnboarding = user && !isGuest && !user.name;
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [onboardingError, setOnboardingError] = useState(null);

  const handleOnboardingComplete = async (profile) => {
    try {
      await api.updateProfile({
        display_name: profile.displayName,
        semester: profile.semester,
        year: profile.year
      });
      await refreshUser();
      setOnboardingDone(true);
      setOnboardingError(null);
    } catch (error) {
      console.error("Failed to update profile:", error);
      setOnboardingError(error.message || 'Failed to update profile');
    }
  };

  return (
    <>
      {(user || isGuest) && <TopBar />}
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/profile" element={<RequireSessionRoute><ProfileForm /></RequireSessionRoute>} />
          <Route path="/result" element={<RequireSessionRoute><Result /></RequireSessionRoute>} />
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {needsOnboarding && !onboardingDone && (
        <OnboardingModal onComplete={handleOnboardingComplete} error={onboardingError} />
      )}
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
