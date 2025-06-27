'use client';

import { useMemo, useState } from 'react';
import AppointmentFilters from './components/AppointmentFilters';
import AppointmentHeader from './components/AppointmentHeader';
import AppointmentTable from './components/AppointmentTable';
import styles from './page.module.scss';

// Mock data - in a real app this would come from an API
const mockAppointments = [
  {
    client: 'Sarah Johnson',
    pets: 'Bella, Luna, Molly',
    service: 'Wellness Checkup',
    date: 'April 18, 2025 9:00 AM',
    status: 'CONFIRMED',
    actions: [
      { icon: '/images/actions/view.svg', onClick: () => {} },
      { icon: '/images/actions/edit.svg', onClick: () => {} },
      { icon: '/images/actions/trash.svg', onClick: () => {} }
    ]
  },
  {
    client: 'Emily Davis',
    pets: 'Daisy',
    service: 'Follow-up Visit',
    date: 'April 19, 2025 10:30 AM',
    status: 'CONFIRMED',
    actions: [
      { icon: '/images/actions/view.svg', onClick: () => {} },
      { icon: '/images/actions/edit.svg', onClick: () => {} },
      { icon: '/images/actions/trash.svg', onClick: () => {} }
    ]
  },
  {
    client: 'James Smith',
    pets: 'Max',
    service: 'Dental Cleaning',
    date: 'April 19, 2025 1:00 PM',
    status: 'CONFIRMED',
    actions: [
      { icon: '/images/actions/view.svg', onClick: () => {} },
      { icon: '/images/actions/edit.svg', onClick: () => {} },
      { icon: '/images/actions/trash.svg', onClick: () => {} }
    ]
  },
  {
    client: 'Ashley Martinez',
    pets: 'Lola',
    service: 'Grooming',
    date: 'April 20, 2025 3:00 PM',
    status: 'PENDING',
    actions: [
      { icon: '/images/actions/view.svg', onClick: () => {} },
      { icon: '/images/actions/edit.svg', onClick: () => {} },
      { icon: '/images/actions/trash.svg', onClick: () => {} }
    ]
  },
  {
    client: 'Michael Brown',
    pets: 'Rocky',
    service: 'Vaccination',
    date: 'April 21, 2025 9:00 AM',
    status: 'CANCELLED',
    actions: [
      { icon: '/images/actions/view.svg', onClick: () => {} },
      { icon: '/images/actions/edit.svg', onClick: () => {} },
      { icon: '/images/actions/trash.svg', onClick: () => {} }
    ]
  }
];

const AppointmentsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter appointments based on search query
  const filteredAppointments = useMemo(() => {
    if (!searchQuery.trim()) {
      return mockAppointments;
    }

    const query = searchQuery.toLowerCase();
    return mockAppointments.filter(
      (appointment) =>
        appointment.client.toLowerCase().includes(query) ||
        appointment.pets.toLowerCase().includes(query) ||
        appointment.service.toLowerCase().includes(query) ||
        appointment.date.toLowerCase().includes(query) ||
        appointment.status.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className={styles.appointments}>
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>Appointments</h2>
      </div>
      <AppointmentHeader />
      <AppointmentFilters onSearch={handleSearch} />
      <div className={styles.tableWrapper}>
        <AppointmentTable appointments={filteredAppointments} />
      </div>
    </div>
  );
};

export default AppointmentsPage;
