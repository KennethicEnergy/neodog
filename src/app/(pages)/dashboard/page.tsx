'use client';
import Appointment from '@/components/common/appointment';
import BaseModal from '@/components/common/base-modal';
import Card from '@/components/common/card';
import RecentActivity from '@/components/common/recent-activity';
import Table from '@/components/common/table';
import MetricModal from '@/components/modals/metric-modal';
import { useModalStore } from '@/store/modal-store';
import { TMetricCardData } from '@/types/pet-management';
import { DOG_CHECKIN_HEADERS, SAMPLE_DOG_DATA } from '@/types/table';
import {
  DASHBOARD_METRIC_CARDS,
  SAMPLE_APPOINTMENT_DATA,
  SAMPLE_RECENT_ACTIVITY_DATA
} from '@/utils/constants';
import { AppointmentStatus, AppointmentType } from '@/utils/enums';
import styles from './page.module.scss';

type TAppointmentData = {
  client: string;
  pet: string;
  task: string;
  date: string;
  assignedTo: string;
  status: string;
};

const mapToAppointment = (item: TAppointmentData, idx: number) => ({
  id: String(idx),
  clientId: item.client,
  petId: item.pet,
  type: AppointmentType.CHECKUP, // or map from item.task if possible
  status: AppointmentStatus.CONFIRMED, // or map from item.status if possible
  date: new Date(item.date),
  startTime: '',
  endTime: '',
  assignedTo: item.assignedTo,
  notes: '',
  services: [],
  totalCost: 0,
  createdAt: new Date(),
  updatedAt: new Date()
});

const DashboardPage = () => {
  const openModal = useModalStore((state) => state.openModal);
  const closeModal = useModalStore((state) => state.closeModal);

  const handleMetricCardClick = (data: TMetricCardData) => {
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
          title="Checked-In Dogs"
          icon="/images/paw-white.svg"
          viewAll
          data={SAMPLE_DOG_DATA}
          headers={DOG_CHECKIN_HEADERS}
          fixedColumns={[8]}
        />
      </div>
      {/* <div className={styles.gridRow}>
        <Table
          title="Checked-In Dogs"
          icon="/images/paw-white.svg"
          viewAll
          data={SAMPLE_ORDER_DATA}
          headers={ORDER_HEADERS}
          fixedColumns={[8]}
        />
      </div>
      <div className={styles.gridRow}>
        <Table
          title="Checked-In Dogs"
          icon="/images/paw-white.svg"
          viewAll
          data={SAMPLE_EMPLOYEE_DATA}
          headers={EMPLOYEE_HEADERS}
          fixedColumns={[8]}
        />
      </div> */}

      <div className={styles.appointmentGrid}>
        <Appointment
          title="Appointments"
          icon="/images/calendar-check.svg"
          data={SAMPLE_APPOINTMENT_DATA.map(mapToAppointment)}
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
