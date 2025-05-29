import { TMetricCardData } from '@/src/types/metrics';
import { SAMPLE_TAB_APPOINTMENT_DATA, SAMPLE_TAB_VACCINATION_DATA } from '@/src/utils/constants';
import { Fragment } from 'react';
import Metrics from '../../common/metrics';
import Tabs from '../../common/tabs';
import styles from './styles.module.scss';

const MetricModal = (data: TMetricCardData) => {
  const renderContent = () => {
    const dataMap = {
      appointments: SAMPLE_TAB_APPOINTMENT_DATA,
      vaccination: SAMPLE_TAB_VACCINATION_DATA,
      revenue: null,
      clients: null
    };

    const tabData = dataMap[data.type as keyof typeof dataMap];

    if (data.type === 'appointments' || data.type === 'vaccination') {
      return tabData ? <Tabs type={data.type} data={tabData} /> : null;
    }

    return null;
  };

  return (
    <div className={styles.metricModal}>
      <h2>{data.label}</h2>
      <div className={styles.metricGrid}>
        {data?.metrics &&
          Object.entries(data.metrics).map(([key, metricsArray]) =>
            metricsArray?.map((metricData, index) => (
              <Fragment key={`${key}-${index}`}>
                <Metrics {...metricData} />
              </Fragment>
            ))
          )}
      </div>
      <div>{renderContent()}</div>
    </div>
  );
};

export default MetricModal;
