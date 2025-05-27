import { TMetricCardData } from '@/src/types/types';
import Image from 'next/image';
import Icon from '../icon';
import styles from './styles.module.scss';

const MetricCard = ({ data }: { data: TMetricCardData }) => {
  const renderTrendIcon = (icon: string) => {
    return (
      <Image
        className={styles.icon}
        src={`/images/metrics-${icon}.svg`}
        alt={''}
        width={14}
        height={12}
      />
    );
  };
  return (
    <div className={styles.card}>
      <div className={styles.metrics}>
        {data?.icon && (
          <Icon src={data?.icon} label={data?.label} bgColor={data?.color} width={14} />
        )}
        {data?.trend && (
          <div className={`${styles.trend} ${data.trend >= 5 ? styles.positive : styles.negative}`}>
            {data.trend >= 5 ? renderTrendIcon('up') : renderTrendIcon('down')}
            <span>{data.trend}%</span>
          </div>
        )}
      </div>
      {data?.trend && data?.value && <div className={styles.metricValue}>{data?.value}</div>}
      {data?.label && <p className={styles.metricLabel}>{data.label}</p>}
    </div>
  );
};

export default MetricCard;
