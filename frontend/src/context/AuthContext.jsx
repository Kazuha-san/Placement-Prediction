import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          setUser(data.user);
          setIsGuest(false);
        } else if (data.is_guest) {
          // If they were a guest, maybe they keep guest state? But guest is typically client-side only here.
          // The backend returns is_guest=True if there's no user.
          // Let's just reset if no user.
          setUser(null);
        }
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const loginAsGuest = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/guest`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error("Failed to login as guest on backend:", error);
    }
    setIsGuest(true);
    setUser(null);
  };

  const loginSuccess = () => {
    // Re-fetch user from backend to populate state after cookie is set
    setLoading(true);
    fetchUser();
  };

  const logout = () => {
    setUser(null);
    setIsGuest(false);
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, isGuest, loginAsGuest, loginSuccess, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
