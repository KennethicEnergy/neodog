import { TCard, TCardData, TMetricCardData } from '@/src/types/card';
import DefaultCard from './default-card';
import MetricCard from './metrics-card';

const Card = ({ type = 'default', data, onClick }: TCard & { onClick?: () => void }) => {
  if (!data) return null;
  switch (type) {
    case 'metric':
      return <MetricCard data={data as TMetricCardData} onClick={onClick} />;
    case 'default':
    default:
      return <DefaultCard data={data as TCardData} onClick={onClick} />;
  }
};

export default Card;
