import { TAppointmentControls, TAppointmentData, TMenuItem, TMetricCardData } from '../types/types';

export const SIDEBAR_MENU_ITEMS: TMenuItem[] = [
  { name: 'Dashboard', route: '/', icon: '/images/menu-dashboard.svg' },
  { name: 'Pets & Client', route: '/pets-and-client', icon: '/images/menu-pet.svg' },
  { name: 'Appointments', route: '/appointments', icon: '/images/menu-appointment.svg' },
  { name: 'Services', route: '/services', icon: '/images/menu-services.svg' },
  { name: 'Reports', route: '/reports', icon: '/images/menu-reports.svg' },
  { name: 'Support', route: '/support', icon: '/images/menu-support.svg' },
  { name: 'Settings', route: '/settings', icon: '/images/menu-settings.svg' }
];

export const DASHBOARD_METRIC_CARDS: TMetricCardData[] = [
  { value: 92, label: 'Total Revenue', trend: 15, icon: '/images/dollar.svg', color: '#B567FF' },
  {
    value: 124,
    label: 'Total Clients',
    trend: 12,
    icon: '/images/paw-white.svg',
    color: '#5293FF'
  },
  {
    value: 32,
    label: 'Upcoming Appointments',
    trend: 8,
    icon: '/images/calendar-with-date.svg',
    color: '#34D870'
  },
  { value: 10, label: 'Vaccination', trend: 2, icon: '/images/vaccine.svg', color: '#FF9633' }
];

export const APPOINTMENT_FILTERS: TAppointmentControls[] = [
  { title: 'Today', icon: '', color: '#F0F0F0' },
  { title: 'This Week', icon: '', color: '#F0F0F0' },
  { title: 'Custom', icon: '', color: '#F0F0F0' }
];

export const SAMPLE_APPOINTMENT_DATA: TAppointmentData[] = [
  {
    client: 'Sarah Johnson',
    pet: 'Bella',
    task: 'Wellness Checkup',
    date: 'April 19, 2025',
    assignedTo: 'David Miller',
    status: 'CONFIRMED'
  },
  {
    client: 'Emily Davis',
    pet: 'Daisy',
    task: 'Follow-up Visit',
    date: 'April 19, 2025',
    assignedTo: 'David Miller',
    status: 'CONFIRMED'
  },
  {
    client: 'James Smith',
    pet: 'Max',
    task: 'Dental Cleaning',
    date: 'April 18, 2025',
    assignedTo: 'David Miller',
    status: 'PENDING'
  },
  {
    client: 'Ashley Martinez',
    pet: 'Lola',
    task: 'Grooming',
    date: 'April 18, 2025',
    assignedTo: 'David Miller',
    status: 'CANCELLED'
  },
  {
    client: 'Sarah Johnson',
    pet: 'Bella',
    task: 'Wellness Checkup',
    date: 'April 19, 2025',
    assignedTo: 'David Miller',
    status: 'CONFIRMED'
  },
  {
    client: 'Emily Davis',
    pet: 'Daisy',
    task: 'Follow-up Visit',
    date: 'April 19, 2025',
    assignedTo: 'David Miller',
    status: 'CONFIRMED'
  },
  {
    client: 'James Smith',
    pet: 'Max',
    task: 'Dental Cleaning',
    date: 'April 18, 2025',
    assignedTo: 'David Miller',
    status: 'PENDING'
  },
  {
    client: 'Ashley Martinez',
    pet: 'Lola',
    task: 'Grooming',
    date: 'April 18, 2025',
    assignedTo: 'David Miller',
    status: 'CANCELLED'
  },
  {
    client: 'Sarah Johnson',
    pet: 'Bella',
    task: 'Wellness Checkup',
    date: 'April 19, 2025',
    assignedTo: 'David Miller',
    status: 'CONFIRMED'
  },
  {
    client: 'Emily Davis',
    pet: 'Daisy',
    task: 'Follow-up Visit',
    date: 'April 19, 2025',
    assignedTo: 'David Miller',
    status: 'CONFIRMED'
  },
  {
    client: 'James Smith',
    pet: 'Max',
    task: 'Dental Cleaning',
    date: 'April 18, 2025',
    assignedTo: 'David Miller',
    status: 'PENDING'
  },
  {
    client: 'Ashley Martinez',
    pet: 'Lola',
    task: 'Grooming',
    date: 'April 18, 2025',
    assignedTo: 'David Miller',
    status: 'CANCELLED'
  },
  {
    client: 'Sarah Johnson',
    pet: 'Bella',
    task: 'Wellness Checkup',
    date: 'April 19, 2025',
    assignedTo: 'David Miller',
    status: 'CONFIRMED'
  },
  {
    client: 'Emily Davis',
    pet: 'Daisy',
    task: 'Follow-up Visit',
    date: 'April 19, 2025',
    assignedTo: 'David Miller',
    status: 'CONFIRMED'
  },
  {
    client: 'James Smith',
    pet: 'Max',
    task: 'Dental Cleaning',
    date: 'April 18, 2025',
    assignedTo: 'David Miller',
    status: 'PENDING'
  },
  {
    client: 'Ashley Martinez',
    pet: 'Lola',
    task: 'Grooming',
    date: 'April 18, 2025',
    assignedTo: 'David Miller',
    status: 'CANCELLED'
  }
];

export const SAMPLE_RECENT_ACTIVITY_DATA: TAppointmentData[] = [
  {
    client: 'Sarah Johnson',
    pet: 'Bella',
    task: 'Wellness Checkup',
    date: 'April 19, 2025',
    assignedTo: 'David Miller',
    status: 'CONFIRMED'
  }
];
