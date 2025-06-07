import { colors } from '@/styles/colors';
import { TIcon } from '@/types/icon';
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

  const getBackgroundColor = (colorKey: string) => {
    if (!colorKey) return '';

    if (colorKey.startsWith('$')) {
      const key = colorKey.slice(1).replace(/-/g, '') as keyof typeof colors;
      return colors[key] || colorKey;
    }

    // Handle direct color keys
    const key = colorKey as keyof typeof colors;
    return colors[key] || colorKey;
  };

  return (
    <div
      className={`${styles.iconWrapper} ${styles[shape]} ${onClick != null ? styles.clickable : ''}`}
      style={{ backgroundColor: getBackgroundColor(bgColor) }}
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
