import Image from 'next/image';
import styles from './styles.module.scss';

const SearchBar = () => {
  return (
    <div className={styles.searchbar}>
      <Image src="/images/search.svg" alt="search" width={24} height={24} />
      <input type="text" placeholder="Search Clients, Pets, Appointments" />
    </div>
  );
};

export default SearchBar;
