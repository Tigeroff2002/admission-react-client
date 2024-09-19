import React, { createContext, useState, useContext } from 'react';

// Create the AuthContext
export const AuthContext = createContext(); // Make sure to export AuthContext

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);  // To store additional user information

  // Updated login function to accept user credentials or data
  const login = (user) => {
    setIsAuthenticated(true);
    setUserData(user); // Save user data on login
  };

  // Updated logout function to accept arguments
  const logout = (callback) => {
    setIsAuthenticated(false);
    setUserData(null);  // Clear user data on logout
    if (callback) {
      callback(); // Perform additional actions if needed
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);
