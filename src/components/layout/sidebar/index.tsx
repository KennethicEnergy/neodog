import React from 'react'
import styles from './styles.module.scss';
import DummyIcon from '../../common/dummy-icon';

const sidebarMenuItems = [
  "Dashboard",
  "Pets & Client",
  "Appointments",
  "Services",
  "Reports"
]

const sidebarBottomItems = [
  "Support",
  "Settings"
]

const Sidebar = () => {

  const renderItems = (items: string[], className: string) => (
    <div className={styles.sidebarItems}>
      {items.map((item, index) => (
        <div key={index} className={className}>
          <DummyIcon /> {item}
        </div>
      ))}
    </div>
  );

  const renderBrand = () => (
    <div className={styles.brandWrapper}>
      <DummyIcon />
      <h3 className={styles.brand}>NeoDog</h3>
    </div>
  )

  const renderMenuItems = () => renderItems(sidebarMenuItems, styles.sidebarItem);

  const renderBottomItems = () => renderItems(sidebarBottomItems, styles.sidebarBottomItem);

  return (
    <div className={styles.sidebar}>
      {renderBrand()}
      {renderMenuItems()}
      <hr />
      {renderBottomItems()}
    </div>
  )
}

export default Sidebar