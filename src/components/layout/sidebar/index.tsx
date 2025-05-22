'use client';
import { TMenuItem } from '@/src/types/types';
import { SIDEBAR_MENU_ITEMS } from '@/src/utils/constants';
import clsx from 'clsx';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import styles from './styles.module.scss';

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const redirect = (item: TMenuItem) => {
    router.push(item.route);
  };

  const isActive = (route: string) => {
    if (route === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(route);
  };

  const renderItems = (items: TMenuItem[], className: string) => (
    <div className={styles.sidebarItems}>
      {items.map((item, index) => (
        <div
          key={index}
          className={clsx(styles.sidebarItem, className, isActive(item.route) && styles.active)}
          onClick={() => redirect(item)}>
          <Image className={styles.icon} src={item?.icon} alt={item.name} width={24} height={24} />
          <p className={styles.itemName}>{item.name}</p>
        </div>
      ))}
    </div>
  );

  const renderBrand = () => (
    <div className={styles.brandWrapper}>
      <Image src="/images/brand.svg" alt="logo" width={24} height={24} />
      <h3 className={styles.brand}>NeoDog</h3>
    </div>
  );

  const renderMenuItems = () => renderItems(SIDEBAR_MENU_ITEMS.slice(0, 5), styles.sidebarItem);

  const renderBottomItems = () =>
    renderItems(SIDEBAR_MENU_ITEMS.slice(5, 7), styles.sidebarBottomItem);

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