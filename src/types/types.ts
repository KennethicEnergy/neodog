export type TTableData = {
  title?: string;
  icon?: string;
  data: object[];
};

export type TAppointmentData = {
  client: string;
  pet: string;
  task: string;
  date: string;
  assignedTo: string;
  status: string;
};

export type TActivityData = {
  client: string;
  pet: string;
  task: string;
  time: string;
  assignedTo: string;
  status: string;
};

export type TAppointmentDetails = {
  title?: string;
  icon?: string;
  controls?: boolean;
  isPage?: boolean;
  data: TAppointmentData[];
};

export type TActivityDetails = {
  title?: string;
  icon?: string;
  controls?: boolean;
  isPage?: boolean;
  data: TActivityData[];
};

export type TServices = {
  name: string;
  icon: string;
};
