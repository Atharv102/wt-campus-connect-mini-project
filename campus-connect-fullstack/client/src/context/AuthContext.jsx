import { createContext, useContext, useEffect, useState } from 'react';
import { apiFetch } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('campusConnectUser');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('campusConnectToken') || '');

  useEffect(() => {
    if (!token) return;
    apiFetch('/api/auth/me', { token })
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
          localStorage.setItem('campusConnectUser', JSON.stringify(data.user));
        }
      })
      .catch(() => {
        setUser(null);
        setToken('');
        localStorage.removeItem('campusConnectUser');
        localStorage.removeItem('campusConnectToken');
      });
  }, [token]);

  const login = async (identifier, password) => {
    const data = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: { identifier, password }
    });
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('campusConnectUser', JSON.stringify(data.user));
    localStorage.setItem('campusConnectToken', data.token);
    return data.user;
  };

  const register = async ({ name, email, username, password }) => {
    const data = await apiFetch('/api/auth/register', {
      method: 'POST',
      body: { name, email, username, password }
    });
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('campusConnectUser', JSON.stringify(data.user));
    localStorage.setItem('campusConnectToken', data.token);
    return data.user;
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('campusConnectUser');
    localStorage.removeItem('campusConnectToken');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

