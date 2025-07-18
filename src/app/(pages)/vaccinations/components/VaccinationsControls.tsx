import { Button } from '@/components/common/button';
import SearchBar from '@/components/common/searchbar';
import styles from './VaccinationsControls.module.scss';

interface VaccinationsControlsProps {
  onSearch: (query: string) => void;
  searchPlaceholder?: string;
  onNewVaccine?: () => void;
}

const VaccinationsControls = ({
  onSearch,
  searchPlaceholder = 'Search Vaccinations',
  onNewVaccine
}: VaccinationsControlsProps) => {
  return (
    <div className={styles.topControls}>
      <div className={styles.searchContainer}>
        <SearchBar onSearch={onSearch} placeholder={searchPlaceholder} />
      </div>
      <Button variant="dark" size="md" onClick={onNewVaccine}>
        New Vaccine Record
      </Button>
    </div>
  );
};

export default VaccinationsControls;
