import { createContext, useContext, useMemo } from 'react';
import { useAuth as useAuthHook } from '../hooks/useAuth';
import { login as loginService, register as registerService } from '../services/authService';
import type { User } from '../types';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (nombre: string, email: string, password: string, rol: 'admin' | 'usuario') => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, token, loading, setToken, setUser } = useAuthHook();

  const login = async (email: string, password: string) => {
    const response = await loginService(email, password);
    localStorage.setItem('cba_token', response.token);
    setToken(response.token);
    setUser(response.user);
  };

  const register = async (nombre: string, email: string, password: string, rol: 'admin' | 'usuario') => {
    const response = await registerService(nombre, email, password, rol);
    localStorage.setItem('cba_token', response.token);
    setToken(response.token);
    setUser(response.user);
  };

  const logout = () => {
    localStorage.removeItem('cba_token');
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({ user, token, loading, login, register, logout }), [user, token, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
