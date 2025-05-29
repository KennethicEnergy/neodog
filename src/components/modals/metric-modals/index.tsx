import { TMetricCardData } from '@/src/types/card';
import Metrics from '../../common/metrics';
import styles from './styles.module.scss';

const MetricModal = (data: TMetricCardData) => {
  console.log('@@ data', data);

  return (
    <div className={styles.metricModal}>
      <h2>{data.label}</h2>
      <div className={styles.metricGrid}>
        <Metrics {...data} />
      </div>
      <div></div>
    </div>
  );
};

export default MetricModal;
