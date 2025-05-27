'use client';

import Appointment from '@/src/components/common/appointment';
import BaseModal from '@/src/components/common/base-modal';
import { useModalStore } from '@/src/store/modal-store';
import { SAMPLE_APPOINTMENT_DATA } from '@/src/utils/constants';

const AppointmentsPage = () => {
  const openModal = useModalStore((state) => state.openModal);
  const closeModal = useModalStore((state) => state.closeModal);

  const handleOpenModal = () => {
    openModal(
      <BaseModal onClose={closeModal}>
        <h2>Create Appointment</h2>
        <p>Modal content here...</p>

        <Appointment
          title="Upcoming Appointments"
          icon="/images/calendar-check.svg"
          data={SAMPLE_APPOINTMENT_DATA}
          isPage={true}
          controls={true}
        />
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
