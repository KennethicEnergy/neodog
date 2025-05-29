import { TClient } from './client';
import { TPet } from './pet';

export type TMetricCardData = {
  id: number;
  value?: number;
  label?: string;
  trend?: number;
  icon?: string;
  color?: string;
  metrics?:
    | TVaccinationMetrics[]
    | TRevenueMetrics[]
    | TClientMetrics[]
    | TAppointmentMetrics[]
    | null;
};

export type TVaccinationMetrics = {
  totalVaccinations: number;
  uptoDateVaccinations: number;
  expiredVaccinations: number;
  pet?: TPet[];
};

export type TRevenueMetrics = {
  totalRevenue: number;
  averageServiceFee: number;
  projectedRevenue: number;
};

export type TClientMetrics = {
  totalClients: number;
  newClients: number;
  retentionRate: number;
  client?: TClient[];
};

export type TAppointmentMetrics = {
  totalAppointments: number;
  confirmedAppointments: number;
  pendingAppointments: number;
  cancelledAppointments: number;
};
