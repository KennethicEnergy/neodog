import Icon from '@/components/common/icon';
import Loader from '@/components/common/loader';
import petCardStyles from '../../clients-and-pets/components/pets/PetCard.module.scss';
import styles from './VaccinationsMetrics.module.scss';

interface MetricCard {
  label: string;
  value: number;
  icon: string;
  color: string;
}

interface VaccinationsMetricsProps {
  metrics: MetricCard[];
  loading?: boolean;
}

const VaccinationsMetrics = ({ metrics, loading = false }: VaccinationsMetricsProps) => {
  return (
    <div className={styles.metricsGrid}>
      {metrics.map((card) => (
        <div key={card.label} className={petCardStyles.petCard + ' ' + styles.metricCard}>
          <div className={styles.metricIcon}>
            <Icon
              src={card.icon}
              bgColor={card.color}
              width={24}
              height={24}
              shape="circle"
              label={card.label}
            />
          </div>
          <div className={styles.metricContent}>
            <div className={styles.metricValue}>{loading ? <Loader /> : card.value}</div>
            <div className={styles.metricLabel}>{card.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VaccinationsMetrics;
