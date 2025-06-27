export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  facility_name: string;
  facility_address: string;
  operating_hours_from: string;
  operating_hours_to: string;
  operating_days: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  mobile_number: string;
  address: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface User {
  id: number;
  account_type_id: number;
  facility_id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  mobile_number: string;
  address: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  code: number;
  title: string;
  message: string;
  result: {
    user: User;
    token: string;
  };
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
