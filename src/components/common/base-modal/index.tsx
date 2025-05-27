'use client';
import { useModalStore } from '@/src/store/modal-store';
import { ReactNode, useEffect } from 'react';
import Icon from '../icon';
import styles from './styles.module.scss';

interface BaseModalProps {
  children: ReactNode;
  onClose?: () => void;
  className?: string;
  showCloseButton?: boolean;
}

export default function BaseModal({ children, onClose, className = '', showCloseButton = true }: BaseModalProps) {
  const closeModal = useModalStore((state) => state.closeModal);

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
    closeModal();
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className={`modal-overlay ${className}`} onClick={handleClose}>
      <div className="modal-content">
        <div className="content-wrapper" onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
        {showCloseButton && (
          <div className={styles.closeButton}>
            <Icon
              icon="/images/close.svg"
              width={16}
              height={16}
              onClick={handleClose}
              shape=""
              color=""
            />
          </div>
      )}
      </div>
    </div>
  );
}
