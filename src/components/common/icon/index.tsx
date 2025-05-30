import { TIcon } from '@/src/types/icon';
import Image from 'next/image';
import DummyIcon from '../dummy-icon';
import styles from './styles.module.scss';

const Icon = ({
  src,
  label,
  bgColor = '',
  shape = '',
  height = 12,
  width = 12,
  onClick
}: TIcon) => {
  if (!src) {
    return <DummyIcon shape={shape} onClick={onClick ?? (() => {})} />;
  }

  return (
    <div
      className={`${styles.iconWrapper} ${styles[shape]} ${onClick != null ? styles.clickable : ''}`}
      style={{ backgroundColor: bgColor }}
      onClick={onClick}>
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
