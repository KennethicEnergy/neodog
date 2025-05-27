import { TAppointmentDetails } from '@/src/types/types';
import AppointmentInfo from './appointment-info';
import Appointments from './appointments';
import styles from './styles.module.scss';

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
