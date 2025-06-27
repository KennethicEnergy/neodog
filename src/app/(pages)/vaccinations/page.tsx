'use client';
import { useMemo, useState } from 'react';
import { VaccinationsControls, VaccinationsMetrics, VaccinationsTable } from './components';
import styles from './page.module.scss';

// Mock data transformation to match the screenshot
const MOCK_VACCINATIONS = [
  {
    ownerAndContact: ['Sarah Johnson', '555 123-4567'],
    pet: 'Bella',
    currentCount: '5',
    dueSoonCount: '1',
    overdueCount: '0',
    missingCount: '2',
    actions: [
      { icon: '/images/actions/view.svg', onClick: () => {} },
      { icon: '/images/actions/edit.svg', onClick: () => {} },
      { icon: '/images/actions/trash.svg', onClick: () => {} }
    ]
  },
  {
    ownerAndContact: ['Ella Dawson', '889 982 6331'],
    pet: 'Champ',
    currentCount: '3',
    dueSoonCount: '0',
    overdueCount: '2',
    missingCount: '0',
    actions: [
      { icon: '/images/actions/view.svg', onClick: () => {} },
      { icon: '/images/actions/edit.svg', onClick: () => {} },
      { icon: '/images/actions/trash.svg', onClick: () => {} }
    ]
  },
  {
    ownerAndContact: ['James Smith', '663 858 2328'],
    pet: 'Max',
    currentCount: '4',
    dueSoonCount: '2',
    overdueCount: '0',
    missingCount: '3',
    actions: [
      { icon: '/images/actions/view.svg', onClick: () => {} },
      { icon: '/images/actions/edit.svg', onClick: () => {} },
      { icon: '/images/actions/trash.svg', onClick: () => {} }
    ]
  },
  {
    ownerAndContact: ['Ashley Martinez', '542 796 3885'],
    pet: 'Lola',
    currentCount: '6',
    dueSoonCount: '0',
    overdueCount: '1',
    missingCount: '0',
    actions: [
      { icon: '/images/actions/view.svg', onClick: () => {} },
      { icon: '/images/actions/edit.svg', onClick: () => {} },
      { icon: '/images/actions/trash.svg', onClick: () => {} }
    ]
  },
  {
    ownerAndContact: ['Emily Davis', '841 582 0376'],
    pet: 'Daisy',
    currentCount: '4',
    dueSoonCount: '0',
    overdueCount: '1',
    missingCount: '0',
    actions: [
      { icon: '/images/eye.svg', onClick: () => {} },
      { icon: '/images/edit.svg', onClick: () => {} },
      { icon: '/images/delete.svg', onClick: () => {} }
    ]
  },
  {
    ownerAndContact: ['Michael Brown', '270 188 6337'],
    pet: 'Rocky',
    currentCount: '5',
    dueSoonCount: '1',
    overdueCount: '3',
    missingCount: '1',
    actions: [
      { icon: '/images/actions/view.svg', onClick: () => {} },
      { icon: '/images/actions/edit.svg', onClick: () => {} },
      { icon: '/images/actions/trash.svg', onClick: () => {} }
    ]
  }
];

// Function to calculate metrics from vaccinations data
const calculateMetrics = (vaccinations: typeof MOCK_VACCINATIONS) => {
  return vaccinations.reduce((acc: { current: number; dueSoon: number; overdue: number; missing: number }, vaccination) => {
    acc.current += parseInt(vaccination.currentCount);
    acc.dueSoon += parseInt(vaccination.dueSoonCount);
    acc.overdue += parseInt(vaccination.overdueCount);
    acc.missing += parseInt(vaccination.missingCount);
    return acc;
  }, { current: 0, dueSoon: 0, overdue: 0, missing: 0 });
};

// Transform MOCK_VACCINATIONS to match the style of transformedPets
const transformedVaccinations = MOCK_VACCINATIONS.map((v) => ({
  ownerAndContact: v.ownerAndContact,
  pet: v.pet,
  currentCount: v.currentCount,
  dueSoonCount: v.dueSoonCount,
  overdueCount: v.overdueCount,
  missingCount: v.missingCount,
  actions: [
    {
      name: 'View',
      type: 'view',
      icon: '/images/actions/view.svg',
      onClick: () => {}
    },
    {
      name: 'Edit',
      type: 'edit',
      icon: '/images/actions/edit.svg',
      onClick: () => {}
    },
    {
      name: 'Delete',
      type: 'delete',
      icon: '/images/actions/trash.svg',
      onClick: () => {}
    }
  ]
}));

const VaccinationsPage = () => {
  const [search, setSearch] = useState('');

  // Calculate metrics dynamically using useMemo
  const metrics = useMemo(() => {
    const calculatedMetrics = calculateMetrics(MOCK_VACCINATIONS);
    return [
      {
        label: 'Current',
        value: calculatedMetrics.current,
        icon: '/images/vaccinations/current.svg',
        color: 'gray400'
      },
      {
        label: 'Due Soon',
        value: calculatedMetrics.dueSoon,
        icon: '/images/vaccinations/due-soon.svg',
        color: 'gray400'
      },
      {
        label: 'Overdue',
        value: calculatedMetrics.overdue,
        icon: '/images/vaccinations/overdue.svg',
        color: 'gray400'
      },
      {
        label: 'Missing',
        value: calculatedMetrics.missing,
        icon: '/images/vaccinations/missing.svg',
        color: 'gray400'
      }
    ];
  }, [MOCK_VACCINATIONS]);

  const filteredData = useMemo(() => {
    if (!search) return transformedVaccinations;
    const q = search.toLowerCase();
    return transformedVaccinations.filter(
      (v) =>
        v.ownerAndContact.some((item) => item.toLowerCase().includes(q)) ||
        v.pet.toLowerCase().includes(q)
    );
  }, [search]);

  const handleNewVaccine = () => {
    // TODO: Implement new vaccine functionality
    console.log('New vaccine record clicked');
  };

  return (
    <div className={styles.vaccinationsPage}>
      <h3>Vaccination Management</h3>
      <VaccinationsMetrics metrics={metrics} />
      <VaccinationsControls onSearch={setSearch} onNewVaccine={handleNewVaccine} />
      <div className={styles.tableWrapper}>
        <VaccinationsTable vaccinations={filteredData} />
      </div>
    </div>
  );
};

export default VaccinationsPage;
