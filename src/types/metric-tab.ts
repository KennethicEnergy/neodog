// Base filter type
export type TBaseFilter = {
  id: string;
  label: string;
  active: boolean;
};

// Filter with count (for appointments)
export type TFilterWithCount = TBaseFilter & {
  count: number;
};

// Filter with icon (for vaccinations)
export type TFilterWithIcon = TBaseFilter & {
  icon: string;
};

// Base item type with common properties
export type TBaseItem = {
  id: number;
  owner: string;
  pet: string;
  dateLabel: string;
};

// Appointment item
export type TAppointmentItem = TBaseItem & {
  appointmentType: string;
  date: string;
};

// Vaccination item
export type TVaccinationItem = TBaseItem & {
  vaccination: string;
  dueDate: string;
};

// Appointment tab data
export type TAppointmentTabData = {
  title: string;
  filters: TFilterWithCount[];
  appointments: TAppointmentItem[];
};

// Vaccination tab data
export type TVaccinationTabData = {
  title: string;
  filters: TFilterWithIcon[];
  vaccinations: TVaccinationItem[];
};

// Union type for both tab data types
export type TTabData = TAppointmentTabData | TVaccinationTabData;
