import apiClient from '@/lib/api/client';

export interface Client {
  id: number;
  first_name: string;
  middle_name?: string;
  last_name: string;
  mobile_number: string;
  address: string;
  email: string;
  city?: string;
  state?: string;
  zipcode?: string;
  photo_path?: string | null;
  created_at?: string;
  updated_at?: string;
  pets?: Pet[];
  vaccinations?: unknown[];
}

export interface Pet {
  id: number;
  client_id: number;
  photo_path?: string | null;
  name: string;
  pet_breed_id: number;
  date_of_birth: string;
  age: string;
  pet_sex_id: number;
  color_or_markings: string;
  weight: string;
  height: string;
  microchip_number: string;
  enrollment_date: string;
  spayed_or_neutered: number;
  emergency_contact_name: string;
  e_c_phone_number: string;
  veterinarian_name: string;
  v_phone_number: string;
  handling_instruction: string;
  behavioral_notes: string;
  care_preferences: string;
  feeding_instructions: string;
  walking_preferences: string;
  favorite_toys: string;
  allergies: string;
  current_medications: string;
  medical_conditions: string;
  admin_and_logistics: string;
  last_visit: string;
  pet_status_id: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface ClientResponse {
  code: number;
  title: string;
  message: string;
  result: Client | Client[] | null;
}

export const clientApi = {
  createClient: async (data: Partial<Client> | FormData) => {
    let config = undefined;
    if (typeof FormData !== 'undefined' && data instanceof FormData) {
      config = {
        headers: {
          'Content-Type': undefined
        }
      };
    }
    return apiClient.post('/facility/client-management/create', data, config);
  },
  getAll: async (page = 1, paginate = 1) => {
    return apiClient.get(`/facility/client-management?paginate=${paginate}&page=${page}`);
  },
  update: async (id: number, data: Partial<Client> | FormData) => {
    let config = undefined;
    if (typeof FormData !== 'undefined' && data instanceof FormData) {
      data.append('_method', 'PUT');
      config = {
        headers: {
          'Content-Type': undefined
        }
      };
    }
    return apiClient.post(`/facility/client-management/update/${id}`, data, config);
  },
  findById: async (id: number) => {
    return apiClient.get(`/facility/client-management/show/${id}`);
  },
  deleteById: async (id: number) => {
    return apiClient.delete(`/facility/client-management/delete/${id}`);
  }
};
