import { TCard, TCardData } from '@/types/card';
import { TMetricCardData } from '@/types/pet-management';
import DefaultCard from './default-card';
import MetricCard from './metrics-card';

const Card = ({
  type = 'default',
  data,
  onClick,
  component
}: TCard & { onClick?: () => void } & { component?: React.ReactNode }) => {
  if (!data) return null;
  switch (type) {
    case 'metric':
      return <MetricCard data={data as TMetricCardData} onClick={onClick} />;
    case 'default':
    default:
      return <DefaultCard data={data as TCardData} onClick={onClick} component={component} />;
  }
};

export default Card;
