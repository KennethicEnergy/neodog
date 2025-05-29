import { TCardData } from '@/src/types/types';
import styles from './styles.module.scss';

const DefaultCard = ({ data, onClick }: { data: TCardData; onClick?: () => void }) => (
  <div className={styles.card} onClick={onClick}>
    {data?.title && <h2>{data?.title}</h2>}
    {data?.description && <p>{data?.description}</p>}
  </div>
);

export default DefaultCard;
