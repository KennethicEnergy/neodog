import apiClient from '@/lib/api/client';
import type { Client } from './client.api';

export interface Vaccination {
  id: number;
  pet_id: number;
  vaccination_type_id: number;
  vaccination_status_id: number;
  vaccination_date: string;
  next_vaccination_date?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface VaccinationResponse {
  code: number;
  title: string;
  message: string;
  result: Vaccination | Vaccination[] | null;
}

export interface PetReference {
  id: number;
  code: string;
  name: string;
  description: string;
}

export interface VaccinationTypeReference {
  id: number;
  code: string;
  name: string;
  description: string;
}

export interface VaccinationStatusReference {
  id: number;
  code: string;
  name: string;
  description: string;
}

export interface PetReferenceResponse {
  code: number;
  title: string;
  message: string;
  result: {
    pets: {
      current_page: number;
      data: { name: string; photo_path: string | null; client: Client | null }[];
      // ...other pagination fields
    };
  };
}

export interface VaccinationTypeReferenceResponse {
  code: number;
  title: string;
  message: string;
  result: VaccinationTypeReference[];
}

export interface VaccinationStatusReferenceResponse {
  code: number;
  title: string;
  message: string;
  result: VaccinationStatusReference[];
}

export const vaccinationApi = {
  getAll: async (search?: string, page = 1, paginate = 999) => {
    const params = new URLSearchParams({
      paginate: paginate.toString(),
      page: page.toString()
    });
    if (search) {
      params.append('search', search);
    }
    return apiClient.get(`/facility/vaccination-management?${params.toString()}`);
  },

  findById: async (id: number) => {
    return apiClient.get(`/facility/vaccination-management/show/${id}`);
  },

  create: async (data: Partial<Vaccination> | FormData) => {
    let headers = undefined;
    if (typeof FormData !== 'undefined' && data instanceof FormData) {
      headers = { 'Content-Type': 'multipart/form-data' };
    }
    return apiClient.post(
      '/facility/vaccination-management/create',
      data,
      headers ? { headers } : undefined
    );
  },

  update: async (id: number, data: Partial<Vaccination>) => {
    return apiClient.post(`/facility/vaccination-management/update/${id}`, data);
  },

  deleteById: async (id: number) => {
    return apiClient.delete(`/facility/vaccination-management/delete/${id}`);
  },

  // Reference APIs
  getPetReferences: async (search?: string, page = 1, paginate = 10) => {
    const params = new URLSearchParams({
      paginate: paginate.toString(),
      page: page.toString()
    });
    if (search) {
      params.append('search', search);
    }
    return apiClient.get<PetReferenceResponse>(
      `/facility/vaccination-management/get-pet-references?${params.toString()}`
    );
  },

  getVaccinationNameReferences: async () => {
    return apiClient.get<VaccinationTypeReferenceResponse>(
      '/facility/vaccination-management/get-vaccination-name-references'
    );
  },

  getVaccinationStatusReferences: async () => {
    return apiClient.get<VaccinationStatusReferenceResponse>(
      '/facility/vaccination-management/get-vaccination-status-references'
    );
  }
};
