import { TIcon } from '@/src/types/types';
import Image from 'next/image';
import DummyIcon from '../dummy-icon';
import styles from './styles.module.scss';

const Icon = ({
  icon,
  label,
  color = '#c3c3c3',
  shape = 'square',
  height = 24,
  width = 24
}: TIcon) => {
  if (!icon) {
    return <DummyIcon shape={shape} />;
  }

  return (
    <div className={`${styles.iconWrapper} ${styles[shape]}`} style={{ backgroundColor: color }}>
      <Image
        className={`${styles.icon} ${styles[shape]}`}
        src={icon}
        alt={label || ''}
        width={width}
        height={height}
      />
    </div>
  );
};

export default Icon;
