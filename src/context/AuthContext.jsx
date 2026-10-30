import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(null);
  const [loading, setLoading] = useState(true);

  // Boot: restore session from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('ccms_token');
    const savedUser  = localStorage.getItem('ccms_user');
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('ccms_token');
        localStorage.removeItem('ccms_user');
      }
    }
    setLoading(false);
  }, []);

  const saveSession = (data) => {
    localStorage.setItem('ccms_token', data.token);
    localStorage.setItem('ccms_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  };

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    saveSession(data);
    return data;
  };

  const login = async (payload) => {
    const { data } = await api.post('/auth/login', payload);
    saveSession(data);
    return data;
  };

  const logout = useCallback(() => {
    localStorage.removeItem('ccms_token');
    localStorage.removeItem('ccms_user');
    setToken(null);
    setUser(null);
  }, []);

  const isAuthenticated = !!token && !!user;
  const isAdmin   = isAuthenticated && user?.role === 'admin';
  const isStudent = isAuthenticated && user?.role === 'student';

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated, isAdmin, isStudent, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
