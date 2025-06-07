'use client';
import Icon from '@/components/common/icon';
import StatusTag from '@/components/common/status-tag';
import Table from '@/components/common/table';
import { useState } from 'react';
import styles from './page.module.scss';

// Mock data for pets
const petsData = [
  {
    id: 1,
    name: 'Bella',
    breed: 'Golden Retriever',
    age: '3 years',
    owner: 'Sarah Johnson',
    lastVisit: 'March 1, 2025',
    status: 'HEALTHY',
    image: '/images/pets/bella.jpg' // Placeholder for image
  },
  {
    id: 2,
    name: 'Max',
    breed: 'German Shepherd',
    age: '2 years',
    owner: 'James Smith',
    lastVisit: 'April 10, 2025',
    status: 'MEDICAL ISSUE',
    image: '/images/pets/max.jpg'
  },
  {
    id: 3,
    name: 'Lola',
    breed: 'French Bulldog',
    age: '1 year',
    owner: 'Emily Davis',
    lastVisit: 'February 23, 2025',
    status: 'FOLLOW-UP REQUIRED',
    image: '/images/pets/lola.jpg'
  },
  {
    id: 4,
    name: 'Luna',
    breed: 'Terrier',
    age: '4 years',
    owner: 'Sarah Johnson',
    lastVisit: 'May 15, 2025',
    status: 'HEALTHY',
    image: '/images/pets/luna.jpg'
  },
  {
    id: 5,
    name: 'Molly',
    breed: 'French Bulldog',
    age: '2 years',
    owner: 'Sarah Johnson',
    lastVisit: 'June 1, 2025',
    status: 'HEALTHY',
    image: '/images/pets/molly.jpg'
  },
  {
    id: 6,
    name: 'Chuckie',
    breed: 'Labrador',
    age: '5 years',
    owner: 'Mike Wilson',
    lastVisit: 'March 20, 2025',
    status: 'MEDICAL ISSUE',
    image: '/images/pets/Chuckie.jpg'
  }
];

// Headers for clients table
const CLIENT_HEADERS = [
  { key: 'name', label: 'NAME' },
  { key: 'contact', label: 'CONTACT / EMAIL' },
  { key: 'pets', label: 'PETS' },
  { key: 'lastVisit', label: 'LAST VISIT' },
  { key: 'status', label: 'STATUS' },
  { key: 'actions', label: 'ACTIONS' }
];

// Mock data for clients table
const clientsTableData = [
  {
    name: 'Emily Davis',
    contact: ['emilydavis@gmail.com', '(555) 123-4567'],
    pets: '2 Pets',
    lastVisit: '1 day ago',
    status: 'ACTIVE',
    actions: 'View | Edit'
  },
  {
    name: 'Emily Davis',
    contact: ['emilydavis@gmail.com', '(555) 123-4567'],
    pets: '3 Pets',
    lastVisit: '2 days ago',
    status: 'ACTIVE',
    actions: 'View | Edit'
  },
  {
    name: 'Emily Davis',
    contact: ['emilydavis@gmail.com', '(555) 123-4567'],
    pets: '1 Pets',
    lastVisit: '5 weeks ago',
    status: 'ACTIVE',
    actions: 'View | Edit'
  },
  {
    name: 'Emily Davis',
    contact: ['emilydavis@gmail.com', '(555) 123-4567'],
    pets: '5 Pets',
    lastVisit: '3 days ago',
    status: 'ACTIVE',
    actions: 'View | Edit'
  },
  {
    name: 'Emily Davis',
    contact: ['emilydavis@gmail.com', '(555) 123-4567'],
    pets: '2 Pets',
    lastVisit: '6 months ago',
    status: 'INACTIVE',
    actions: 'View | Edit'
  },
  {
    name: 'Emily Davis',
    contact: ['emilydavis@gmail.com', '(555) 123-4567'],
    pets: '2 Pets',
    lastVisit: '6 months ago',
    status: 'INACTIVE',
    actions: 'View | Edit'
  },
  {
    name: 'Emily Davis',
    contact: ['emilydavis@gmail.com', '(555) 123-4567'],
    pets: '2 Pets',
    lastVisit: '6 months ago',
    status: 'INACTIVE',
    actions: 'View | Edit'
  }
];

const PetsAndClientPage = () => {
  const [activeTab, setActiveTab] = useState<'pets' | 'clients'>('pets');
  const [showFilter, setShowFilter] = useState(false);

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'HEALTHY':
        return 'success';
      case 'MEDICAL ISSUE':
        return 'danger';
      case 'FOLLOW-UP REQUIRED':
        return 'warning';
      case 'ONBOARDING':
        return 'primary';
      default:
        return 'info'; // fallback
    }
  };

  const renderPet = (pet: (typeof petsData)[0]) => {
    return (
      <div key={pet.id} className={styles.petCard}>
        <div className={styles.imageContainer}>
          {/* Space for pet image */}
          <div className={styles.imagePlaceholder}>
            {/* You can add an img tag here: */}
            {/* <img src={pet.image} alt={pet.name} /> */}
          </div>
        </div>
        <div className={styles.petInfo}>
          <div className={styles.row}>
            <div className={styles.name}>{pet.name}</div>
            <StatusTag status={pet.status} bgColor={getStatusClass(pet.status)}/>
          </div>
          <div className={styles.row}>
            <div className={styles.breed}>{pet.breed}</div>
            <div className={styles.age}>{pet.age}</div>
          </div>
          <div className={styles.row}>
            <div className={styles.owner}>Owner: {pet.owner}</div>
          </div>
          <div className={styles.row}>
            <div className={styles.lastVisit}>Last visit: {pet.lastVisit}</div>
          </div>
        </div>
        <div className={styles.controls}>
          <button className={styles.profile}>Profile</button>
          <button className={styles.schedule}>Schedule</button>
        </div>
      </div>
    );
  };

  const renderTabs = () => {
    return (
      <>
        <div
          className={`${styles.tab} ${activeTab === 'pets' ? styles.active : ''}`}
          onClick={() => setActiveTab('pets')}>
          <Icon
            src={`/images/pets-and-clients/dog-${activeTab === 'pets' ? 'light' : 'dark'}.svg`}
            width={18}
            height={18}
          />
          Pets
        </div>
        <div
          className={`${styles.tab} ${activeTab === 'clients' ? styles.active : ''}`}
          onClick={() => setActiveTab('clients')}>
          <Icon
            src={`/images/pets-and-clients/client-${activeTab === 'clients' ? 'light' : 'dark'}.svg`}
            width={18}
            height={18}
          />
          Clients
        </div>
      </>
    );
  };

  const renderFilters = () => {
    return (
      <>
        <button className={styles.filterButton} onClick={() => setShowFilter(!showFilter)}>
          <Icon src={`/images/pets-and-clients/filter.svg`} width={18} height={18} />
          Filter
          <Icon src={`/images/pets-and-clients/filter-dropdown.svg`} width={18} height={18} />
        </button>
        <button className={styles.addButton}>
          {activeTab === 'pets' ? 'Add Pet' : 'Add Client'}
        </button>
      </>
    );
  };

  const renderClientsTable = () => {
    return (
      <Table
        // title="Clients"
        // icon="/images/clients-icon.svg" // Space for your clients icon
        data={clientsTableData}
        headers={CLIENT_HEADERS}
        maxHeight="800px"
        enableSorting={true}
        viewAll={false}
        tableOnly={true}
      />
    );
  };

  return (
    <div className={styles.petsAndClient}>
      <h3>Pets & Clients</h3>
      <div className={styles.topControls}>
        <div className={styles.tabContainer}>{renderTabs()}</div>
        <div className={styles.filterContainer}>{renderFilters()}</div>
      </div>

      <div className={styles.content}>
        {activeTab === 'pets' ? (
          <div className={styles.petsGrid}>{petsData.map((pet) => renderPet(pet))}</div>
        ) : (
          renderClientsTable()
        )}
      </div>
    </div>
  );
};

export default PetsAndClientPage;
