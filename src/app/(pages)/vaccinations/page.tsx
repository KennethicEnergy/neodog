'use client';
import BaseModal from '@/components/common/base-modal';
import Loader from '@/components/common/loader';
import AddVaccine from '@/components/modals/add-vaccine';
import ViewVaccinationsModal from '@/components/modals/view-vaccinations';
import { vaccinationApi } from '@/services/vaccination.api';
import { useModalStore } from '@/store/modal-store';
import { useToastStore } from '@/store/toast.store';
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
  vaccination_due_soon_count: number;
  vaccination_overdue_count: number;
  vaccination_missing_count: number;
  vaccinations: Array<{
    id: number;
    client_id: number;
    pet_id: number;
    vaccination_name_id: number;
    file_path: string | null;
    expiration_date: string;
    notes: string;
    vaccination_status_id: number;
    created_at: string;
    updated_at: string;
  }>;
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

function transformVaccinationData(
  data: VaccinationApiType[],
  openModal: (modal: React.ReactNode) => void,
  closeModal: () => void,
  onDeleteVaccination: (vaccinationId: number, petName: string) => void,
  addToast: (toast: {
    scheme: 'warning' | 'success' | 'danger';
    title: string;
    message: string;
    timeout?: number;
  }) => void
): VaccinationTableRow[] {
  console.log('transformVaccinationData input:', data);
  const result = data.map((pet) => ({
    ownerAndContact: [
      `${pet.client.first_name} ${pet.client.last_name}`,
      pet.client.mobile_number || pet.client.email || ''
    ],
    pet: pet.name,
    currentCount: pet.vaccination_current_count.toString(),
    dueSoonCount: pet.vaccination_due_soon_count.toString(),
    overdueCount: pet.vaccination_overdue_count.toString(),
    missingCount: pet.vaccination_missing_count.toString(),
    actions: [
      {
        name: 'View',
        type: 'view',
        icon: '/images/actions/view.svg',
        onClick: () => {
          openModal(
            <BaseModal onClose={closeModal}>
              <ViewVaccinationsModal petId={pet.id} onClose={closeModal} />
            </BaseModal>
          );
        }
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
        onClick: () => {
          // If pet has vaccinations, delete the first one (or show a list to choose from)
          if (pet.vaccinations && pet.vaccinations.length > 0) {
            const vaccination = pet.vaccinations[0]; // For now, delete the first vaccination
            onDeleteVaccination(vaccination.id, pet.name);
          } else {
            // No vaccinations to delete
            addToast({
              scheme: 'warning',
              title: 'No Vaccinations',
              message: `No vaccination records found for ${pet.name}.`,
              timeout: 3000
            });
          }
        }
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
  const addToast = useToastStore((state) => state.addToast);

  const fetchVaccinations = async () => {
    setLoading(true);
    try {
      const vaccRes = await vaccinationApi.getAll();
      console.log('Raw API response:', vaccRes);
      console.log('Response data:', vaccRes.data);

      // Extract pets data from the new API response structure
      const responseData = vaccRes.data;
      const vaccData = responseData?.result?.pets?.data || [];

      console.log('Extracted vaccData:', vaccData);
      console.log('vaccData length:', vaccData.length);
      setVaccinations(vaccData);
    } catch (error) {
      console.error('API Error:', error);
      setVaccinations([]);
      addToast({
        scheme: 'danger',
        title: 'Error',
        message: 'Failed to load vaccination data.',
        timeout: 4000
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVaccinations();
  }, []);

  const handleDeleteVaccination = (vaccinationId: number, petName: string) => {
    openModal(
      <BaseModal onClose={closeModal}>
        <div className={styles.deleteModal}>
          <h3>Delete Vaccination Record</h3>
          <p>
            Are you sure you want to delete the vaccination record for <strong>{petName}</strong>?
          </p>
          {/* <p>This action cannot be undone.</p> */}
          <div className={styles.buttonGroup}>
            <button className={styles.cancelButton} onClick={closeModal}>
              Cancel
            </button>
            <button
              className={styles.deleteButton}
              onClick={async () => {
                try {
                  const response = await vaccinationApi.deleteById(vaccinationId);
                  if (response.data.code === 200) {
                    closeModal();
                    addToast({
                      scheme: 'success',
                      title: 'Success',
                      message: `Vaccination record for ${petName} has been deleted successfully.`,
                      timeout: 3000
                    });
                    // Refresh the vaccinations list
                    await fetchVaccinations();
                  } else {
                    addToast({
                      scheme: 'danger',
                      title: 'Delete Failed',
                      message: response.data.message || 'Failed to delete vaccination record.',
                      timeout: 4000
                    });
                  }
                } catch (error) {
                  console.error('Delete error:', error);
                  addToast({
                    scheme: 'danger',
                    title: 'Delete Error',
                    message: 'An error occurred while deleting vaccination record.',
                    timeout: 4000
                  });
                }
              }}>
              Delete
            </button>
          </div>
        </div>
      </BaseModal>
    );
  };

  const transformedVaccinations = useMemo(() => {
    return transformVaccinationData(
      vaccinations,
      openModal,
      closeModal,
      handleDeleteVaccination,
      addToast
    );
  }, [vaccinations, openModal, closeModal, addToast]);

  const filteredData = useMemo(() => {
    if (!search) return transformedVaccinations;
    const q = search.toLowerCase();
    const result = transformedVaccinations.filter(
      (v) =>
        v.ownerAndContact.some((item) => item.toLowerCase().includes(q)) ||
        v.pet.toLowerCase().includes(q)
    );
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
        <AddVaccine onSuccess={fetchVaccinations} />
      </BaseModal>
    );
  };

  return (
    <div className={styles.vaccinationsPage}>
      <h3>Vaccination Management</h3>
      <VaccinationsMetrics metrics={metrics} loading={loading} />
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
