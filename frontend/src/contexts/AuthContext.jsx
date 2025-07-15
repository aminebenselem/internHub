import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  // Load from storage
  useEffect(() => {
    const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
    const storedRole = localStorage.getItem('role') || sessionStorage.getItem('role');
    const storedUsername = localStorage.getItem('username') || sessionStorage.getItem('username');

    setToken(storedToken);
    setRole(storedRole);
    setUser(storedUsername);
  }, []);

  const login = ({ token, role, username, remember }) => {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem('token', token);
    storage.setItem('role', role);
    storage.setItem('username', username);

    setToken(token);
    setRole(role);
    setUser(username);
  };

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setToken(null);
    setRole(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
