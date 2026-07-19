import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, we might verify a backend httpOnly cookie session here
    // For now, we'll just set loading to false
    setLoading(false);
  }, []);

  const loginAsGuest = () => {
    setIsGuest(true);
    setUser(null);
  };

  const loginSuccess = (userData) => {
    setUser(userData);
    setIsGuest(false);
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
