import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { AuthContext } from './useAuth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(() => localStorage.getItem('takechap_role') || null);
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem('takechap_token')));

  const logoutLocal = useCallback(() => {
    localStorage.removeItem('takechap_token');
    localStorage.removeItem('takechap_role');
    setUser(null);
    setRole(null);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('takechap_token');
    if (!token) return;

    api.get('/me')
      .then((res) => {
        setUser(res.data.user);
        setRole(res.data.role);
        localStorage.setItem('takechap_role', res.data.role);
      })
      .catch(() => {
        logoutLocal();
      })
      .finally(() => {
        setLoading(false);
      });
  }, [logoutLocal]);

  const login = async (email, mot_de_passe, selectedRole = null) => {
    const payload = { email, mot_de_passe };
    if (selectedRole) payload.role = selectedRole;

    const res = await api.post('/login', payload);
    localStorage.setItem('takechap_token', res.data.token);
    localStorage.setItem('takechap_role', res.data.role);
    setUser(res.data.user);
    setRole(res.data.role);
    return res.data;
  };

  const registerClient = async (formData) => {
    const res = await api.post('/register', formData);
    localStorage.setItem('takechap_token', res.data.token);
    localStorage.setItem('takechap_role', 'client');
    setUser(res.data.user);
    setRole('client');
    return res.data;
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } finally {
      logoutLocal();
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, login, registerClient, logout }}>
      {children}
    </AuthContext.Provider>
  );
}