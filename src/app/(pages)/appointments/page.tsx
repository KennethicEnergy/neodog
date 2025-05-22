import Appointment from '@/src/components/common/appointment';

const AppointmentsPage = () => {
  return (
    <Appointment
      title="Upcoming Appointments"
      icon="/images/calendar-check.svg"
      data={[]}
      isPage={true}
      controls={true}
    />
  );
};

export default AppointmentsPage;
