import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(() => {
    const savedData = localStorage.getItem('userData');
    return savedData ? JSON.parse(savedData) : {};
  });

  const login = (data) => {
    setUserData(data);
    localStorage.setItem('userData', JSON.stringify(data));
  };

  const logout = () => {
    setUserData({});
    localStorage.removeItem('userData');
  };

  return (
    <AuthContext.Provider value={{ userData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

