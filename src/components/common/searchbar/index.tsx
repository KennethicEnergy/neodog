import React from 'react';
import styles from './styles.module.scss';
import DummyIcon from '../dummy-icon';

const SearchBar = () => {
  return (
    <div className={styles.searchbar}>
      <DummyIcon />
      <input type="text" placeholder="Search Clients, Pets, Appointments" />
    </div>
  );
};

export default SearchBar;
