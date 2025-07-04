import { authApi } from '@/services/auth.api';
import type { LoginCredentials, RegisterCredentials, User } from '@/types/api';
import { clearAuth } from '@/utils/auth';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  success: string | null;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; message?: string }>;
  register: (
    credentials: RegisterCredentials
  ) => Promise<{ success: boolean; fieldErrors?: Record<string, string[]>; message?: string }>;
  logout: () => Promise<void>;
  getUser: () => Promise<User | null>;
  clearError: () => void;
  clearSuccess: () => void;
}

type ErrorWithResponse = { response: { data?: { message?: string } } };

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      success: null,

      login: async (credentials: LoginCredentials) => {
        try {
          set({ isLoading: true, error: null, success: null });
          const response = await authApi.login(credentials);
          if (
            response.data.code === 200 &&
            response.data.result.token &&
            response.data.result.user
          ) {
            const { token, user } = response.data.result;
            localStorage.setItem('token', token);
            set({
              token,
              user,
              isAuthenticated: true,
              isLoading: false,
              success: response.data.message || 'Login successful!'
            });
            return { success: true };
          } else {
            set({
              token: null,
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: response.data.message,
              success: null
            });
            return { success: false, message: response.data.message };
          }
        } catch (error) {
          set({
            token: null,
            user: null,
            isAuthenticated: false,
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false,
            success: null
          });
          return { success: false, message: 'An error occurred' };
        }
      },

      register: async (credentials: RegisterCredentials) => {
        try {
          set({ isLoading: true, error: null });
          const response = await authApi.register(credentials);
          if (
            response.data.code === 200 &&
            response.data.result.token &&
            response.data.result.user
          ) {
            const { token, user } = response.data.result;
            localStorage.setItem('token', token);
            set({
              token,
              user,
              isAuthenticated: true,
              isLoading: false
            });
            return { success: true };
          } else {
            const rawFieldErrors = response.data.result;
            const fieldErrors: Record<string, string[]> = {};
            if (rawFieldErrors && typeof rawFieldErrors === 'object') {
              Object.entries(rawFieldErrors).forEach(([key, value]) => {
                if (Array.isArray(value) && value.every((v) => typeof v === 'string')) {
                  fieldErrors[key] = value;
                }
              });
            }
            set({
              token: null,
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: response.data.message
            });
            return { success: false, fieldErrors, message: response.data.message };
          }
        } catch (error) {
          const apiError =
            error && typeof error === 'object' && 'response' in error
              ? (error as ErrorWithResponse).response.data
              : undefined;
          set({
            token: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: apiError?.message || 'An error occurred'
          });
          return { success: false, fieldErrors: undefined, message: 'An error occurred' };
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true, error: null });
          await authApi.logout();
          clearAuth();
          set({
            token: null,
            user: null,
            isAuthenticated: false,
            isLoading: false
          });
        } catch (error) {
          set({
            token: null,
            user: null,
            isAuthenticated: false,
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false
          });
        }
      },

      getUser: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await authApi.getUser();
          const token = localStorage.getItem('token');

          if (response && response.id) {
            set({
              token,
              user: response,
              isAuthenticated: true,
              isLoading: false
            });
            return response;
          } else {
            set({
              token: null,
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: 'Invalid user data'
            });
            clearAuth();
            return null;
          }
        } catch (error) {
          set({
            token: null,
            user: null,
            isAuthenticated: false,
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false
          });
          clearAuth();
          return null;
        }
      },

      clearError: () => set({ error: null }),
      clearSuccess: () => set({ success: null })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
