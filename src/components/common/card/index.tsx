import { TCard, TCardData, TMetricCardData } from '@/src/types/types';
import Image from 'next/image';
import styles from './styles.module.scss';

const Card = ({ type = 'default', data }: TCard) => {
  if (!data) return null;

  switch (type) {
    case 'metric':
      return <MetricCard data={data as TMetricCardData} />;
    case 'default':
    default:
      return <DefaultCard data={data as TCardData} />;
  }
};

const DefaultCard = ({ data }: { data: TCardData }) => (
  <div className={styles.card}>
    {data?.title && <h2>{data?.title}</h2>}
    {data?.description && <p>{data?.description}</p>}
  </div>
);

const MetricCard = ({ data }: { data: TMetricCardData }) => (
  <div className={styles.card}>
    <div className={styles.metrics}>
      {data?.icon && (
        <div className={styles.iconWrapper} style={{ backgroundColor: data?.color }}>
          <Image
            className={styles.icon}
            src={data.icon}
            alt={data?.label || ''}
            width={24}
            height={24}
          />
        </div>
      )}
      {data?.trend && (
        <div className={`${styles.trend} ${data.trend >= 5 ? styles.positive : styles.negative}`}>
          {data.trend >= 5 ? (
            <Image
              className={styles.icon}
              src="/images/metrics-up.svg"
              alt={data?.label || ''}
              width={24}
              height={12}
            />
          ) : (
            <Image
              className={styles.icon}
              src="/images/metrics-down.svg"
              alt={data?.label || ''}
              width={24}
              height={12}
            />
          )}
          <span>{data.trend}%</span>
        </div>
      )}
    </div>
    {data?.trend && data?.value && <div className={styles.metricValue}>{data?.value}</div>}

    {data?.label && <p className={styles.metricLabel}>{data.label}</p>}
  </div>
);

export default Card;
