import SearchBar from '@/components/common/searchbar';
import styles from '../page.module.scss';

interface AppointmentFiltersProps {
  onSearch: (query: string) => void;
}

const AppointmentFilters = ({ onSearch }: AppointmentFiltersProps) => {
  return (
    <div className={styles.filters}>
      <div className={styles.searchContainer}>
        <SearchBar placeholder="Search appointments..." onSearch={onSearch} />
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
