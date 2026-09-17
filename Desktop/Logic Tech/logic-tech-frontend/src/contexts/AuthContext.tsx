import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { User, LoginCredentials, RegisterData, UserRole } from '../types';
import { mockUsers } from '../data/mockData';
import apiClient from '../lib/api';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<User>;
  register: (data: RegisterData) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function resolveMockUser(email: string): User {
  const lower = email.toLowerCase();
  if (lower.includes('admin')) return mockUsers.find(u => u.role === 'admin') ?? mockUsers[1];
  return mockUsers.find(u => u.role === 'client') ?? mockUsers[0];
}

function dashboardPath(role?: UserRole): string {
  if (role === 'admin') return '/admin/dashboard';
  return '/client/dashboard';
}

export { dashboardPath };

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('auth_user');
    return stored ? (JSON.parse(stored) as User) : null;
  });

  const persistUser = useCallback((next: User | null) => {
    setUser(next);
    if (next) {
      localStorage.setItem('auth_user', JSON.stringify(next));
    } else {
      localStorage.removeItem('auth_user');
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials): Promise<User> => {
    try {
      const result = await apiClient.login(credentials);
      if (result.token) apiClient.setToken(result.token);
      if (result.user) {
        persistUser(result.user);
        return result.user;
      }
    } catch (err) {
      console.error('Backend login failed:', err);
      // Fall back to mock auth when backend is unavailable
    }
    const mockUser = resolveMockUser(credentials.email);
    apiClient.setToken(`mock-token-${mockUser.id}`);
    persistUser(mockUser);
    return mockUser;
  }, [persistUser]);

  const register = useCallback(async (data: RegisterData): Promise<User> => {
    try {
      const response = await apiClient.register(data);
      // Backend returns the user object on registration
      if (response.id) {
        // Create auth token (backend would return this on login)
        apiClient.setToken(`backend-token-${response.id}`);
        const user: User = {
          id: response.id,
          name: response.name,
          email: response.email,
          role: response.role,
          avatarUrl: response.avatar_url || undefined,
          createdAt: response.created_at,
          updatedAt: response.updated_at || response.created_at,
        };
        persistUser(user);
        return user;
      }
    } catch (err) {
      console.error('Backend registration failed:', err);
      // Fall back to mock registration
    }
    const mockUser: User = {
      id: `u-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: data.role ?? 'client',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    apiClient.setToken(`mock-token-${mockUser.id}`);
    persistUser(mockUser);
    return mockUser;
  }, [persistUser]);

  const logout = useCallback(() => {
    apiClient.logout();
    persistUser(null);
  }, [persistUser]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
