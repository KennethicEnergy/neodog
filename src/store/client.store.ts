import { Client, clientApi } from '@/services/client.api';
import { create } from 'zustand';

interface ClientState {
  clients: Client[];
  client: Client | null;
  isLoading: boolean;
  error: string | null;
  fetchClients: (page?: number, paginate?: number) => Promise<void>;
  createClient: (data: Partial<Client>) => Promise<{ success: boolean; message?: string }>;
  updateClient: (
    id: number,
    data: Partial<Client>
  ) => Promise<{ success: boolean; message?: string }>;
  findClient: (id: number) => Promise<void>;
  deleteClient: (id: number) => Promise<{ success: boolean; message?: string }>;
}

export const useClientStore = create<ClientState>((set, get) => ({
  clients: [],
  client: null,
  isLoading: false,
  error: null,

  fetchClients: async (page = 1, paginate = 1) => {
    set({ isLoading: true, error: null });
    try {
      const response = await clientApi.getAll(page, paginate);
      set({ clients: response?.data?.result?.clients?.data as Client[], isLoading: false });
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

  createClient: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await clientApi.create(data);
      set((state) => ({
        clients: [response.data.result as Client, ...state.clients],
        isLoading: false
      }));
      await get().fetchClients?.(1, 10);
      return { success: true };
    } catch (error: unknown) {
      let message = 'Failed to create client';
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

  updateClient: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await clientApi.update(id, data);
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
      await clientApi.deleteById(id);
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
