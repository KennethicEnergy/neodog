import Icon from '@/components/common/icon';
import styles from './TabNavigation.module.scss';

interface TabNavigationProps {
  activeTab: 'pets' | 'clients';
  onTabChange: (tab: 'pets' | 'clients') => void;
}

const TabNavigation = ({ activeTab, onTabChange }: TabNavigationProps) => {
  return (
    <div className={styles.tabContainer}>
      <div
        className={`${styles.tab} ${activeTab === 'clients' ? styles.active : ''}`}
        onClick={() => onTabChange('clients')}>
        <Icon
          src={`/images/pets-and-clients/client-${activeTab === 'clients' ? 'light' : 'dark'}.svg`}
          width={18}
          height={18}
        />
        Clients
      </div>
      <div
        className={`${styles.tab} ${activeTab === 'pets' ? styles.active : ''}`}
        onClick={() => onTabChange('pets')}>
        <Icon
          src={`/images/pets-and-clients/dog-${activeTab === 'pets' ? 'light' : 'dark'}.svg`}
          width={18}
          height={18}
        />
        Pets
      </div>
    </div>
  );
};

export default TabNavigation;
