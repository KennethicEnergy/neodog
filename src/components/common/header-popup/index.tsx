'use client';
import { useRouter } from 'next/navigation';
import Icon from '../icon';
import styles from './styles.module.scss';

type PopupItem = {
  route?: string;
  icon: string;
  name: string;
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

  const handleClick = (item: PopupItem) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.route) {
      router.push(item.route);
    }
    setPopupOpen(false);
  };

  return (
    <div className={styles.popup}>
      {data.map((item, index) => (
        <div key={index} className={styles.popupItem} onClick={() => handleClick(item)}>
          <Icon src={item?.icon} />
          <span>{item?.name}</span>
        </div>
      ))}
    </div>
  );
};

export default HeaderPopup;
