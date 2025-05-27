import { TIcon } from '@/src/types/types';
import Image from 'next/image';
import DummyIcon from '../dummy-icon';
import styles from './styles.module.scss';

const Icon = ({ src, label, bgColor = '', shape = '', height = 12, width = 12 }: TIcon) => {
  if (!src) {
    return <DummyIcon shape={shape} />;
  }

  return (
    <div className={`${styles.iconWrapper} ${styles[shape]}`} style={{ backgroundColor: bgColor }}>
      <Image
        className={`${styles.icon} ${styles[shape]}`}
        src={src}
        alt={label || ''}
        width={width}
        height={height}
      />
    </div>
  );
};

export default Icon;
