import React from 'react';
import styles from './ClientDetailView.module.scss';

interface PlaceholderTabProps {
  tabName: string;
}

const PlaceholderTab: React.FC<PlaceholderTabProps> = ({ tabName }) => {
  return (
    <div className={styles.activity}>
      <h4>{tabName}</h4>
      <div className={styles.placeholderContent}>{tabName} content coming soon.</div>
    </div>
  );
};

export default PlaceholderTab;
