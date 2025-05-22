import Appointment from '@/src/components/common/appointment';
import Card from '@/src/components/common/card';
import RecentActivity from '@/src/components/common/recent-activity';
import Table from '@/src/components/common/table';
import { DASHBOARD_METRIC_CARDS } from '@/src/utils/constants';
import styles from './page.module.scss';

const DashboardPage = () => {
  return (
    <>
      <div className={styles.metricCardGrid}>
        {DASHBOARD_METRIC_CARDS.map((data, index) => (
          <Card key={index} type={'metric'} data={data} />
        ))}
      </div>
      <div className={styles.appointmentGrid}>
        <Appointment
          title="Upcoming Appointments"
          icon="/images/calendar-check.svg"
          data={[]}
          controls={true}
        />
        <RecentActivity
          title="Recent Activity"
          icon="/images/history.svg"
          data={[]}
          controls={true}
        />
      </div>
      <div className={styles.gridRow}>
        <Table title="Data Table" icon="/images/vaccine.svg" data={[]} />
      </div>
    </>
  );
};

export default DashboardPage;
