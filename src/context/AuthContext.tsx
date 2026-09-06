'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { IUser, IFarmerProfile, UserRole } from '@/types';

interface AuthContextType {
  user: IUser | null;
  farmerProfile: IFarmerProfile | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (formData: any) => Promise<{ success: boolean; error?: string }>;
  switchDemoUser: (role: 'farmer' | 'farmer_pending' | 'consumer' | 'admin') => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [farmerProfile, setFarmerProfile] = useState<IFarmerProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchMe = async (jwtToken?: string) => {
    try {
      const activeToken = jwtToken || localStorage.getItem('krishi_token');
      const headers: Record<string, string> = {};
      if (activeToken) {
        headers['Authorization'] = `Bearer ${activeToken}`;
      }

      const res = await fetch('/api/auth/me', { headers });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setFarmerProfile(data.farmerProfile || null);
        if (activeToken) setToken(activeToken);
      } else {
        setUser(null);
        setFarmerProfile(null);
        setToken(null);
        localStorage.removeItem('krishi_token');
      }
    } catch (err) {
      console.error('Failed to fetch auth state:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const login = async (email: string, password = 'password123') => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('krishi_token', data.token);
        await fetchMe(data.token);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Login failed:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setFarmerProfile(null);
      setToken(null);
      localStorage.removeItem('krishi_token');
    }
  };

  const register = async (formData: any) => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('krishi_token', data.token);
        await fetchMe(data.token);
        return { success: true };
      }
      return { success: false, error: data.error || 'Registration failed' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Registration failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const switchDemoUser = async (role: 'farmer' | 'farmer_pending' | 'consumer' | 'admin') => {
    const demoEmails = {
      farmer: 'farmer@kisankart.com', // Ramesh Patil (Verified)
      farmer_pending: 'vikram@kisankart.com', // Vikram Singh (Unverified)
      consumer: 'consumer@kisankart.com', // Ananya Sharma
      admin: 'admin@kisankart.com', // Rajesh Sharma
    };

    const targetEmail = demoEmails[role];
    await login(targetEmail, 'password123');
  };

  const refreshProfile = async () => {
    await fetchMe();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        farmerProfile,
        token,
        isLoading,
        login,
        logout,
        register,
        switchDemoUser,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
