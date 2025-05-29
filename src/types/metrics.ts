import { TClient } from './client';
import { TPet } from './pet';
import { TAppointmentData } from './types';

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

export type TMetricData =
  | TVaccinationMetrics
  | TRevenueMetrics
  | TClientMetrics
  | TAppointmentMetrics;

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
  pet?: TPet[];
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
  client?: TClient[];
};

export type TAppointmentMetrics = {
  metricLabel: string;
  metricDescription: string;
  metricValue: number;
  appointments: TAppointmentData[];
};
