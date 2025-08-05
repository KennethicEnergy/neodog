import apiClient from '@/lib/api/client';

export interface Pet {
  id: number;
  client_id: string;
  name: string;
  breed: string;
  pet_sex_id: string;
  neutered: string;
  pet_classification_id: string;
  age: string;
  color: string;
  pet_size_id: string;
  microchip_number: string;
  photo?: File;
  belongings: string;
  allergies_notes: string;
  medication_notes: string;
  diet_notes: string;
  notes: string;
  created_at?: string;
  updated_at?: string;
}

export interface PetResponse {
  code: number;
  title: string;
  message: string;
  result: Pet | Pet[] | null;
}

export interface PetReference {
  id: number;
  code: string;
  name: string;
  description: string;
}

export interface PetReferenceResponse {
  code: number;
  title: string;
  message: string;
  result: PetReference[];
}

export const petApi = {
  createPet: async (data: Partial<Pet> | FormData) => {
    let config = undefined;
    if (typeof FormData !== 'undefined' && data instanceof FormData) {
      config = {
        headers: {
          'Content-Type': undefined
        }
      };
    }
    return apiClient.post('/facility/pet-management/create', data, config);
  },

  getAll: async (page = 1, paginate = 1) => {
    return apiClient.get(`/facility/pet-management?paginate=${paginate}&page=${page}`);
  },

  update: async (id: number, data: Partial<Pet> | FormData) => {
    let config = undefined;
    if (typeof FormData !== 'undefined' && data instanceof FormData) {
      config = {
        headers: {
          'Content-Type': undefined
        }
      };
    }
    return apiClient.put(`/facility/pet-management/update/${id}`, data, config);
  },

  findById: async (id: number) => {
    return apiClient.get(`/facility/pet-management/show/${id}`);
  },

  deleteById: async (id: number) => {
    return apiClient.delete(`/facility/pet-management/delete/${id}`);
  },

  // Reference APIs
  getPetSexReferences: async () => {
    return apiClient.get<PetReferenceResponse>('/facility/pet-management/get-pet-sex-references');
  },

  getPetVaccinationStatusReferences: async () => {
    return apiClient.get<PetReferenceResponse>(
      '/facility/pet-management/get-pet-vaccination-status-references'
    );
  },

  getPetStatusReferences: async () => {
    return apiClient.get<PetReferenceResponse>(
      '/facility/pet-management/get-pet-status-references'
    );
  },

  getPetBreedReferences: async () => {
    return apiClient.get<PetReferenceResponse>('/facility/pet-management/get-pet-breed-references');
  }
};
