import { SearchInput } from '@/components/common/search-input';
import { useState } from 'react';
import styles from '../page.module.scss';

interface AppointmentFiltersProps {
  onSearch: (query: string) => void;
}

const AppointmentFilters = ({ onSearch }: AppointmentFiltersProps) => {
  const [searchValue, setSearchValue] = useState('');
  return (
    <div className={styles.filters}>
      <div className={styles.searchContainer}>
        <SearchInput
          placeholder="Search appointments..."
          onSearch={onSearch}
          value={searchValue}
          onValueChange={setSearchValue}
        />
      </div>
      <div className={styles.filtersRight}>
        <select className={styles.select}>
          <option>All Services</option>
        </select>
        <select className={styles.select}>
          <option>All Status</option>
        </select>
        <button className={styles.clearButton}>Clear</button>
      </div>
    </div>
  );
};

export default AppointmentFilters;
