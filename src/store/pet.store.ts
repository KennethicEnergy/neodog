import { Pet, petApi } from '@/services/pet.api';
import { create } from 'zustand';

interface PetSexReference {
  id: number;
  code: string;
  name: string;
  description: string;
  created_at: string | null;
  updated_at: string | null;
}

interface PetClassificationReference {
  id: number;
  code: string;
  name: string;
  description: string;
  created_at: string | null;
  updated_at: string | null;
}

interface PetSizeReference {
  id: number;
  code: string;
  name: string;
  description: string;
  created_at: string | null;
  updated_at: string | null;
}

interface PetState {
  pets: Pet[];
  pet: Pet | null;
  isLoading: boolean;
  error: string | null;
  petSexReferences: PetSexReference[];
  petClassificationReferences: PetClassificationReference[];
  petSizeReferences: PetSizeReference[];
  fetchPets: (page?: number, paginate?: number) => Promise<void>;
  createPet: (data: Partial<Pet> | FormData) => Promise<{
    success: boolean;
    message?: string;
    fieldErrors?: Record<string, string[]>;
  }>;
  updatePet: (id: number, data: Partial<Pet>) => Promise<{ success: boolean; message?: string }>;
  findPet: (id: number) => Promise<void>;
  deletePet: (id: number) => Promise<{ success: boolean; message?: string }>;
  fetchReferences: () => Promise<void>;
}

export const usePetStore = create<PetState>((set, get) => ({
  pets: [],
  pet: null,
  isLoading: false,
  error: null,
  petSexReferences: [],
  petClassificationReferences: [],
  petSizeReferences: [],

  fetchPets: async (page = 1, paginate = 1) => {
    set({ isLoading: true, error: null });
    try {
      const response = await petApi.getAll(page, paginate);
      set({ pets: response?.data?.result?.pets?.data as Pet[], isLoading: false });
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch pets',
        isLoading: false
      });
    }
  },

  createPet: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await petApi.create(data);
      set((state) => ({
        pets: [response.data.result as Pet, ...state.pets],
        isLoading: false
      }));
      await get().fetchPets(1, 10);
      return { success: true };
    } catch (error: unknown) {
      let message = 'Failed to create pet';
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
  },

  updatePet: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await petApi.update(id, data);
      set((state) => ({
        pets: state.pets.map((p) => (p.id === id ? { ...p, ...data } : p)),
        isLoading: false
      }));
      return { success: true };
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update pet',
        isLoading: false
      });
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update pet'
      };
    }
  },

  findPet: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await petApi.findById(id);
      set({ pet: response.data.result as Pet, isLoading: false });
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : 'Failed to find pet',
        isLoading: false
      });
    }
  },

  deletePet: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await petApi.deleteById(id);
      set((state) => ({
        pets: state.pets.filter((p) => p.id !== id),
        isLoading: false
      }));
      return { success: true };
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete pet',
        isLoading: false
      });
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete pet'
      };
    }
  },

  fetchReferences: async () => {
    set({ isLoading: true, error: null });
    try {
      const [sexRes, classificationRes, sizeRes] = await Promise.all([
        petApi.getPetSexReferences(),
        petApi.getPetClassificationReferences(),
        petApi.getPetSizeReferences()
      ]);

      set({
        petSexReferences: sexRes.data.result.map((ref) => ({
          ...ref,
          created_at: null,
          updated_at: null
        })) as PetSexReference[],
        petClassificationReferences: classificationRes.data.result.map((ref) => ({
          ...ref,
          created_at: null,
          updated_at: null
        })) as PetClassificationReference[],
        petSizeReferences: sizeRes.data.result.map((ref) => ({
          ...ref,
          created_at: null,
          updated_at: null
        })) as PetSizeReference[],
        isLoading: false
      });
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch references',
        isLoading: false
      });
    }
  }
}));
