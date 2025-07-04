import React from 'react';
import styles from './ClientDetailView.module.scss';

const TABS = [
  'Activity',
  'Appointments',
  'Vaccination Records',
  'Tasks Log',
  'Documents',
  'Financial',
  'Notes'
];

interface ClientTabsProps {
  selectedTab: string;
  onTabChange: (tab: string) => void;
}

const ClientTabs: React.FC<ClientTabsProps> = ({ selectedTab, onTabChange }) => {
  return (
    <div className={styles.tabs} role="tablist">
      {TABS.map((tab) => (
        <div
          key={tab}
          className={selectedTab === tab ? styles.tabActive : ''}
          onClick={() => onTabChange(tab)}
          role="tab"
          aria-selected={selectedTab === tab}
          tabIndex={selectedTab === tab ? 0 : -1}>
          {tab}
        </div>
      ))}
    </div>
  );
};

export default ClientTabs;
