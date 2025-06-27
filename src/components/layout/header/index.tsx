'use client';
import BaseModal from '@/components/common/base-modal';
import AddClient from '@/components/modals/add-client';
import { useAuthStore } from '@/store/auth.store';
import { useModalStore } from '@/store/modal-store';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import HeaderPopup from '../../common/header-popup';
import Icon from '../../common/icon';
import SearchBar from '../../common/searchbar';
import styles from './styles.module.scss';

const Header = () => {
  const router = useRouter();
  const [activePopup, setActivePopup] = useState<'add' | 'user' | null>(null);
  const addPopupRef = useRef<HTMLDivElement>(null);
  const userPopupRef = useRef<HTMLDivElement>(null);
  const openModal = useModalStore((state) => state.openModal);
  const closeModal = useModalStore((state) => state.closeModal);
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const openAddModal = () => {
    openModal(
      <BaseModal onClose={closeModal}>
        <AddClient />
      </BaseModal>
    );
  };

  const HEADER_POPUP_DATA = [
    {
      name: 'New appointment',
      icon: '/images/popup-appointment.svg',
      route: '/appointments'
    },
    {
      name: 'Check-in Pet',
      icon: '/images/popup-check-in-pets.svg',
      route: '/clients-and-pets'
    },
    {
      name: 'Add Client',
      icon: '/images/popup-client.svg',
      route: '/clients-and-pets',
      onClick: openAddModal
    },
    {
      name: 'Create Invoice',
      icon: '/images/popup-create-invoice.svg',
      route: ''
    }
  ];

  const USER_POPUP_DATA = [
    {
      name: 'Logout',
      icon: '/images/logout.svg',
      route: '/login',
      onClick: handleLogout
    }
  ];

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
      const target = event.target as Node;
      const isAddPopupClick = addPopupRef.current?.contains(target);
      const isUserPopupClick = userPopupRef.current?.contains(target);

      if (!isAddPopupClick && !isUserPopupClick) {
        setActivePopup(null);
      }
    };

    if (activePopup) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activePopup]);

  const renderHeaderRight = () => {
    return (
      <div className={styles.headerRight}>
        <div ref={addPopupRef} className={styles.popupContainer}>
          <Icon
            src="/images/icon-plus.svg"
            width={8}
            height={8}
            shape="circle"
            bgColor="blueActive"
            onClick={() => setActivePopup(activePopup === 'add' ? null : 'add')}
          />
          {activePopup === 'add' && (
            <HeaderPopup setPopupOpen={() => setActivePopup(null)} data={HEADER_POPUP_DATA} />
          )}
        </div>
        <div className={styles.notification}>
          <span className={styles.count}>9</span>
          <Icon src="/images/bell.svg" width={16} height={16} />
        </div>
        <div className={styles.user}>
          <Icon width={24} height={24} shape="circle" />
          <div className={styles.userDetails}>
            <p className={styles.name}>{user ? `${user.first_name} ${user.last_name}` : 'Guest'}</p>
            <p className={styles.role}>
              {user ? (user.account_type_id === 1 ? 'Admin' : 'User') : ''}
            </p>
          </div>
          <div ref={userPopupRef} className={styles.popupContainer}>
            <Icon
              src="/images/arrow-down.svg"
              width={8}
              height={8}
              bgColor="gray200"
              shape="circle"
              onClick={() => setActivePopup(activePopup === 'user' ? null : 'user')}
            />
            {user && activePopup === 'user' && (
              <HeaderPopup setPopupOpen={() => setActivePopup(null)} data={USER_POPUP_DATA} />
            )}
          </div>
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
