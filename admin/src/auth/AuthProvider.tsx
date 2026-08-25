import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';

import { apiFetch, clearToken, getToken, setToken } from '@/lib/api';
import { AuthContext, type AuthUser } from './auth-context';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session from a stored token on first load.
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    apiFetch<{ user: AuthUser }>('/auth/me')
      .then((res) => setUser(res.user))
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await apiFetch<{ token: string; user: AuthUser }>('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    setToken(res.token);
    setUser(res.user);
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  const can = useCallback(
    (permission: string) => {
      const perms = user?.role.permissions ?? [];
      return perms.includes('*') || perms.includes(permission);
    },
    [user],
  );

  const value = useMemo(
    () => ({ user, loading, login, logout, can }),
    [user, loading, login, logout, can],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
