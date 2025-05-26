import { APPOINTMENT_FILTERS } from "@/src/utils/constants";
import Icon from "../icon";
import styles from "./styles.module.scss";

const AppointmentInfo = ({ title, icon, controls }: { title?: string, icon?: string, controls?: boolean }) => {
  return (
    <div className={styles.appointmentInfo}>
      <div className={styles.title}>
        {icon && <Icon icon={icon} color="#22C55E" width={12} height={12} />}
        {title && <h3>{title}</h3>}
      </div>
      {controls && (
        <div className={styles.controls}>
          {APPOINTMENT_FILTERS.map((filter, index) => (
            <div key={index} className={`${styles.filter} ${index === 0 && styles.active}`}>
              {icon && filter.icon != '' && (
                <Icon icon={filter.icon} color={filter.color} width={12} height={12} />
              )}
              <p>{filter.title}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AppointmentInfo;