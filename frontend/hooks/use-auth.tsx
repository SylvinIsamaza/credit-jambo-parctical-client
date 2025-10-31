'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService, AuthResponse } from '@/services/auth.service';
import { profileService, UserProfile } from '@/services/profile.service';
import { setCookie, deleteCookie } from '@/lib/cookies';
import { toast } from 'sonner';
import { routerServerGlobal } from 'next/dist/server/lib/router-utils/router-server-context';
import { useRouter } from 'next/navigation';

type User = UserProfile;

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, deviceId?: string, loginOtp?: string) => Promise<AuthResponse | { role?: string } | void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router=useRouter()
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [showInactivityModal, setShowInactivityModal] = useState(false);

  // Session timeout (10 minutes)
  const SESSION_TIMEOUT = 1 * 60 * 1000;

  useEffect(() => {
    // Try to get user profile on mount
    const initAuth = async () => {
      try {
        const profile = await profileService.getProfile();
        setUser(profile);
      } catch (error) {
        // User not authenticated
      } finally {
        setIsLoading(false);
      }
    };
    
    initAuth();
  }, []);

  // Activity tracking
  useEffect(() => {
    const updateActivity = () => setLastActivity(Date.now());
    
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true);
      });
    };
  }, []);

  // Inactivity checker
  useEffect(() => {
    if (!user) return;

    const checkInactivity = () => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivity;

      if (timeSinceLastActivity >= SESSION_TIMEOUT) {
        setShowInactivityModal(true);
      }
    };

    const interval = setInterval(checkInactivity, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [user, lastActivity]);

  const login = async (email: string, password: string, deviceId?: string, loginOtp?: string) => {
    try {
      const response = await authService.login({ email, password, deviceId, loginOtp });
      
      // If OTP is required, return the response without setting tokens
      if (response.requiresOtp) {
        toast.success('Verification code sent to your email');
        return response;
      }
      
      // Store tokens in cookies
      setCookie('accessToken', response.accessToken, 0.01); // 15 minutes
      setCookie('refreshToken', response.refreshToken, 7); // 7 days
      
      // Get user profile after login
      const profile = await profileService.getProfile();
      setUser(profile);
      setLastActivity(Date.now());
      toast.success('Login successful');
      
      return { role: profile.role };
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  const register = async (data: any) => {
    try {
      const response = await authService.register(data);
      
      
      toast.success('Registration successful');
      router.push('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      // Continue with logout even if API call fails
    } finally {
      // Clear cookies
      deleteCookie('accessToken');
      deleteCookie('refreshToken');
      
      setUser(null);
      setShowInactivityModal(false);
      toast.success('Logged out successfully');
    }
  };

  const handleInactivityConfirm = () => {
    setLastActivity(Date.now());
    setShowInactivityModal(false);
  };

  const handleInactivityLogout = () => {
    logout();
  };

  const refreshUser = async () => {
    try {
      const profile = await profileService.getProfile();
      setUser(profile);
    } catch (error) {
      // If profile fetch fails, user might be logged out
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
      
      {/* Inactivity Modal */}
      {showInactivityModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Are you still there?</h3>
            <p className="text-gray-600 mb-6">
              You've been inactive for a while. Do you want to continue your session?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleInactivityLogout}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Logout
              </button>
              <button
                onClick={handleInactivityConfirm}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Continue Session
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}