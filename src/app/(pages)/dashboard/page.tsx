'use client';
import Appointment from '@/src/components/common/appointment';
import BaseModal from '@/src/components/common/base-modal';
import Card from '@/src/components/common/card';
import RecentActivity from '@/src/components/common/recent-activity';
import Table from '@/src/components/common/table';
import MetricModal from '@/src/components/modals/metric-modals';
import { useModalStore } from '@/src/store/modal-store';
import { TMetricCardData } from '@/src/types/metrics';
import {
  DASHBOARD_METRIC_CARDS,
  SAMPLE_APPOINTMENT_DATA,
  SAMPLE_RECENT_ACTIVITY_DATA,
  SAMPLE_TABLE_DATA
} from '@/src/utils/constants';
import styles from './page.module.scss';

const DashboardPage = () => {
  const openModal = useModalStore((state) => state.openModal);
  const closeModal = useModalStore((state) => state.closeModal);

  const handleMetricCardClick = (data: TMetricCardData) => {
    // const id = data.id;
    openModal(
      <BaseModal onClose={closeModal}>
        <MetricModal {...data} />
      </BaseModal>
    );
  };

  return (
    <>
      <div className={styles.metricCardGrid}>
        {DASHBOARD_METRIC_CARDS.map((data, index) => (
          <Card
            key={index}
            type={'metric'}
            data={data}
            onClick={() => handleMetricCardClick(data)}
          />
        ))}
      </div>

      <div className={styles.gridRow}>
        <Table
          title="Staff Task"
          icon="/images/alert.svg"
          data={SAMPLE_TABLE_DATA}
          fixedColumns={[5]}
        />
      </div>

      <div className={styles.appointmentGrid}>
        <Appointment
          title="Appointments"
          icon="/images/calendar-check.svg"
          data={SAMPLE_APPOINTMENT_DATA}
          controls={true}
        />
        <RecentActivity
          title="Recent Activity"
          icon="/images/history.svg"
          data={SAMPLE_RECENT_ACTIVITY_DATA}
          controls={true}
        />
      </div>
    </>
  );
};

export default DashboardPage;
