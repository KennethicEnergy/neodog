import { TMetricCardData } from '@/src/types/card';
import styles from './styles.module.scss';

const Metrics = (data: TMetricCardData) => {
  return <div className={styles.metrics}>{data?.label}</div>;
};

export default Metrics;
