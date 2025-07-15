'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Icon from '../icon';
import styles from './styles.module.scss';

type PopupItem = {
  icon: string;
  iconLight?: string;
  iconDark?: string;
  name: string;
  route?: string;
  onClick?: () => void;
};

const HeaderPopup = ({
  setPopupOpen,
  data
}: {
  setPopupOpen: (open: boolean) => void;
  data: PopupItem[];
}) => {
  const router = useRouter();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleClick = (item: PopupItem) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.route) {
      router.push(item.route);
    }
    setPopupOpen(false);
  };

  const getIconSrc = (item: PopupItem, index: number) => {
    const isHovered = hoveredIndex === index;

    // If we have light/dark variants and item is hovered, use light icon
    if (isHovered && item.iconLight) {
      return item.iconLight;
    }

    // If we have dark variant and item is not hovered, use dark icon
    if (!isHovered && item.iconDark) {
      return item.iconDark;
    }

    // Fallback to the default icon
    return item.icon;
  };

  if (!data.length) return null;

  return (
    <div className={styles.popup}>
      {data.map((item, index) => (
        <div
          key={index}
          className={styles.popupItem}
          onClick={() => handleClick(item)}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}>
          <Icon src={getIconSrc(item, index)} width={16} height={16} />
          <span>{item?.name}</span>
        </div>
      ))}
    </div>
  );
};

export default HeaderPopup;
