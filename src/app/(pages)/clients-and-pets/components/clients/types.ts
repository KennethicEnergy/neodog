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
  zip?: string;
  created_at?: string;
  updated_at?: string;
  pets_count?: number;
  last_visit?: string;
  status?: string;
}

export interface Pet {
  id: number;
  name: string;
  breed: string;
  age: string;
  owner: string;
  lastVisit: string;
  status: string;
  image: string | null;
}

export interface VaccinationData {
  name: string;
  photo_path: string | null;
  client: {
    id: number;
    first_name: string;
    last_name: string;
    mobile_number: string;
    email: string;
  } | null;
  vaccination_current_count?: number;
  vaccination_due_soon_count?: number;
  vaccination_overdue_count?: number;
  vaccination_missing_count?: number;
}

export interface TransformedVaccination extends Record<string, unknown> {
  ownerAndContact: string[];
  pet: string;
  currentCount: string;
  dueSoonCount: string;
  overdueCount: string;
  missingCount: string;
  actions: object[];
}
