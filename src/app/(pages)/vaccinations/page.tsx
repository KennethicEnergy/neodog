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
  client_id: number;
  pet_id: number;
  vaccination_name_id: number;
  expiration_date: string;
  notes: string | null;
  vaccination_status_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  client: {
    id: number;
    facility_id: number;
    photo_path: string | null;
    first_name: string;
    middle_name: string | null;
    last_name: string;
    mobile_number: string;
    address: string;
    city: string;
    state: string;
    zipcode: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  };
  pet: {
    id: number;
    client_id: number;
    photo_path: string | null;
    name: string;
    pet_breed_id: number;
    date_of_birth: string;
    age: string;
    pet_sex_id: number;
    color_or_markings: string;
    weight: string;
    height: string;
    microchip_number: string | null;
    enrollment_date: string;
    spayed_or_neutered: number;
    emergency_contact_name: string;
    e_c_phone_number: string;
    veterinarian_name: string;
    v_phone_number: string;
    handling_instruction: string;
    behavioral_notes: string | null;
    care_preferences: string | null;
    feeding_instructions: string | null;
    walking_preferences: string | null;
    favorite_toys: string | null;
    allergies: string | null;
    current_medications: string | null;
    medical_conditions: string | null;
    admin_and_logistics: string | null;
    last_visit: string;
    pet_status_id: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  };
  vaccination_name: {
    id: number;
    code: string;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
  };
  vaccination_status: {
    id: number;
    code: string;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
  };
};

type VaccinationTableRow = {
  id: number;
  clientName: string[];
  petName: string;
  vaccine: string;
  expiryDate: string;
  dateCreated: string;
  status: string;
  statusCode: string;
  actions: object[];
};

function transformVaccinationData(
  data: VaccinationApiType[],
  openModal: (modal: React.ReactNode) => void,
  closeModal: () => void,
  onDeleteVaccination: (vaccinationId: number, petName: string) => void
): VaccinationTableRow[] {
  console.log('transformVaccinationData input:', data);
  const result = data.map((vaccination) => ({
    id: vaccination.id,
    clientName: [
      vaccination.client
        ? `${vaccination.client.first_name} ${vaccination.client.last_name}`
        : 'Unknown Client',
      vaccination.client ? vaccination.client.mobile_number || vaccination.client.email || '' : ''
    ],
    petName: vaccination.pet?.name || 'Unknown Pet',
    vaccine: vaccination.vaccination_name?.name || 'Unknown Vaccine',
    expiryDate: vaccination.expiration_date
      ? new Date(vaccination.expiration_date).toLocaleDateString('en-US')
      : 'N/A',
    dateCreated: vaccination.created_at
      ? new Date(vaccination.created_at).toLocaleDateString('en-US')
      : 'N/A',
    status: vaccination.vaccination_status?.name || 'Unknown Status',
    statusCode: vaccination.vaccination_status?.code || 'unknown',
    actions: [
      {
        name: 'View',
        type: 'view',
        icon: '/images/actions/view.svg',
        onClick: () => {
          openModal(
            <BaseModal onClose={closeModal}>
              <ViewVaccinationsModal petId={vaccination.pet_id} onClose={closeModal} />
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
          onDeleteVaccination(vaccination.id, vaccination.pet?.name || 'Unknown Pet');
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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const openModal = useModalStore((state) => state.openModal);
  const closeModal = useModalStore((state) => state.closeModal);
  const addToast = useToastStore((state) => state.addToast);

  const fetchVaccinations = async (page: number = 1) => {
    setLoading(true);
    try {
      const vaccRes = await vaccinationApi.getAll(undefined, page, 10);
      const responseData = vaccRes.data;
      const vaccData = responseData?.result?.vaccinations?.data || [];
      const paginationData = responseData?.result?.vaccinations || {};
      setVaccinations(vaccData);
      setTotalCount(paginationData.total || 0);
      setCurrentPage(page); // Set to the actual page we fetched
    } catch (error) {
      console.error('API Error:', error);
      setVaccinations([]);
      setTotalCount(0);
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
    fetchVaccinations(1);
  }, []);

  const handlePageChange = (page: number) => {
    fetchVaccinations(page);
  };

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
                    await fetchVaccinations(currentPage);
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
    return transformVaccinationData(vaccinations, openModal, closeModal, handleDeleteVaccination);
  }, [vaccinations, openModal, closeModal]);

  // For now, we'll use client-side filtering since the API might not support search
  // In a real implementation, you'd want to pass the search query to the API
  const filteredData = useMemo(() => {
    if (!search) return transformedVaccinations;
    const q = search.toLowerCase();
    const result = transformedVaccinations.filter(
      (v) =>
        v.clientName?.some((item) => item.toLowerCase().includes(q)) ||
        v.petName?.toLowerCase().includes(q) ||
        v.vaccine?.toLowerCase().includes(q)
    );
    return result;
  }, [search, transformedVaccinations]);

  const calculateMetrics = (vaccinations: VaccinationTableRow[]) => {
    return vaccinations.reduce(
      (acc, v) => {
        if (v.statusCode === 'current') acc.current++;
        else if (v.statusCode === 'due_soon') acc.dueSoon++;
        else if (v.statusCode === 'overdue') acc.overdue++;
        else if (v.statusCode === 'missing') acc.missing++;
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
        <AddVaccine onSuccess={() => fetchVaccinations(currentPage)} />
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
        {!loading && (
          <VaccinationsTable
            vaccinations={filteredData}
            totalCount={totalCount}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            hidePagination={!!search}
          />
        )}
      </div>
    </div>
  );
};

export default VaccinationsPage;
