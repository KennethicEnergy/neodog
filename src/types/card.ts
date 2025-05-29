import {
  TAppointmentMetrics,
  TClientMetrics,
  TRevenueMetrics,
  TVaccinationMetrics
} from './metrics';

export type TCard = {
  data: TCardData | TMetricCardData;
  type?: string;
  onClick?: () => void;
};

export type TCardData = {
  title?: string;
  description?: string;
  cardStyles?: React.CSSProperties;
  icon?: string;
};

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
