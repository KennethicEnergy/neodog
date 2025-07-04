import { useAuthStore } from '@/store/auth.store';
import type { User } from '@/types/api';

/**
 * Utility function to check if user is authenticated
 * This function checks both the store state and localStorage token
 * @returns {boolean} True if user is authenticated, false otherwise
 */
export const isAuthenticated = (): boolean => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return false;
  }

  // Get token from localStorage
  const token = localStorage.getItem('token');

  // Get persisted auth state
  const persistedAuth = localStorage.getItem('auth-storage');
  let hasPersistedUser = false;

  if (persistedAuth) {
    try {
      const parsed = JSON.parse(persistedAuth);
      hasPersistedUser = !!(parsed.user && parsed.user.id);
    } catch (error) {
      console.warn('Failed to parse persisted auth state:', error);
    }
  }

  // User is authenticated if they have both a token and persisted user data
  return !!(token && hasPersistedUser);
};

/**
 * Utility function to get current user data
 * @returns {User|null} User object if authenticated, null otherwise
 */
export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const persistedAuth = localStorage.getItem('auth-storage');

  if (persistedAuth) {
    try {
      const parsed = JSON.parse(persistedAuth);
      return parsed.user || null;
    } catch (error) {
      console.warn('Failed to parse persisted auth state:', error);
      return null;
    }
  }

  return null;
};

/**
 * Utility function to get authentication token
 * @returns {string|null} Token if available, null otherwise
 */
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  return localStorage.getItem('token');
};

/**
 * Utility function to check if user has specific role/permission
 * @param {string} role - Role to check (e.g., 'admin', 'user')
 * @returns {boolean} True if user has the specified role, false otherwise
 */
export const hasRole = (role: string): boolean => {
  const user = getCurrentUser();

  if (!user) {
    return false;
  }

  // Check account_type_id (1 = admin, others = user)
  if (role === 'admin') {
    return user.account_type_id === 1;
  }

  if (role === 'user') {
    return user.account_type_id !== 1;
  }

  return false;
};

/**
 * Utility function to check if user is admin
 * @returns {boolean} True if user is admin, false otherwise
 */
export const isAdmin = (): boolean => {
  return hasRole('admin');
};

/**
 * Utility function to check if user is regular user
 * @returns {boolean} True if user is regular user, false otherwise
 */
export const isUser = (): boolean => {
  return hasRole('user');
};

/**
 * Hook to use authentication state in React components
 * This provides reactive authentication state
 * @returns {object} Object containing authentication state and user data
 */
export const useAuth = () => {
  const { isAuthenticated: storeIsAuthenticated, user, token } = useAuthStore();

  return {
    isAuthenticated: storeIsAuthenticated,
    user,
    token,
    isAdmin: user?.account_type_id === 1,
    isUser: user?.account_type_id !== 1
  };
};

/**
 * Utility function to clear all authentication data
 * Useful for logout operations
 */
export const clearAuth = (): void => {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.removeItem('token');
  localStorage.removeItem('auth-storage');
};
