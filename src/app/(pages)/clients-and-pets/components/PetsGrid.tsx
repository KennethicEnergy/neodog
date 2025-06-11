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
  return (
    <div className={styles.petsGrid}>
      {pets.map((pet) => (
        <PetCard key={pet.id} pet={pet} />
      ))}
    </div>
  );
};

export default PetsGrid;
