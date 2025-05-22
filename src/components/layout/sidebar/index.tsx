'use client';
import { TMenuItem } from '@/src/types/types';
import { SIDEBAR_MENU_ITEMS } from '@/src/utils/constants';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import DummyIcon from '../../common/dummy-icon';
import styles from './styles.module.scss';

const Sidebar = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();

  const redirect = (item: TMenuItem, index: number) => {
    setActiveIndex(index);
    router.push(item.route);
  };

  const renderItems = (items: TMenuItem[], className: string, startIndex: number) => (
    <div className={styles.sidebarItems}>
      {items.map((item, index) => {
        const itemIndex = startIndex + index;
        return (
          <div
            key={itemIndex}
            className={clsx(
              styles.sidebarItem,
              className,
              activeIndex === itemIndex && styles.active
            )}
            onClick={() => redirect(item, index)}>
            <DummyIcon />
            <p className={styles.itemName}>{item.name}</p>
          </div>
        );
      })}
    </div>
  );

  const renderBrand = () => (
    <div className={styles.brandWrapper}>
      <DummyIcon />
      <h3 className={styles.brand}>NeoDog</h3>
    </div>
  );

  const renderMenuItems = () => renderItems(SIDEBAR_MENU_ITEMS.slice(0, 5), styles.sidebarItem, 0);

  const renderBottomItems = () =>
    renderItems(SIDEBAR_MENU_ITEMS.slice(5, 7), styles.sidebarBottomItem, 5);

  return (
    <div className={styles.sidebar}>
      {renderBrand()}
      {renderMenuItems()}
      <hr />
      {renderBottomItems()}
    </div>
  );
};

export default Sidebar;
