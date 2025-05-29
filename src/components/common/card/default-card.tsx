import { TCardData } from '@/src/types/card';
import styles from './styles.module.scss';

const DefaultCard = ({
  data,
  onClick,
  component
}: {
  data: TCardData;
  onClick?: () => void;
  component?: React.ReactNode;
}) => (
  <div className={styles.card} onClick={onClick}>
    {data?.title && <h2>{data?.title}</h2>}
    {data?.description && <p>{data?.description}</p>}
    {component && component}
  </div>
);

export default DefaultCard;
