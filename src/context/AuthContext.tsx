import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as apiLogin, getUser, googleLogin as apiGoogleLogin } from '@/lib/api';

export interface AuthUser {
  id: number;
  fullName: string;
  email: string;
  countryCode: string;
  mobileNumber: string;
  signupDate: string;
  role: 'user' | 'admin';
  testimonialAllowed: boolean;
  phoneLastChangedAt?: string | null;
  gender?: string;
  dateOfBirth?: string;
  nationality?: string;
  maritalStatus?: string;
  anniversary?: string;
  state?: string;
  district?: string;
  passportNumber?: string;
  passportExpiryDate?: string;
  passportIssuingCountry?: string;
  panCardNumber?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  googleLogin: (credential: string) => Promise<{ success: boolean; message?: string }>;
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
                countryCode: dbUser.countryCode,
                mobileNumber: dbUser.mobileNumber,
                signupDate: dbUser.signupDate,
                role: dbUser.role,
                testimonialAllowed: dbUser.testimonialAllowed,
                phoneLastChangedAt: dbUser.phoneLastChangedAt,
                gender: (dbUser as any).gender,
                dateOfBirth: (dbUser as any).dateOfBirth,
                nationality: (dbUser as any).nationality,
                maritalStatus: (dbUser as any).maritalStatus,
                anniversary: (dbUser as any).anniversary,
                state: (dbUser as any).state,
                district: (dbUser as any).district,
                passportNumber: (dbUser as any).passportNumber,
                passportExpiryDate: (dbUser as any).passportExpiryDate,
                passportIssuingCountry: (dbUser as any).passportIssuingCountry,
                panCardNumber: (dbUser as any).panCardNumber,
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
        countryCode: apiUser.countryCode,
        mobileNumber: apiUser.mobileNumber,
        signupDate: apiUser.signupDate,
        role: apiUser.role,
        testimonialAllowed: apiUser.testimonialAllowed,
        phoneLastChangedAt: apiUser.phoneLastChangedAt,
        gender: (apiUser as any).gender,
        dateOfBirth: (apiUser as any).dateOfBirth,
        nationality: (apiUser as any).nationality,
        maritalStatus: (apiUser as any).maritalStatus,
        anniversary: (apiUser as any).anniversary,
        state: (apiUser as any).state,
        district: (apiUser as any).district,
        passportNumber: (apiUser as any).passportNumber,
        passportExpiryDate: (apiUser as any).passportExpiryDate,
        passportIssuingCountry: (apiUser as any).passportIssuingCountry,
        panCardNumber: (apiUser as any).panCardNumber,
      };

      setUser(authUser);
      // Persist session in localStorage (no expiration for persistent sessions)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));

      return { success: true };
    } catch (error: any) {
      return { success: false, message: error.message || 'An error occurred during login' };
    }
  };

  const googleLogin = async (credential: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const { user: apiUser } = await apiGoogleLogin(credential);

      const authUser: AuthUser = {
        id: apiUser.id,
        fullName: apiUser.fullName,
        email: apiUser.email,
        countryCode: apiUser.countryCode,
        mobileNumber: apiUser.mobileNumber,
        signupDate: apiUser.signupDate,
        role: apiUser.role,
        testimonialAllowed: apiUser.testimonialAllowed,
        phoneLastChangedAt: apiUser.phoneLastChangedAt,
        gender: (apiUser as any).gender,
        dateOfBirth: (apiUser as any).dateOfBirth,
        nationality: (apiUser as any).nationality,
        maritalStatus: (apiUser as any).maritalStatus,
        anniversary: (apiUser as any).anniversary,
        state: (apiUser as any).state,
        district: (apiUser as any).district,
        passportNumber: (apiUser as any).passportNumber,
        passportExpiryDate: (apiUser as any).passportExpiryDate,
        passportIssuingCountry: (apiUser as any).passportIssuingCountry,
        panCardNumber: (apiUser as any).panCardNumber,
      };

      setUser(authUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));

      return { success: true };
    } catch (error: any) {
      return { success: false, message: error.message || 'An error occurred during Google login' };
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
            countryCode: dbUser.countryCode,
            mobileNumber: dbUser.mobileNumber,
            signupDate: dbUser.signupDate,
            role: dbUser.role,
            testimonialAllowed: dbUser.testimonialAllowed,
            phoneLastChangedAt: dbUser.phoneLastChangedAt,
            gender: (dbUser as any).gender,
            dateOfBirth: (dbUser as any).dateOfBirth,
            nationality: (dbUser as any).nationality,
            maritalStatus: (dbUser as any).maritalStatus,
            anniversary: (dbUser as any).anniversary,
            state: (dbUser as any).state,
            district: (dbUser as any).district,
            passportNumber: (dbUser as any).passportNumber,
            passportExpiryDate: (dbUser as any).passportExpiryDate,
            passportIssuingCountry: (dbUser as any).passportIssuingCountry,
            panCardNumber: (dbUser as any).panCardNumber,
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
    googleLogin,
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
