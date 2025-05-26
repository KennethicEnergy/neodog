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

export type TAppointmentControls = {
  title?: string;
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

export type TAppointmentDetails = {
  title?: string;
  icon?: string;
  controls?: boolean;
  isPage?: boolean;
  data: TAppointmentData[];
};

export type TAppointmentData = {
  client: string;
  pet: string;
  task: string;
  date: string;
  assignedTo: string;
  status: string;
};

export type TActivityDetails = {
  title?: string;
  icon?: string;
  controls?: boolean;
  isPage?: boolean;
  data: TActivitytData[];
};

export type TActivitytData = {
  client: string;
  pet: string;
  task: string;
  time: string;
  assignedTo: string;
  status: string;
};

export type TIcon = {
  icon?: string;
  shape?: string;
  label?: string;
  color?: string;
  height?: number;
  width?: number;
};
