import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(() => {
    // Retrieve user data from local storage or initialize with default values
    const savedData = localStorage.getItem('userData');
    return savedData ? JSON.parse(savedData) : {};
  });

  const login = (data) => {
    setUserData(data);
    // Save user data to local storage
    localStorage.setItem('userData', JSON.stringify(data));
  };

  const logout = () => {
    setUserData({});
    // Clear user data from local storage
    localStorage.removeItem('userData');
  };

  return (
    <AuthContext.Provider value={{ userData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

