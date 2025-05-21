"use client"
import styles from './styles.module.scss';
import DummyIcon from '../../common/dummy-icon';
import clsx from 'clsx';
import { useState } from 'react';

const sidebarMenuItems = [
  "Dashboard",
  "Pets & Client",
  "Appointments",
  "Services",
  "Reports",
  "Support",
  "Settings"
]

const Sidebar = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const renderItems = (
    items: string[],
    className: string,
    startIndex: number, // Base index for this section
  ) => (
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
            onClick={() => setActiveIndex(itemIndex)}
          >
            <DummyIcon />
            <p className={styles.itemName}>{item}</p>
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

  const renderMenuItems = () =>
    renderItems(
      sidebarMenuItems.slice(0, 5),
      styles.sidebarItem,
      0 // Start index for top menu is 0
    );

  const renderBottomItems = () =>
    renderItems(
      sidebarMenuItems.slice(5, 7),
      styles.sidebarBottomItem,
      5 // Start index for bottom menu is 5
    );

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