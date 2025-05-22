import { TCard, TCardData, TMetricCardData } from '@/src/types/types';
import DefaultCard from './default-card';
import MetricCard from './metrics-card';

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

export default Card;
