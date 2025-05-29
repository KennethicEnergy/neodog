import { ReactNode } from 'react';

export type TModalState = {
  modals: ReactNode[];
  openModal: (modal: ReactNode) => void;
  closeModal: () => void;
  closeAllModals: () => void;
};
