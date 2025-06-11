import Image from 'next/image';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import styles from './styles.module.scss';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  debounceTime?: number;
  value?: string;
}

const SearchBar = ({
  onSearch,
  placeholder = 'Search Clients, Pets, Appointments',
  debounceTime = 300,
  value
}: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState(value || '');

  useEffect(() => {
    if (value !== undefined) {
      setSearchQuery(value);
    }
  }, [value]);

  const debouncedSearch = useCallback(
    (query: string) => {
      const timeoutId = setTimeout(() => {
        onSearch?.(query);
      }, debounceTime);

      return () => clearTimeout(timeoutId);
    },
    [onSearch, debounceTime]
  );

  useEffect(() => {
    const cleanup = debouncedSearch(searchQuery);
    return cleanup;
  }, [searchQuery, debouncedSearch]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className={styles.searchbar}>
      <Image src="/images/search.svg" alt="search" width={24} height={24} />
      <input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={handleSearchChange}
      />
    </div>
  );
};

export default SearchBar;
