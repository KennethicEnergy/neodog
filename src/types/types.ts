export type TCardData = {
  title?: string;
  description?: string;
  cardStyles?: React.CSSProperties;
  icon?: string;
};

export type TMetricCardData = {
  value?: number;
  label?: string;
  trend?: number;
  icon?: string;
  color?: string;
};

export type TCard = {
  type: string;
  data: TCardData | TMetricCardData;
};

export type TMenuItem = {
  name: string;
  route: string;
  icon: string;
};

export type TTableData = {
  title?: string;
  icon?: string;
  data: object[];
};
