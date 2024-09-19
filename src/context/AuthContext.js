import React, { createContext, useState, useContext } from 'react';

// Создаем контекст для аутентификации
const AuthContext = (userData) => createContext(userData);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Хук для использования контекста
export const useAuth = (userData) => useContext(AuthContext(userData));