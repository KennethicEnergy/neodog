import React from 'react';
import styles from './styles.module.scss';
import DummyIcon from '../../common/dummy-icon';

const Header = () => {

  const renderAvatar = () => {
    return (
      <div className={styles.user}>
        <DummyIcon />
        <div className={styles.userDetails}>
          <p className={styles.name}>David Miller</p>
          <p className={styles.role}>Admin</p>
        </div>
        <DummyIcon />
      </div>
    )
  }

  return (
    <header className={styles.header}>
      <DummyIcon />
      {renderAvatar()}
      <DummyIcon />
    </header>
  )
}

export default Header