import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import HeaderPopup from '../../common/header-popup';
import Icon from '../../common/icon';
import SearchBar from '../../common/searchbar';
import styles from './styles.module.scss';

const Header = () => {
  const router = useRouter();
  const [popupOpen, setPopupOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  const renderBrand = () => (
    <div className={styles.brandWrapper} onClick={() => router.push('/')}>
      <Image className={styles.logo} src="/images/brand.svg" alt="logo" width={24} height={24} />
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setPopupOpen(false);
      }
    };
    if (popupOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [popupOpen]);

  const renderHeaderRight = () => {
    return (
      <div className={styles.headerRight} ref={popupRef}>
        <Icon
          src="/images/icon-plus.svg"
          width={8}
          height={8}
          shape="circle"
          bgColor="#3B82F6"
          onClick={() => setPopupOpen(!popupOpen)}
        />
        {popupOpen && <HeaderPopup isOpen={popupOpen} setPopupOpen={setPopupOpen} />}
        <div className={styles.notification}>
          <span className={styles.count}>9</span>
          <Icon src="/images/bell.svg" width={16} height={16} />
        </div>
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
