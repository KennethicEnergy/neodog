import { TMenuItem } from '@/types/common';
import { SIDEBAR_MENU_ITEMS } from '@/utils/constants';
import clsx from 'clsx';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import styles from './styles.module.scss';

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (route: string) => {
    if (route === '/') {
      return pathname === '/';
    }
    if (route === '/clients') {
      return pathname === '/clients' || pathname === '/pets';
    }
    return pathname === route || pathname.startsWith(route + '/');
  };

  const getIconPath = (iconPath: string, isActive: boolean) => {
    if (isActive) {
      return iconPath.replace('-dark.svg', '-light.svg');
    }
    return iconPath;
  };

  const renderItems = (items: TMenuItem[], className: string) => (
    <div className={styles.sidebarItems}>
      {items.map((item, index) => {
        const active = isActive(item.route);
        return (
          <div
            key={index}
            className={clsx(styles.sidebarItem, className, active && styles.active)}
            onClick={() => router.push(item.route)}>
            <Image
              className={styles.icon}
              src={getIconPath(item.icon, active)}
              alt={item.name}
              width={24}
              height={24}
            />
            <p className={styles.itemName}>{item.name}</p>
          </div>
        );
      })}
    </div>
  );

  const renderBrand = () => (
    <div className={styles.brandWrapper} onClick={() => router.push('/')}>
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
