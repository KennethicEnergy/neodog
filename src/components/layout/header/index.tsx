import Image from 'next/image';
import DummyIcon from '../../common/dummy-icon';
import SearchBar from '../../common/searchbar';
import styles from './styles.module.scss';

const Header = () => {
  const renderBrand = () => (
    <div className={styles.brandWrapper}>
      <Image className={styles.logo} src="/images/brand.svg" alt="logo" width={24} height={24} />
      <h3 className={styles.brand}>NeoDog</h3>
    </div>
  );

  const renderHeaderLeft = () => {
    return (
      <div className={styles.headerLeft}>
        {renderBrand()}
        <SearchBar />
      </div>
    );
  };

  const renderHeaderRight = () => {
    return (
      <div className={styles.headerRight}>
        <DummyIcon />
        <div className={styles.user}>
          <DummyIcon />
          <div className={styles.userDetails}>
            <p className={styles.name}>David Miller</p>
            <p className={styles.role}>Admin</p>
          </div>
          <DummyIcon />
        </div>
        <DummyIcon />
      </div>
    );
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerWrapper}>
        {renderHeaderLeft()}
        {renderHeaderRight()}
      </div>
    </header>
  );
};

export default Header;
