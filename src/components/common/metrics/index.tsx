import { TMetricData } from '@/src/types/metrics';
import DummyIcon from '../dummy-icon';
import styles from './styles.module.scss';

const Metrics = (data: TMetricData) => {
  return (
    <div className={styles.metrics}>
      <div className={styles.label}>
        <p>{data.metricLabel}</p>
        {/* <Icon src={data?.icon} /> */}
        <DummyIcon shape="circle" />
      </div>
      <h2>{data.metricValue}</h2>
      <p>{data.metricDescription}</p>
    </div>
  );
};

export default Metrics;
