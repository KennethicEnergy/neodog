'use client';

import AppointmentFilters from './components/AppointmentFilters';
import AppointmentHeader from './components/AppointmentHeader';
import AppointmentTable from './components/AppointmentTable';
import styles from './page.module.scss';

const AppointmentsPage = () => {
  return (
    <div className={styles.appointments}>
      <AppointmentHeader />
      <AppointmentFilters />
      <AppointmentTable />
    </div>
  );
};

export default AppointmentsPage;
