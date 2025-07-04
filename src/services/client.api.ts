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
  created_at?: string;
  updated_at?: string;
}

export interface ClientResponse {
  code: number;
  title: string;
  message: string;
  result: Client | Client[] | null;
}

export const clientApi = {
  createClient: async (data: Partial<Client>) => {
    return apiClient.post('/facility/client-management/create', data);
  },
  getAll: async (page = 1, paginate = 1) => {
    return apiClient.get(`/facility/client-management?paginate=${paginate}&page=${page}`);
  },
  update: async (id: number, data: Partial<Client>) => {
    return apiClient.put(`/facility/client-management/update/${id}`, data);
  },
  findById: async (id: number) => {
    return apiClient.get(`/facility/client-management/show/${id}`);
  },
  deleteById: async (id: number) => {
    return apiClient.delete(`/facility/client-management/delete/${id}`);
  }
};
