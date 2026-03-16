'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { login as apiLogin, signup as apiSignup, getMe, UserType as APIUserType } from '../api';

type UserType = APIUserType | null;

type AuthContextType = {
  token: string | null;
  user: UserType;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  loading: false,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(
    typeof window !== 'undefined' ? localStorage.getItem('token') : null
  );
  const [user, setUser] = useState<UserType>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      setLoading(true);
      getMe(token)
        .then((u) => setUser(u.user ? u.user : null))
        .catch(() => {
          setUser(null);
          setToken(null);
          localStorage.removeItem('token');
        })
        .finally(() => setLoading(false));
    }
  }, [token]);

  const doLogin = async (email: string, password: string) => {
    setLoading(true);
    const resp = await apiLogin(email, password);
    setToken(resp.access_token);
    localStorage.setItem('token', resp.access_token);
    setUser(resp.user ? resp.user : null);
    setLoading(false);
  };

  const doSignup = async (email: string, password: string) => {
    setLoading(true);
    const resp = await apiSignup(email, password);
    setToken(resp.access_token);
    localStorage.setItem('token', resp.access_token);
    setUser(resp.user ? resp.user : null);
    setLoading(false);
  };

  const doLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider
      value={{ token, user, loading, login: doLogin, signup: doSignup, logout: doLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useAuth(): AuthContextType {
  return useContext(AuthContext);
}
