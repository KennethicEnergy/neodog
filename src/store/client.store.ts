import { Client, clientApi } from '@/services/client.api';
import { create } from 'zustand';

interface ClientState {
  clients: Client[];
  client: Client | null;
  isLoading: boolean;
  error: string | null;
  fetchClients: (page?: number, paginate?: number) => Promise<void>;
  fetchAllClients: () => Promise<void>;
  allClients: Client[];
  createClient: (data: Partial<Client>) => Promise<{
    success: boolean;
    message?: string;
    fieldErrors?: Record<string, string[]>;
  }>;
  updateClient: (
    id: number,
    data: Partial<Client>
  ) => Promise<{ success: boolean; message?: string }>;
  findClient: (id: number) => Promise<void>;
  deleteClient: (id: number) => Promise<{ success: boolean; message?: string }>;
  clientsTotal?: number;
}

export const useClientStore = create<ClientState>((set, get) => ({
  clients: [],
  allClients: [],
  client: null,
  isLoading: false,
  error: null,
  clientsTotal: undefined,

  fetchClients: async (page = 1, paginate = 1) => {
    set({ isLoading: true, error: null });
    try {
      const response = await clientApi.getAll(page, paginate);

      // Check if the response contains an error code
      if (response.data.code && response.data.code >= 400) {
        const message = response.data.message || 'Failed to fetch clients';
        set({
          error: message,
          isLoading: false
        });
        return;
      }

      // Success case
      set({
        clients: response?.data?.result?.clients?.data as Client[],
        clientsTotal: response?.data?.result?.clients?.total,
        isLoading: false
      });
    } catch (error: unknown) {
      let message = 'Failed to fetch clients';
      if (
        error &&
        typeof error === 'object' &&
        'message' in error &&
        typeof (error as Error).message === 'string'
      ) {
        message = (error as Error).message;
      }
      set({ error: message, isLoading: false });
    }
  },

  fetchAllClients: async () => {
    set({ isLoading: true, error: null });
    try {
      // First, fetch the first page to get the total count
      const firstPageResponse = await clientApi.getAll(1, 1);
      const total = firstPageResponse?.data?.result?.clients?.total || 10000;
      // Now fetch all clients using the total as the paginate value
      const response = await clientApi.getAll(1, total);
      if (response.data.code && response.data.code >= 400) {
        const message = response.data.message || 'Failed to fetch all clients';
        set({ error: message, isLoading: false });
        return;
      }
      set({
        allClients: response?.data?.result?.clients?.data as Client[],
        isLoading: false
      });
    } catch (error: unknown) {
      let message = 'Failed to fetch all clients';
      if (
        error &&
        typeof error === 'object' &&
        'message' in error &&
        typeof (error as Error).message === 'string'
      ) {
        message = (error as Error).message;
      }
      set({ error: message, isLoading: false });
    }
  },

  createClient: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await clientApi.createClient(data);

      // Check if the response contains an error code
      if (response.data.code && response.data.code >= 400) {
        const message = response.data.message || 'Failed to create client';
        let fieldErrors: Record<string, string[]> | undefined;

        if (response.data.result && typeof response.data.result === 'object') {
          fieldErrors = response.data.result;
        }

        set({
          error: message,
          isLoading: false
        });
        return {
          success: false,
          message,
          fieldErrors
        };
      }

      // Success case
      set((state) => ({
        clients: [response.data.result as Client, ...state.clients],
        isLoading: false
      }));
      await get().fetchClients?.(1, 10);
      return { success: true };
    } catch (error: unknown) {
      let message = 'Failed to create client';
      let fieldErrors: Record<string, string[]> | undefined;

      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as {
          response: { data?: { message?: string; result?: Record<string, string[]> } };
        };
        if (apiError.response?.data) {
          message = apiError.response.data.message || message;
          if (apiError.response.data.result && typeof apiError.response.data.result === 'object') {
            fieldErrors = apiError.response.data.result;
          }
        }
      } else if (error instanceof Error) {
        message = error.message;
      }

      set({ error: message, isLoading: false });
      return { success: false, message, fieldErrors };
    }
  },

  updateClient: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await clientApi.update(id, data);

      // Check if the response contains an error code
      if (response.data.code && response.data.code >= 400) {
        const message = response.data.message || 'Failed to update client';
        set({
          error: message,
          isLoading: false
        });
        return {
          success: false,
          message
        };
      }

      // Success case
      set((state) => ({
        clients: state.clients.map((c) => (c.id === id ? { ...c, ...data } : c)),
        isLoading: false
      }));
      return { success: true };
    } catch (error: unknown) {
      let message = 'Failed to update client';
      if (
        error &&
        typeof error === 'object' &&
        'message' in error &&
        typeof (error as Error).message === 'string'
      ) {
        message = (error as Error).message;
      }
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  findClient: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await clientApi.findById(id);

      // Check if the response contains an error code
      if (response.data.code && response.data.code >= 400) {
        const message = response.data.message || 'Failed to find client';
        set({
          error: message,
          isLoading: false
        });
        return;
      }

      // Success case
      set({ client: response.data.result as Client, isLoading: false });
    } catch (error: unknown) {
      let message = 'Failed to find client';
      if (
        error &&
        typeof error === 'object' &&
        'message' in error &&
        typeof (error as Error).message === 'string'
      ) {
        message = (error as Error).message;
      }
      set({ error: message, isLoading: false });
    }
  },

  deleteClient: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await clientApi.deleteById(id);

      // Check if the response contains an error code
      if (response.data.code && response.data.code >= 400) {
        const message = response.data.message || 'Failed to delete client';
        set({
          error: message,
          isLoading: false
        });
        return {
          success: false,
          message
        };
      }

      // Success case
      set((state) => ({
        clients: state.clients.filter((c) => c.id !== id),
        isLoading: false
      }));
      return { success: true };
    } catch (error: unknown) {
      let message = 'Failed to delete client';
      if (
        error &&
        typeof error === 'object' &&
        'message' in error &&
        typeof (error as Error).message === 'string'
      ) {
        message = (error as Error).message;
      }
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  }
}));
