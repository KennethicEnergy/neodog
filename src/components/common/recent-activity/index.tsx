import { TActivityDetails } from '@/src/types/types';
import Icon from '../icon';
import SearchBar from '../searchbar';
import styles from './styles.module.scss';

const RecentActivity = ({ title, icon, data, controls, isPage }: TActivityDetails) => {
  return (
    <div className={`${styles.recentActivityWrapper} ${styles[isPage ? 'isPage' : '']}`}>
      <div className={styles.activityInfo}>
        <div className={styles.title}>
          {icon && <Icon src={icon} bgColor="#FF2CB2" width={14} height={14} />}
          {title && <h3>{title}</h3>}
        </div>
        {controls && <SearchBar />}
      </div>
      <div className={styles.activities}>
        {data.map((data, index) => (
          <div key={index} className={styles.activity}>
            <div className={styles.activityLeft}>
              <div className={styles.option}>
                <Icon src="/images/activity-pink-scissors.svg" bgColor="#f3f4f6" shape="circle" />
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
                <Icon src="/images/clock.svg" width={14} height={14} />
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
