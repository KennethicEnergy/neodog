import Icon from '@/components/common/icon';
import PetModal from '@/components/modals/pet-modal';
import { useModalStore } from '@/store/modal-store';
import React from 'react';
import styles from './ClientDetailView.module.scss';
import { Pet } from './types';

interface ClientPetsProps {
  pets: Pet[];
  onAddPet: () => void;
}

const ClientPets: React.FC<ClientPetsProps> = ({ pets, onAddPet }) => {
  const openModal = useModalStore((state) => state.openModal);
  const closeModal = useModalStore((state) => state.closeModal);

  const handleViewPet = (pet: Pet) => {
    openModal(<PetModal pet={pet} onClose={closeModal} />);
  };

  return (
    <>
      <div className={styles.pets}>
        {pets?.map((pet) => (
          <div
            key={pet.id}
            className={styles.pet}
            onClick={() => handleViewPet(pet)}
            style={{ cursor: 'pointer' }}>
            <div className={styles.petAvatar} />
            <div className={styles.petName}>{pet.name}</div>
            <div className={styles.petBreed}>{pet.breed}</div>
          </div>
        ))}
      </div>
      <div className={styles.addContainer} onClick={onAddPet}>
        <Icon src="/images/icon-plus.svg" height={40} width={40} bgColor="#7F7F7F" shape="circle" />
        <span>Add Pet</span>
      </div>
    </>
  );
};

export default ClientPets;
