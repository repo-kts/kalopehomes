import { createContext } from 'react';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  role: { slug: string; name: string; permissions: string[] };
}

export interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  /** True if the user's role grants the permission (or the `*` wildcard). */
  can: (permission: string) => boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
