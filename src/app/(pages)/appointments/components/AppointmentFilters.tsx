import SearchBar from '@/components/common/searchbar';
import styles from '../page.module.scss';

const AppointmentFilters = () => {
  return (
    <div className={styles.filters}>
      <SearchBar placeholder="Search appointments..." />
      <select className={styles.select}>
        <option>All Services</option>
      </select>
      <select className={styles.select}>
        <option>All Status</option>
      </select>
      <button className={styles.clearButton}>Clear</button>
    </div>
  );
};

export default AppointmentFilters;
