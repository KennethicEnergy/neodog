import React from 'react'
import styles from './styles.module.scss';


const sidebarMenuItems = [
  "Dashboard",
  "Client",
  "Appointments",
  "Settings"
]

const sidebarBottomItems = [
  "Logout"
]

const Sidebar = () => {


  const renderItems = (items: string[], className: string) => (
    <div>
      {items.map((item, index) => (
        <div key={index} className={className}>
          {item}
        </div>
      ))}
    </div>
  );

  const renderMenuItems = () => renderItems(sidebarMenuItems, styles.sidebarItem);

  const renderBottomItems = () => renderItems(sidebarBottomItems, styles.sidebarBottomItem);

  return (
    <div className={styles.sidebar}>
      {renderMenuItems()}
      {renderBottomItems()}
    </div>
  )
}

export default Sidebar