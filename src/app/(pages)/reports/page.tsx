'use client';
import RevenueChart from '@/src/components/common/revenue-chart';
import Table from '@/src/components/common/table';
import { SAMPLE_TABLE_DATA } from '@/src/utils/constants';
import styles from './page.module.scss';

const ReportsPage = () => {
  return (
    <div className={styles.reports}>
      <div>
        <RevenueChart />
      </div>
      <div className={styles.gridRow}>
        <Table title="Table with first column fixed" data={SAMPLE_TABLE_DATA} fixedColumns={[0]} />
      </div>

      <div className={styles.gridRow}>
        <Table
          title="Table with sorting and last column fixed"
          data={SAMPLE_TABLE_DATA}
          fixedColumns={[5]}
          enableSorting={true}
        />
      </div>

      <div className={styles.gridRow}>
        <Table
          title="Table with first and last column fixed"
          data={SAMPLE_TABLE_DATA}
          fixedColumns={[0, 5]}
        />
      </div>

      <div className={styles.gridRow}>
        <Table
          title="Table with first and third row fixed"
          data={SAMPLE_TABLE_DATA}
          fixedRows={[0, 2]}
        />
      </div>
    </div>
  );
};

export default ReportsPage;
