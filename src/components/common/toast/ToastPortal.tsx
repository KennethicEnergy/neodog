import React from 'react';
import styles from './styles.module.scss';

const ToastPortal: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className={styles.toastPortal}>
    <div className={styles.toastWrapper}>{children}</div>
  </div>
);

export default ToastPortal;
