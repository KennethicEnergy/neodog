import apiClient from '@/lib/api/client';
import type { AuthResponse, LoginCredentials, RegisterCredentials, User } from '@/types/api';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<{ data: AuthResponse; status: number }> => {
    const response = await apiClient.post<AuthResponse>('/facility/login', credentials);
    return { data: response.data, status: response.status };
  },

  register: async (
    credentials: RegisterCredentials
  ): Promise<{ data: AuthResponse; status: number }> => {
    const response = await apiClient.post<AuthResponse>('/facility/register', credentials);
    return { data: response.data, status: response.status };
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/facility/logout');
  },

  getUser: async (): Promise<User> => {
    const response = await apiClient.get<{
      code: number;
      title: string;
      message: string;
      result: User;
    }>('/facility/user');
    return response.data.result;
  }
};
