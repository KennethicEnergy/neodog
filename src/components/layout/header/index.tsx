import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Icon from '../../common/icon';
import SearchBar from '../../common/searchbar';
import styles from './styles.module.scss';

const Header = () => {
  const router = useRouter();
  const renderBrand = () => (
    <div className={styles.brandWrapper} onClick={() => router.push('/')}>
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
        <Icon src="/images/icon-plus.svg" width={8} height={8} shape="circle" bgColor="#3B82F6" />
        <Icon src="/images/bell.svg" width={16} height={16} />
        <div className={styles.user}>
          <Icon width={24} height={24} shape="circle" />
          <div className={styles.userDetails}>
            <p className={styles.name}>David Miller</p>
            <p className={styles.role}>Admin</p>
          </div>
          <Icon
            src="/images/arrow-down.svg"
            width={8}
            height={8}
            bgColor="#EEEEEE"
            shape="circle"
          />
        </div>
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
