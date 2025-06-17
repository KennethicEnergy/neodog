import { Button } from '@/components/common/button';
import StatusTag from '@/components/common/status-tag';
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
}

interface PetCardProps {
  pet: Pet;
}

const PetCard = ({ pet }: PetCardProps) => {
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'HEALTHY':
        return 'success';
      case 'MEDICAL ISSUE':
        return 'danger';
      case 'FOLLOW-UP REQUIRED':
        return 'warning';
      case 'PENDING':
        return 'primary';
      default:
        return 'info'; // fallback
    }
  };

  return (
    <div className={styles.petCard}>
      <div className={styles.imageContainer}>
        <div className={styles.imagePlaceholder}>
          {pet.image && <Image src={pet.image} alt={pet.name} width={100} height={100} />}
        </div>
      </div>
      <div className={styles.petInfo}>
        <div className={styles.row}>
          <span className={styles.name}>{pet.name}</span>
          <StatusTag status={pet.status} bgColor={getStatusClass(pet.status)} />
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
        <Button variant="white" size="sm" className={styles.profile}>
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
