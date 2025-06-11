// Pet Management System Data Types

import {
  AppointmentStatus,
  AppointmentType,
  ClientStatus,
  PetStatus,
  PetType
} from '@/utils/enums';

// Base Types
export type TBaseFilter = {
  id: string;
  label: string;
  active: boolean;
};

export type TBaseItem = {
  id: number;
  owner: string;
  pet: string;
  dateLabel: string;
};

// Core Types
export type Pet = {
  id: string;
  name: string;
  type: PetType;
  breed: string;
  age: string;
  weight: string;
  gender: string;
  color: string;
  chipNumber?: string;
  status: PetStatus;
  medicalHistory: MedicalRecord[];
  vaccinations: Vaccination[];
  ownerId: string;
  imageUrl?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Client = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  status: ClientStatus;
  pets: string[]; // Array of pet IDs
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Appointment = {
  id: string;
  clientId: string;
  petId: string;
  type: AppointmentType;
  status: AppointmentStatus;
  date: Date;
  startTime: string;
  endTime: string;
  assignedTo: string; // Staff member ID
  notes?: string;
  services: Service[];
  totalCost: number;
  createdAt: Date;
  updatedAt: Date;
};

// Supporting Types
export type Service = {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  category: string;
};

export type MedicalRecord = {
  id: string;
  petId: string;
  date: Date;
  diagnosis: string;
  treatment: string;
  prescribedBy: string;
  notes?: string;
  attachments?: string[]; // URLs to medical documents/images
};

export type Vaccination = {
  id: string;
  petId: string;
  name: string;
  date: Date;
  nextDueDate: Date;
  administeredBy: string;
  batchNumber?: string;
  notes?: string;
};

// UI Types
export type TFilterWithCount = TBaseFilter & {
  count: number;
};

export type TFilterWithIcon = TBaseFilter & {
  icon: string;
};

export type TAppointmentItem = TBaseItem & {
  appointmentType: string;
  date: string;
};

export type TVaccinationItem = TBaseItem & {
  vaccination: string;
  dueDate: string;
};

export type TAppointmentTabData = {
  title: string;
  filters: TFilterWithCount[];
  appointments: TAppointmentItem[];
};

export type TVaccinationTabData = {
  title: string;
  filters: TFilterWithIcon[];
  vaccinations: TVaccinationItem[];
};

export type TTabData = TAppointmentTabData | TVaccinationTabData;

// Metric Types
export type TMetricCardData = {
  id: number;
  type: string;
  value?: number;
  label?: string;
  trend?: number;
  icon?: string;
  color?: string;
  metrics?: TMetrics;
};

export type TMetrics = {
  vaccination?: TVaccinationMetrics[];
  revenue?: TRevenueMetrics[];
  client?: TClientMetrics[];
  appointment?: TAppointmentMetrics[];
};

export type TVaccinationMetrics = {
  metricLabel: string;
  metricDescription: string;
  metricValue: number;
  pet?: Pet[];
};

export type TRevenueMetrics = {
  metricLabel: string;
  metricDescription: string;
  metricValue: number;
};

export type TClientMetrics = {
  metricLabel: string;
  metricDescription: string;
  metricValue: number;
  client?: Client[];
};

export type TAppointmentMetrics = {
  metricLabel: string;
  metricDescription: string;
  metricValue: number;
  appointments: Appointment[];
};

export type TMetricData =
  | TVaccinationMetrics
  | TRevenueMetrics
  | TClientMetrics
  | TAppointmentMetrics;

// Example usage:
// const pet: Pet = {
//   id: "pet123",
//   name: "Max",
//   type: PetType.DOG,
//   breed: "Golden Retriever",
//   age: "3 years",
//   weight: "30kg",
//   gender: "Male",
//   color: "Golden",
//   status: PetStatus.HEALTHY,
//   medicalHistory: [],
//   vaccinations: [],
//   ownerId: "client456",
//   createdAt: new Date(),
//   updatedAt: new Date()
// };
