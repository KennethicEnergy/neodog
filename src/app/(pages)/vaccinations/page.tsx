'use client';
import BaseModal from '@/components/common/base-modal';
import Loader from '@/components/common/loader';
import AddVaccine from '@/components/modals/add-vaccine';
import { vaccinationApi } from '@/services/vaccination.api';
import { useModalStore } from '@/store/modal-store';
import { useEffect, useMemo, useState } from 'react';
import { VaccinationsControls, VaccinationsMetrics, VaccinationsTable } from './components';
import styles from './page.module.scss';

type VaccinationApiType = {
  id: number;
  name: string;
  client: {
    id: number;
    first_name: string;
    last_name: string;
    mobile_number: string;
    email: string;
  };
  vaccination_current_count: number;
  vaccination_due_count: number;
  vaccination_overdue_count: number;
  vaccination_missing_count: number;
};

type VaccinationTableRow = {
  ownerAndContact: string[];
  pet: string;
  currentCount: string;
  dueSoonCount: string;
  overdueCount: string;
  missingCount: string;
  actions: object[];
};

function transformVaccinationData(data: VaccinationApiType[]): VaccinationTableRow[] {
  console.log('transformVaccinationData input:', data);
  const result = data.map((pet) => ({
    ownerAndContact: [
      `${pet.client.first_name} ${pet.client.last_name}`,
      pet.client.mobile_number || pet.client.email || ''
    ],
    pet: pet.name,
    currentCount: pet.vaccination_current_count.toString(),
    dueSoonCount: pet.vaccination_due_count.toString(),
    overdueCount: pet.vaccination_overdue_count.toString(),
    missingCount: pet.vaccination_missing_count.toString(),
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
  console.log('transformVaccinationData output:', result);
  return result;
}

const VaccinationsPage = () => {
  const [search, setSearch] = useState('');
  const [vaccinations, setVaccinations] = useState<VaccinationApiType[]>([]);
  const [loading, setLoading] = useState(true);
  const openModal = useModalStore((state) => state.openModal);
  const closeModal = useModalStore((state) => state.closeModal);

  useEffect(() => {
    setLoading(true);
    vaccinationApi
      .getAll()
      .then((vaccRes) => {
        console.log('Raw API response:', vaccRes);
        console.log('Response data:', vaccRes.data);

        // Extract pets data from the new API response structure
        const responseData = vaccRes.data;
        const vaccData = responseData?.result?.pets?.data || [];

        console.log('Extracted vaccData:', vaccData);
        console.log('vaccData length:', vaccData.length);
        setVaccinations(vaccData);
      })
      .catch((error) => {
        console.error('API Error:', error);
        setVaccinations([]);
      })
      .finally(() => setLoading(false));
  }, []);

  console.log('vaccinations', vaccinations);

  const transformedVaccinations = useMemo(() => {
    const result = transformVaccinationData(vaccinations);
    console.log('transformedVaccinations', result);
    return result;
  }, [vaccinations]);

  const filteredData = useMemo(() => {
    if (!search) return transformedVaccinations;
    const q = search.toLowerCase();
    const result = transformedVaccinations.filter(
      (v) =>
        v.ownerAndContact.some((item) => item.toLowerCase().includes(q)) ||
        v.pet.toLowerCase().includes(q)
    );
    console.log('filteredData', result);
    return result;
  }, [search, transformedVaccinations]);

  const calculateMetrics = (vaccinations: VaccinationTableRow[]) => {
    return vaccinations.reduce(
      (acc, v) => {
        acc.current += parseInt(v.currentCount);
        acc.dueSoon += parseInt(v.dueSoonCount);
        acc.overdue += parseInt(v.overdueCount);
        acc.missing += parseInt(v.missingCount);
        return acc;
      },
      { current: 0, dueSoon: 0, overdue: 0, missing: 0 }
    );
  };

  const metrics = useMemo(() => {
    const calculatedMetrics = calculateMetrics(transformedVaccinations);
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
  }, [transformedVaccinations]);

  const handleNewVaccine = () => {
    openModal(
      <BaseModal onClose={closeModal}>
        <AddVaccine />
      </BaseModal>
    );
  };

  console.log('filteredData', filteredData);

  return (
    <div className={styles.vaccinationsPage}>
      <h3>Vaccination Management</h3>
      <VaccinationsMetrics metrics={metrics} />
      <VaccinationsControls onSearch={setSearch} onNewVaccine={handleNewVaccine} />
      <div className={styles.tableWrapper}>
        {loading && (
          <div className={styles.loadingWrapper}>
            <Loader />
            <p>Loading vaccinations...</p>
          </div>
        )}
        {!loading && <VaccinationsTable vaccinations={filteredData} />}
      </div>
    </div>
  );
};

export default VaccinationsPage;
