import { Button } from '@/components/common/button';
import { SearchInput } from '@/components/common/search-input';
import { useState } from 'react';
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
  const [searchValue, setSearchValue] = useState('');
  return (
    <div className={styles.topControls}>
      <div className={styles.searchContainer}>
        <SearchInput
          onSearch={onSearch}
          placeholder={searchPlaceholder}
          value={searchValue}
          onValueChange={setSearchValue}
        />
      </div>
      <Button variant="dark" size="md" onClick={onNewVaccine}>
        New Vaccine Record
      </Button>
    </div>
  );
};

export default VaccinationsControls;
