import { TAppointmentControls, TMenuItem } from '../types/common';
import {
  TAppointmentMetrics,
  TClientMetrics,
  TMetricCardData,
  TRevenueMetrics,
  TVaccinationMetrics
} from '../types/metrics';
import { TTableRow } from '../types/table';
import { TActivityData, TAppointmentData, TServices } from '../types/types';

export const SIDEBAR_MENU_ITEMS: TMenuItem[] = [
  { name: 'Dashboard', route: '/', icon: '/images/dark/dashboard.svg' },
  { name: 'Pets & Client', route: '/pets-and-client', icon: '/images/dark/pets-and-clients.svg' },
  { name: 'Appointments', route: '/appointments', icon: '/images/dark/appointment.svg' },
  // { name: 'Services', route: '/services', icon: '/images/dark/services.svg' },
  { name: 'Reports', route: '/reports', icon: '/images/dark/reports.svg' },
  { name: 'Support', route: '/support', icon: '/images/dark/support.svg' },
  { name: 'Settings', route: '/settings', icon: '/images/dark/settings.svg' }
];

export const DASHBOARD_METRIC_CARDS: TMetricCardData[] = [
  {
    id: 1,
    type: 'revenue',
    value: 92,
    label: 'Total Revenue',
    trend: 15,
    icon: '/images/dollar.svg',
    color: '#B567FF',
    metrics: {
      client: [
        {
          metricLabel: 'Total Revenue',
          metricDescription: '+15% From Last Month',
          metricValue: 92
        },
        {
          metricLabel: 'Average Service Fee',
          metricDescription: 'Per Client Service',
          metricValue: 75
        },
        {
          metricLabel: 'Projected Revenue',
          metricDescription: 'Next Month Estimate',
          metricValue: 102
        }
      ] as TRevenueMetrics[]
    }
  },
  {
    id: 2,
    type: 'clients',
    value: 124,
    label: 'Total Clients',
    trend: 12,
    icon: '/images/paw-white.svg',
    color: '#5293FF',
    metrics: {
      client: [
        {
          metricLabel: 'Total Clients',
          metricDescription: '+12% From Last Month',
          metricValue: 124
        },
        {
          metricLabel: 'New Clients',
          metricDescription: 'This Month',
          metricValue: 15
        },
        {
          metricLabel: 'Retention Rate',
          metricDescription: 'Last 6 Months',
          metricValue: 94
        }
      ] as TClientMetrics[]
    }
  },
  {
    id: 3,
    type: 'appointments',
    value: 32,
    label: 'Upcoming Appointments',
    trend: 8,
    icon: '/images/calendar-with-date.svg',
    color: '#34D870',
    metrics: {
      appointment: [
        {
          metricLabel: 'Total Appointments',
          metricDescription: 'Next 7 Days',
          metricValue: 32
        },
        {
          metricLabel: 'Confirmed',
          metricDescription: 'Ready To Go',
          metricValue: 20
        },
        {
          metricLabel: 'Pending',
          metricDescription: 'Awaiting Confirmation',
          metricValue: 8
        }
      ] as TAppointmentMetrics[]
    }
  },
  {
    id: 4,
    type: 'vaccination',
    value: 10,
    label: 'Vaccinations',
    trend: 2,
    icon: '/images/vaccine.svg',
    color: '#FF9633',
    metrics: {
      vaccination: [
        {
          metricLabel: 'Total Vaccinations',
          metricDescription: 'Due in next 30 days',
          metricValue: 0
        },
        {
          metricLabel: 'Up To Date',
          metricDescription: 'No action needed',
          metricValue: 0
        },
        {
          metricLabel: 'Expired',
          metricDescription: 'Needs immediate attention',
          metricValue: 0
        }
      ] as TVaccinationMetrics[]
    }
  }
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

export const SAMPLE_RECENT_ACTIVITY_DATA: TActivityData[] = [
  {
    client: 'Sarah Johnson',
    pet: 'Bella',
    task: 'Grooming',
    time: '10 minutes ago',
    assignedTo: 'David Miller',
    status: 'CONFIRMED'
  }
];

export const SERVICES: TServices[] = [
  { name: 'Grooming', icon: '/images/activity-pink-scissors.svg' },
  { name: 'Check-in', icon: '/images/activity-green-calendar.svg' },
  { name: 'Check-out', icon: '/images/activity-purple-two-check.svg' },
  { name: 'Dental Cleaning', icon: '/images/paw-white.svg' },
  { name: 'Wellness Checkup', icon: '/images/paw-white.svg' },
  { name: 'Follow-up Visit', icon: '/images/paw-white.svg' },
  { name: 'Behavioral Consultation', icon: '/images/paw-white.svg' },
  { name: 'Vaccination', icon: '/images/paw-white.svg' },
  { name: 'Nail Trimming', icon: '/images/paw-white.svg' }
];

export const SAMPLE_TAB_APPOINTMENT_DATA = {
  title: 'Appointments',
  filters: [
    { id: 'all', label: 'All', count: 32, active: true },
    { id: 'today', label: 'Today', count: 8, active: false },
    { id: 'tomorrow', label: 'Tomorrow', count: 12, active: false }
  ],
  appointments: [
    {
      id: 1,
      owner: 'Sarah Johnson',
      pet: 'Bella',
      appointmentType: 'Wellness Checkup',
      date: '2025-04-18',
      dateLabel: 'April 18, 2025'
    },
    {
      id: 2,
      owner: 'Emily Davis',
      pet: 'Daisy',
      appointmentType: 'Follow-up Visit',
      date: '2025-04-19',
      dateLabel: 'April 19, 2025'
    },
    {
      id: 3,
      owner: 'Sarah Johnson',
      pet: 'Bella',
      appointmentType: 'Wellness Checkup',
      date: '2025-04-18',
      dateLabel: 'April 18, 2025'
    },
    {
      id: 4,
      owner: 'Emily Davis',
      pet: 'Daisy',
      appointmentType: 'Follow-up Visit',
      date: '2025-04-19',
      dateLabel: 'April 19, 2025'
    }
  ]
};

export const SAMPLE_TAB_VACCINATION_DATA = {
  title: 'Vaccination Status',
  filters: [
    { id: 'upcoming', label: 'Upcoming', icon: '/images/gray-check', active: true },
    { id: 'expired', label: 'Expired', icon: '/images/gray-close', active: false }
  ],
  vaccinations: [
    {
      id: 1,
      owner: 'Sarah Johnson',
      pet: 'Bella',
      vaccination: '5 in 1 Vaccine',
      dueDate: '2025-04-18',
      dateLabel: 'April 18, 2025'
    },
    {
      id: 2,
      owner: 'Emily Davis',
      pet: 'Daisy',
      vaccination: 'Anti-Rabies Vaccine',
      dueDate: '2025-04-19',
      dateLabel: 'April 19, 2025'
    },
    {
      id: 3,
      owner: 'Sarah Johnson',
      pet: 'Bella',
      vaccination: '6 in 1 Vaccine',
      dueDate: '2025-04-18',
      dateLabel: 'April 18, 2025'
    },
    {
      id: 4,
      owner: 'Emily Davis',
      pet: 'Daisy',
      vaccination: 'Anti-Rabies Vaccine',
      dueDate: '2025-04-19',
      dateLabel: 'April 19, 2025'
    }
  ]
};

export const SAMPLE_TABLE_DATA: TTableRow[] = Array.from({ length: 15 }, (_, index) => ({
  date: `April ${19 + (index % 10)}, 2024`,
  client: ['Sarah Johnson', 'Mike Davis', 'Emily Chen', 'Robert Wilson', 'Lisa Anderson'][
    index % 5
  ],
  pet: ['Bella', 'Max', 'Luna', 'Charlie', 'Daisy'][index % 5],
  task: ['Medication', 'Grooming', 'Checkup', 'Vaccination', 'Training'][index % 5],
  assignedTo: ['David Miller', 'Anna Smith', 'John Doe', 'Maria Garcia', 'Tom Brown'][index % 5],
  status: ['Completed', 'Pending', 'In Progress', 'Cancelled', 'Scheduled'][index % 5]
}));