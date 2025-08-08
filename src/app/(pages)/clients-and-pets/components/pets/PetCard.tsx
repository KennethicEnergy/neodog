import { Button } from '@/components/common/button';
import PetModal from '@/components/modals/pet-modal';
import { useModalStore } from '@/store/modal-store';
import { getPetImageUrl } from '@/utils/image';
import Image from 'next/image';
import styles from './PetCard.module.scss';

interface Pet {
  id: number;
  name: string;
  breed: string;
  age: string;
  owner: string;
  lastVisit: string;
  status: string;
  image: string | null;
  photo_path?: string | null;
}

interface PetCardProps {
  pet: Pet;
}

const PetCard = ({ pet }: PetCardProps) => {
  const openModal = useModalStore((state) => state.openModal);
  const closeModal = useModalStore((state) => state.closeModal);

  const handleViewProfile = () => {
    openModal(<PetModal pet={pet} onClose={closeModal} />);
  };

  // Get the correct image URL using the API pattern
  const imageUrl = getPetImageUrl(pet.photo_path || null);

  return (
    <div className={styles.petCard}>
      <div className={styles.imageContainer} onClick={handleViewProfile}>
        <div className={styles.imagePlaceholder}>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={pet.name}
              width={100}
              height={100}
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
          <div
            className={styles.imagePlaceholderFallback}
            style={{ display: imageUrl ? 'none' : 'flex' }}>
            {pet.name.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
      <div className={styles.petInfo}>
        <div className={styles.row}>
          <span className={styles.name}>{pet.name}</span>
          {/* <StatusTag status={pet.status} bgColor={getStatusClass(pet.status)} /> */}
        </div>
        {/* <div className={styles.row}>
          <span className={styles.breed}>{pet.breed}</span>
          <span className={styles.age}>{pet.age}</span>
        </div> */}
        <div className={styles.row}>
          <span className={styles.owner}>{pet.owner}</span>
        </div>
        {/* <div className={styles.row}>
          <span className={styles.lastVisit}>Last Visit: {pet.lastVisit}</span>
        </div> */}
      </div>
      <div className={styles.controls}>
        <Button variant="white" size="sm" className={styles.profile} onClick={handleViewProfile}>
          Profile
        </Button>
        <Button variant="dark" size="sm" className={styles.schedule}>
          Schedule
        </Button>
      </div>
    </div>
  );
};

export default PetCard;
