import { Button } from '@/components/common/button';
import { DateRangePicker, type DateRange } from '@/components/common/date-range-picker';
import { useState } from 'react';
import styles from '../page.module.scss';

const AppointmentHeader = () => {
  const [dateRange, setDateRange] = useState<DateRange>({ startDate: '', endDate: '' });

  return (
    <div className={styles.appointmentHeader}>
      <div>
        <DateRangePicker
          size="md"
          value={dateRange}
          onValueChange={setDateRange}
          minDate={new Date().toISOString().split('T')[0]}
          placeholder="Select date range"
        />
      </div>
      <Button variant="dark" size="md">
        New Appointment
      </Button>
    </div>
  );
};

export default AppointmentHeader;
