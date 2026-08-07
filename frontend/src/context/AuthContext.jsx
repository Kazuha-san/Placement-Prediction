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
          setUser({
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            created_at: data.user.created_at,
            semester: data.user.semester,
            year: data.user.year
          });
          setIsGuest(false);
        } else if (data.is_guest) {
          setUser(null);
        }
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    setLoading(true);
    await fetchUser();
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const loginAsGuest = () => {
    setIsGuest(true);
    setUser(null);
  };

  const loginAsDevUser = () => {
    if (!import.meta.env.DEV) return;
    setUser({ id: 'dev-preview', name: 'Dev preview', email: 'dev@preview.local' });
    setIsGuest(false);
  };

  const loginSuccess = () => {
    // Re-fetch user from backend to populate state after cookie is set
    setLoading(true);
    fetchUser();
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, { method: 'POST', credentials: 'include' });
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      setUser(null);
      setIsGuest(false);
    }
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, isGuest, loginAsGuest, loginAsDevUser, loginSuccess, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
