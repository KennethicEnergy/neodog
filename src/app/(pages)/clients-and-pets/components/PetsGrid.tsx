import PetCard from './PetCard';
import styles from './PetsGrid.module.scss';

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

interface PetsGridProps {
  pets: Pet[];
}

const PetsGrid = ({ pets }: PetsGridProps) => {
  if (!pets || pets.length === 0) {
    return (
      <div className={styles.noDataContainer}>
        <div className={styles.noDataContent}>
          <div className={styles.noDataIcon}>🐾</div>
          <h3 className={styles.noDataTitle}>No Pets Found</h3>
          <p className={styles.noDataMessage}>There are no pets to display at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.petsGrid}>
      {pets.map((pet, index) => (
        <PetCard key={index} pet={pet} />
      ))}
    </div>
  );
};

export default PetsGrid;
