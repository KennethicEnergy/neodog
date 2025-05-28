'use client';

import BaseModal from '@/src/components/common/base-modal';
import { useModalStore } from '@/src/store/modal-store';

const AppointmentsPage = () => {
  const openModal = useModalStore((state) => state.openModal);
  const closeModal = useModalStore((state) => state.closeModal);

  const handleOpenModal = () => {
    openModal(
      <BaseModal onClose={closeModal}>
        <h2>Create Appointment</h2>
        <p>Modal content here...</p>
      </BaseModal>
    );
  };
  return (
    <div>
      <button type="button" onClick={handleOpenModal}>
        Open Modal
      </button>
    </div>
  );
};

export default AppointmentsPage;
