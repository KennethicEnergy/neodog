import { TAppointmentData } from '@/src/types/types';
import Icon from '../icon';
import styles from './styles.module.scss';

const Appointments = ({ appointments }: { appointments: TAppointmentData[] }) => {
  return (
    <div className={styles.appointments}>
      {appointments.map((data, index) => (
        <div key={index} className={styles.appointment}>
          <div className={styles.appointmentLeft}>
            <div className={styles.client}>{data?.client}</div>
            <div className={styles.petTask}>
              {data?.pet} - {data?.task}
            </div>
          </div>
          <div className={styles.appointmentRight}>
            <div className={styles.info}>
              <div className={styles.dateWrapper}>
                <Icon src="/images/calendar-appointment-date.svg" width={14} height={14} />
                <div className={styles.date}>{data?.date}</div>
              </div>
              <div className={`${styles.status} ${styles[data.status.toLowerCase()]}`}>
                {data?.status}
              </div>
            </div>
            <>
              <div className={styles.option}>
                <Icon src="/images/vertical-ellipsis.svg" />
              </div>
            </>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Appointments;
