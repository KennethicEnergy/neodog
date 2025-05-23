import { TAppointmentDetails } from '@/src/types/types';
import { SAMPLE_APPOINTMENT_DATA } from '@/src/utils/constants';
import Icon from '../icon';
import SearchBar from '../searchbar';
import styles from './styles.module.scss';

const RecentActivity = ({ title, icon, data, controls, isPage }: TAppointmentDetails) => {
  return (
    <div className={`${styles.recentActivityWrapper} ${styles[isPage ? 'isPage' : '']}`}>
      <div className={styles.activityInfo}>
        <div className={styles.title}>
          {icon && <Icon icon={icon} color="#FF2CB2" width={14} height={14} />}
          {title && <h3>{title}</h3>}
        </div>
        {controls && <SearchBar />}
      </div>
      <div className={styles.activities}>
        {SAMPLE_APPOINTMENT_DATA.map((data, index) => (
          <div key={index} className={styles.activity}>
            <div className={styles.activityLeft}>
              <div className={styles.option}>
                <Icon
                  icon="/images/activity-pink-scissors.svg"
                  color="#ebebeb"
                  width={12}
                  height={12}
                  shape="circle"
                />
              </div>
              <div className={styles.info}>
                <div className={styles.dateWrapper}>
                  <Icon
                    icon="/images/calendar-appointment-date.svg"
                    color=""
                    width={14}
                    height={14}
                  />
                  <div className={styles.date}>{data?.date}</div>
                </div>
                <div className={`${styles.status} ${styles[data.status.toLowerCase()]}`}>
                  {data?.status}
                </div>
              </div>
            </div>

            <div className={styles.activityRight}>
              <div className={styles.client}>{data?.client}</div>
              <div className={styles.petTask}>
                {data?.pet} - {data?.task}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
