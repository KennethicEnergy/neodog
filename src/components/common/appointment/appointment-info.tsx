import { APPOINTMENT_FILTERS } from '@/utils/constants';
import Icon from '../icon';
import styles from './styles.module.scss';

const AppointmentInfo = ({
  title,
  icon,
  controls
}: {
  title?: string;
  icon?: string;
  controls?: boolean;
}) => {
  return (
    <div className={styles.appointmentInfo}>
      <div className={styles.title}>
        {icon && <Icon src={icon} bgColor="success" />}
        {title && <h3>{title}</h3>}
      </div>
      {controls && (
        <div className={styles.controls}>
          {APPOINTMENT_FILTERS.map((filter, index) => (
            <div key={index} className={`${styles.filter} ${index === 0 && styles.active}`}>
              {icon && filter.icon != '' && <Icon src={filter.icon} bgColor={filter.color} />}
              <p>{filter.title}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentInfo;
