import { Button } from '@/components/common/button';
import DateRangePicker, {
  DateRangeValue
} from '@/components/common/date-range-picker/date-range-picker';
import { useState } from 'react';
import styles from '../page.module.scss';

const AppointmentHeader = () => {
  const [dateRange, setDateRange] = useState<DateRangeValue>({ startDate: null, endDate: null });

  return (
    <div className={styles.appointmentHeader}>
      <DateRangePicker
        value={dateRange}
        onChange={setDateRange}
        minDate={new Date()}
        placeholder="Select date range"
      />
      <Button variant="dark" size="md">
        New Appointment
      </Button>
    </div>
  );
};

export default AppointmentHeader;
