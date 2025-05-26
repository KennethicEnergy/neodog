import { TActivityDetails } from '@/src/types/types';
import Icon from '../icon';
import SearchBar from '../searchbar';
import styles from './styles.module.scss';

const RecentActivity = ({ title, icon, data, controls, isPage }: TActivityDetails) => {
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
        {data.map((data, index) => (
          <div key={index} className={styles.activity}>
            <div className={styles.activityLeft}>
              <div className={styles.option}>
                <Icon
                  icon="/images/activity-pink-scissors.svg"
                  color="#f3f4f6"
                  width={12}
                  height={12}
                  shape="circle"
                />
              </div>
              <div className={styles.info}>
                <div className={styles.dateWrapper}>
                  <div className={styles.date}>{data?.task}</div>
                </div>
                <div>{data?.pet}</div>
              </div>
            </div>

            <div className={styles.activityRight}>
              <div className={styles.time}>
                <Icon icon="/images/clock.svg" width={14} height={14} color="" />
                {data?.time}
              </div>
              <div className={styles.petTask}>{data?.assignedTo}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
