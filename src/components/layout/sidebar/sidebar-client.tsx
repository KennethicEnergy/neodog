import clsx from 'clsx';
import DummyIcon from '../../common/dummy-icon';
import styles from './styles.module.scss';

type TMenuItem = {
  name: string;
  route: string;
};

const sidebarMenuItems: TMenuItem[] = [
  { name: 'Dashboard', route: '/' },
  { name: 'Pets & Client', route: '/pets-and-client' },
  { name: 'Appointments', route: '/appointments' },
  { name: 'Services', route: '/services' },
  { name: 'Reports', route: '/reports' },
  { name: 'Support', route: '/support' },
  { name: 'Settings', route: '/settings' }
];

const SidebarClient = () => {
  // const [activeIndex, setActiveIndex] = useState(0);
  // const router = useRouter();

  const redirect = (item: TMenuItem, index: number) => {
    // setActiveIndex(index);
    // router.push(item.route);
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
              // activeIndex === itemIndex && styles.active
            )}>
            {/* onClick={() => redirect(item, index)}> */}
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

  const renderMenuItems = () => renderItems(sidebarMenuItems.slice(0, 5), styles.sidebarItem, 0);

  const renderBottomItems = () =>
    renderItems(sidebarMenuItems.slice(5, 7), styles.sidebarBottomItem, 5);

  return (
    <div className={styles.sidebar}>
      {renderBrand()}
      {renderMenuItems()}
      <hr />
      {renderBottomItems()}
    </div>
  );
};

export default SidebarClient;
