import Appointment from '@/src/components/common/appointment';
import { SAMPLE_APPOINTMENT_DATA } from '@/src/utils/constants';

const AppointmentsPage = () => {
  return (
    <Appointment
      title="Upcoming Appointments"
      icon="/images/calendar-check.svg"
      data={SAMPLE_APPOINTMENT_DATA}
      isPage={true}
      controls={true}
    />
  );
};

export default AppointmentsPage;
