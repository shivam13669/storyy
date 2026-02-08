import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as apiLogin, getUser } from '@/lib/api';

export interface AuthUser {
  id: number;
  fullName: string;
  email: string;
  role: 'user' | 'admin';
  testimonialAllowed: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'sb_auth_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    async function initialize() {
      try {
        // Restore session from localStorage
        const savedUser = localStorage.getItem(STORAGE_KEY);
        if (savedUser) {
          try {
            const parsed = JSON.parse(savedUser);
            // Verify user still exists in database
            const { user: dbUser } = await getUser(parsed.id);
            if (dbUser) {
              setUser({
                id: dbUser.id,
                fullName: dbUser.fullName,
                email: dbUser.email,
                role: dbUser.role,
                testimonialAllowed: dbUser.testimonialAllowed,
              });
            } else {
              // User deleted from DB, clear session
              localStorage.removeItem(STORAGE_KEY);
            }
          } catch (e) {
            localStorage.removeItem(STORAGE_KEY);
          }
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
      } finally {
        setIsLoading(false);
      }
    }
    initialize();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const { user: apiUser } = await apiLogin({ email: email.toLowerCase(), password });

      const authUser: AuthUser = {
        id: apiUser.id,
        fullName: apiUser.fullName,
        email: apiUser.email,
        role: apiUser.role,
        testimonialAllowed: apiUser.testimonialAllowed,
      };

      setUser(authUser);
      // Persist session in localStorage (no expiration for persistent sessions)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));

      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, message: error.message || 'An error occurred during login' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Update user data when it changes (e.g., testimonial permission)
  const updateUserData = async () => {
    if (user) {
      try {
        const { user: dbUser } = await getUser(user.id);
        if (dbUser) {
          const updatedUser: AuthUser = {
            id: dbUser.id,
            fullName: dbUser.fullName,
            email: dbUser.email,
            role: dbUser.role,
            testimonialAllowed: dbUser.testimonialAllowed,
          };
          setUser(updatedUser);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
        }
      } catch (error) {
        console.error('Failed to refresh user data:', error);
      }
    }
  };

  // Expose update function via context (for refreshing user data)
  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    refreshUser: updateUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Helper function to get first name from full name
export function getFirstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] || fullName;
}
