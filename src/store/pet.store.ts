import { Pet, petApi, PetReference } from '@/services/pet.api';
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
  petBreedReferences: PetReference[];
  petVaccinationStatusReferences: PetReference[];
  petStatusReferences: PetReference[];
  petClassificationReferences: PetClassificationReference[];
  petSizeReferences: PetSizeReference[];
  petsTotal: number | null;
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
  petBreedReferences: [],
  petVaccinationStatusReferences: [],
  petStatusReferences: [],
  petClassificationReferences: [],
  petSizeReferences: [],
  petsTotal: null,

  fetchPets: async (page = 1, paginate = 1) => {
    set({ isLoading: true, error: null });
    try {
      const response = await petApi.getAll(page, paginate);

      // Check if the response contains an error code
      if (response.data.code && response.data.code >= 400) {
        const message = response.data.message || 'Failed to fetch pets';
        set({
          error: message,
          isLoading: false
        });
        return;
      }
      // Success case
      set({
        pets: response?.data?.result?.pets?.data as Pet[],
        petsTotal: response?.data?.result?.pets?.total,
        isLoading: false
      });
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
      const response = await petApi.createPet(data);

      // Check if the response contains an error code
      if (response.data.code && response.data.code >= 400) {
        const message = response.data.message || 'Failed to create pet';
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
      const response = await petApi.update(id, data);

      // Check if the response contains an error code
      if (response.data.code && response.data.code >= 400) {
        const message = response.data.message || 'Failed to update pet';
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

      // Check if the response contains an error code
      if (response.data.code && response.data.code >= 400) {
        const message = response.data.message || 'Failed to find pet';
        set({
          error: message,
          isLoading: false
        });
        return;
      }

      // Success case
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
      const response = await petApi.deleteById(id);

      // Check if the response contains an error code
      if (response.data.code && response.data.code >= 400) {
        const message = response.data.message || 'Failed to delete pet';
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
      // Try to get from localStorage first
      let breedReferences = null;
      let sexReferences = null;
      let vaccinationStatusReferences = null;
      let statusReferences = null;
      const breedCache = localStorage.getItem('petBreedReferences');
      const sexCache = localStorage.getItem('petSexReferences');
      const vaccinationStatusCache = localStorage.getItem('petVaccinationStatusReferences');
      const statusCache = localStorage.getItem('petStatusReferences');
      if (breedCache) {
        breedReferences = JSON.parse(breedCache);
      }
      if (sexCache) {
        sexReferences = JSON.parse(sexCache);
      }
      if (vaccinationStatusCache) {
        vaccinationStatusReferences = JSON.parse(vaccinationStatusCache);
      }
      if (statusCache) {
        statusReferences = JSON.parse(statusCache);
      }
      // If not in cache, fetch from petApi
      if (!breedReferences) {
        const breedRes = await petApi.getPetBreedReferences();
        breedReferences = breedRes.data.result;
        localStorage.setItem('petBreedReferences', JSON.stringify(breedReferences));
      }
      if (!sexReferences) {
        const sexRes = await petApi.getPetSexReferences();
        sexReferences = sexRes.data.result;
        localStorage.setItem('petSexReferences', JSON.stringify(sexReferences));
      }
      if (!vaccinationStatusReferences) {
        const vaccinationStatusRes = await petApi.getPetVaccinationStatusReferences();
        vaccinationStatusReferences = vaccinationStatusRes.data.result;
        localStorage.setItem(
          'petVaccinationStatusReferences',
          JSON.stringify(vaccinationStatusReferences)
        );
      }
      if (!statusReferences) {
        const statusRes = await petApi.getPetStatusReferences();
        statusReferences = statusRes.data.result;
        localStorage.setItem('petStatusReferences', JSON.stringify(statusReferences));
      }
      set({
        petBreedReferences: breedReferences,
        petSexReferences: sexReferences,
        petVaccinationStatusReferences: vaccinationStatusReferences,
        petStatusReferences: statusReferences,
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
