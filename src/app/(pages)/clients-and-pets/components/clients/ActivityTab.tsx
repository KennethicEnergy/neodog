import React from 'react';
import styles from './ClientDetailView.module.scss';

// Mock recent activity for demo purposes
const recentActivity = [
  {
    title: 'Annual Check-up',
    description: 'For Bella',
    date: 'April 18, 2025',
    time: '11:00 AM'
  },
  {
    title: 'Vaccination Updated',
    description: 'Rabies Vaccine For Bella',
    date: 'April 18, 2025',
    time: '10:00 AM'
  },
  {
    title: 'Invoice Paid',
    description: '$120.00 For Annual Check-Up',
    date: 'April 18, 2025',
    time: '9:00 AM'
  },
  {
    title: 'New Pet Added',
    description: 'Molly Was Added To The Pet List',
    date: 'April 18, 2025',
    time: '9:00 AM'
  }
];

const ActivityTab: React.FC = () => {
  return (
    <div className={styles.activity}>
      <h4>Recent Activity</h4>
      <div>
        {recentActivity.map((activity, idx) => (
          <div key={idx} className={styles.activityRow}>
            <div className={styles.activityAvatar} />
            <div className={styles.activityInfo}>
              <div className={styles.activityTitle}>{activity.title}</div>
              <div className={styles.activityDesc}>{activity.description}</div>
            </div>
            <div className={styles.activityDate}>
              <div>{activity.date}</div>
              <div className={styles.activityTime}>{activity.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityTab;
