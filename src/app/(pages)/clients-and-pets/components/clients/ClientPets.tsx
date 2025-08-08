import Icon from '@/components/common/icon';
import PetModal from '@/components/modals/pet-modal';
import { Pet } from '@/services/client.api';
import { useModalStore } from '@/store/modal-store';
import { getPetImageUrl } from '@/utils/image';
import Image from 'next/image';
import React from 'react';
import styles from './ClientDetailView.module.scss';

interface ClientPetsProps {
  pets: Pet[];
  onAddPet: () => void;
}

const ClientPets: React.FC<ClientPetsProps> = ({ pets, onAddPet }) => {
  const openModal = useModalStore((state) => state.openModal);
  const closeModal = useModalStore((state) => state.closeModal);

  const handleViewPet = (pet: Pet) => {
    // Transform the pet to match the expected format for PetModal
    const transformedPet = {
      id: pet.id,
      name: pet.name,
      breed: 'Unknown Breed', // We don't have breed info in the API response
      age: pet.age,
      owner: '', // We don't have owner info in the API response
      lastVisit: pet.last_visit,
      status: 'HEALTHY',
      image: null,
      photo_path: pet.photo_path
    };
    openModal(<PetModal pet={transformedPet} onClose={closeModal} />);
  };

  return (
    <>
      <div className={styles.pets}>
        {pets?.map((pet) => {
          const imageUrl = getPetImageUrl(pet.photo_path || null);

          return (
            <div
              key={pet.id}
              className={styles.pet}
              onClick={() => handleViewPet(pet)}
              style={{ cursor: 'pointer' }}>
              <div className={styles.petAvatar}>
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={pet.name}
                    width={60}
                    height={60}
                    className={styles.petImage}
                    onError={(e) => {
                      console.warn('Failed to load pet image:', imageUrl);
                      // Hide the image on error
                      e.currentTarget.style.display = 'none';
                      const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                      if (placeholder) {
                        placeholder.style.display = 'flex';
                      }
                    }}
                    unoptimized={true}
                  />
                ) : null}
                {/* Fallback placeholder with pet initials */}
                <div
                  className={styles.petAvatarPlaceholder}
                  style={{ display: imageUrl ? 'none' : 'flex' }}>
                  {pet.name.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className={styles.petName}>{pet.name}</div>
              <div className={styles.petBreed}>Unknown Breed</div>
            </div>
          );
        })}
      </div>
      <div className={styles.addContainer} onClick={onAddPet}>
        <Icon src="/images/icon-plus.svg" height={40} width={40} bgColor="#7F7F7F" shape="circle" />
        <span>Add Pet</span>
      </div>
    </>
  );
};

export default ClientPets;
