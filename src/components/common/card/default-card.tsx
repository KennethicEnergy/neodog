import { TCardData } from '@/src/types/types';
import styles from './styles.module.scss';

const DefaultCard = ({ data }: { data: TCardData }) => (
  <div className={styles.card}>
    {data?.title && <h2>{data?.title}</h2>}
    {data?.description && <p>{data?.description}</p>}
  </div>
);

export default DefaultCard;