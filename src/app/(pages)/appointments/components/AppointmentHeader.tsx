import { Button } from '@/components/common/button';
import styles from '../page.module.scss';

const AppointmentHeader = () => {
  return (
    <div className={styles.header}>
      <h2 className={styles.headerTitle}>Appointments</h2>
      <div className={styles.headerRight}>
        <input type="date" className={styles.datePicker} />
        <Button variant="dark" size="lg">
          New Appointment
        </Button>
      </div>
    </div>
  );
};

export default AppointmentHeader;
