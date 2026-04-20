import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);

  // Save token to localStorage to persist login
  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  // Clear token on logout
  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for easy context usage
export function useAuth() {
  return useContext(AuthContext);
}
