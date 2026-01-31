import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, RegisterData, AuthContextType } from '../types/index';
import apiService from '../lib/api';
import { sanitizeObject, validateAndSanitizeEmail } from '../utils/sanitization';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [organizationName, setOrganizationName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth from stored data
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedOrgName = localStorage.getItem('organizationName');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Sanitize user data before setting
        const sanitizedUser = sanitizeObject(parsedUser);
        setUser(sanitizedUser);
        setOrganizationName(storedOrgName ? sanitizeObject(storedOrgName) : null);
      } catch {
        localStorage.removeItem('user');
        localStorage.removeItem('organizationName');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      
      // Validate email
      const sanitizedEmail = validateAndSanitizeEmail(email);
      if (!sanitizedEmail) {
        throw new Error('Invalid email address');
      }

      const response = await apiService.login(sanitizedEmail, password);
      const { token, user: userData, organizationName: orgName } = response.data;

      // Validate token format
      if (!token || typeof token !== 'string') {
        throw new Error('Invalid authentication response');
      }

      // Sanitize user data
      const sanitizedUserData = sanitizeObject(userData);
      const sanitizedOrgName = orgName ? sanitizeObject(orgName) : '';

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(sanitizedUserData));
      localStorage.setItem('organizationName', sanitizedOrgName);
      setUser(sanitizedUserData);
      setOrganizationName(sanitizedOrgName || null);
    } catch (err: any) {
      const message = err.response?.data?.error || 'Login failed';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setError(null);
      setLoading(true);

      // Sanitize all inputs
      const sanitizedData = {
        ...data,
        email: validateAndSanitizeEmail(data.email),
        firstName: sanitizeObject(data.firstName),
        lastName: sanitizeObject(data.lastName),
      };

      if (!sanitizedData.email) {
        throw new Error('Invalid email address');
      }

      const response = await apiService.register(sanitizedData);
      const { token, user: userData, organizationName: orgName } = response.data;

      // Validate token format
      if (!token || typeof token !== 'string') {
        throw new Error('Invalid authentication response');
      }

      // Sanitize user data
      const sanitizedUserData = sanitizeObject(userData);
      const sanitizedOrgName = orgName ? sanitizeObject(orgName) : '';

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(sanitizedUserData));
      localStorage.setItem('organizationName', sanitizedOrgName);
      setUser(sanitizedUserData);
      setOrganizationName(sanitizedOrgName || null);
    } catch (err: any) {
      const message = err.response?.data?.error || 'Registration failed';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('organizationName');
    setUser(null);
    setOrganizationName(null);
  };

  return (
    <AuthContext.Provider value={{ user, organizationName, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
