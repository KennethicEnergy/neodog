import React from 'react';
import styles from './styles.module.scss';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.brandWrapper}>
        <p className={styles.brand}>Neodog</p>
      </div>
     <div className={styles.brandWrapper}>
        <p className={styles.brand}>Neodog</p>
      </div>
      <div className={styles.brandWrapper}>
        <p className={styles.brand}>Neodog</p>
      </div>
    </header>
  )
}

export default Header