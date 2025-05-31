'use client';
import RevenueChart from '@/src/components/common/revenue-chart';
import Table from '@/src/components/common/table';
import { SAMPLE_TABLE_DATA } from '@/src/utils/constants';
import styles from './page.module.scss';

const ReportsPage = () => {
  return (
    <>
      <div>
        <RevenueChart />
      </div>
      <div className={styles.gridRow}>
        <Table title="Tasks" data={SAMPLE_TABLE_DATA} fixedColumns={[0]} />
      </div>

      <div className={styles.gridRow}>
        <Table title="Tasks" data={SAMPLE_TABLE_DATA} fixedColumns={[5]} enableSorting={false} />
      </div>

      <div className={styles.gridRow}>
        <Table title="Tasks" data={SAMPLE_TABLE_DATA} fixedColumns={[0, 5]} />
      </div>

      <div className={styles.gridRow}>
        <Table title="Tasks" data={SAMPLE_TABLE_DATA} fixedRows={[0, 2]} />
      </div>
    </>
  );
};

export default ReportsPage;
