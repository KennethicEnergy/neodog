import type { Appointment } from '@/types/pet-management';
import AppointmentInfo from './appointment-info';
import Appointments from './appointments';
import styles from './styles.module.scss';

type TAppointmentDetails = {
  title?: string;
  icon?: string;
  controls?: boolean;
  isPage?: boolean;
  data: Appointment[];
};

const Appointment = ({ title, icon, data, controls, isPage }: TAppointmentDetails) => {
  return (
    <div
      className={`${styles.appointmentWrapper} ${styles[isPage ? 'appointmentPageWrapper' : 'appointmentWrapper']}   ${styles[isPage ? 'isPage' : '']}`}>
      <AppointmentInfo title={title} icon={icon} controls={controls} />
      <Appointments appointments={data} />
    </div>
  );
};

export default Appointment;
