import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    const fixedRoles = userData.roles.map(role =>
      role.startsWith("ROLE_") ? role : `ROLE_{role}`
    );
    const fixedUserData = { ...userData, roles: fixedRoles };

    setUser(fixedUserData);
    localStorage.setItem('user', JSON.stringify(fixedUserData)); // Enregistre dans localStorage
    localStorage.setItem('roles', JSON.stringify(fixedRoles));
    localStorage.setItem('token', userData.token);
    localStorage.setItem('email', userData.email);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');  
    localStorage.removeItem('token');
    localStorage.removeItem('roles');
    localStorage.removeItem('email');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
