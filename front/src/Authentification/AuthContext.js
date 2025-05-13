import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData) => {
    // Normaliser les rôles pour toujours avoir "ROLE_"
    const fixedRoles = userData.roles.map(role =>
      role.startsWith("ROLE_") ? role : `ROLE_${role}`
    );

    const fixedUserData = {
      ...userData,
      roles: fixedRoles
    };

    setUser(fixedUserData);
    localStorage.setItem('user', JSON.stringify(fixedUserData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
