import { TMetricCardData } from './pet-management';

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
