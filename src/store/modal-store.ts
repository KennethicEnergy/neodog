import { create } from 'zustand';
import { TModalState } from '../types/modal';

export const useModalStore = create<TModalState>((set) => ({
  modals: [],
  openModal: (modal) => set((state) => ({ modals: [...state.modals, modal] })),
  closeModal: () => set((state) => ({ modals: state.modals.slice(0, -1) })),
  closeAllModals: () => set({ modals: [] })
}));
