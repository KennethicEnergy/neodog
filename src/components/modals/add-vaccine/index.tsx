import { Button } from '@/components/common/button';
import { DatePicker } from '@/components/common/date-picker';
import { FileInput } from '@/components/common/file-input';
import Loader from '@/components/common/loader';
import { Select } from '@/components/common/select';
import { Textarea } from '@/components/common/textarea';
import { petApi } from '@/services/pet.api';
import { vaccinationApi } from '@/services/vaccination.api';
import { useModalStore } from '@/store/modal-store';
import { useToastStore } from '@/store/toast.store';
import React, { useEffect, useState } from 'react';
import styles from '../add-pet/styles.module.scss';

interface AddVaccineForm {
  client_id: string;
  pet_id: string;
  vaccination_name_id: string;
  file: File | null;
  expiration_date: string;
  notes: string;
  vaccination_status_id: string;
}

interface Client {
  id: number;
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
  facility_id?: number;
}

interface Pet {
  id: number;
  name: string;
  client_id: string;
  client?: {
    first_name: string;
    middle_name?: string;
    last_name: string;
  };
}

interface AddVaccineProps {
  onSuccess?: () => void;
}

const AddVaccine = ({ onSuccess }: AddVaccineProps) => {
  const closeModal = useModalStore((state) => state.closeModal);
  const addToast = useToastStore((state) => state.addToast);
  const [form, setForm] = useState<AddVaccineForm>({
    client_id: '',
    pet_id: '',
    vaccination_name_id: '',
    file: null,
    expiration_date: '',
    notes: '',
    vaccination_status_id: ''
  });
  const [clients, setClients] = useState<Client[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [vaccineTypes, setVaccineTypes] = useState<{ id: number; name: string }[]>([]);
  const [statusRefs, setStatusRefs] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [petsLoading, setPetsLoading] = useState(false);

  useEffect(() => {
    // Fetch initial data
    setInitialLoading(true);
    Promise.all([
      vaccinationApi.getClientReferences(),
      vaccinationApi.getVaccinationNameReferences(),
      vaccinationApi.getVaccinationStatusReferences()
    ])
      .then(([clientsRes, typesRes, statusRes]) => {
        // Extract clients from the paginated response
        const clientsData = clientsRes.data?.result?.clients?.data || [];
        setClients(clientsData);

        // Ensure other data is always arrays
        const typesData = typesRes.data?.result;
        if (Array.isArray(typesData)) {
          setVaccineTypes(typesData);
        } else {
          setVaccineTypes([]);
        }

        const statusData = statusRes.data?.result;
        if (Array.isArray(statusData)) {
          setStatusRefs(statusData);
        } else {
          setStatusRefs([]);
        }
      })
      .catch(() => {
        // Set empty arrays to prevent map errors
        setClients([]);
        setVaccineTypes([]);
        setStatusRefs([]);
        addToast({
          scheme: 'danger',
          title: 'Error',
          message: 'Failed to load form data. Please try again.',
          timeout: 4000
        });
      })
      .finally(() => {
        setInitialLoading(false);
      });
  }, [addToast]);

  // Fetch pets when client is selected
  useEffect(() => {
    if (form.client_id) {
      setPetsLoading(true);
      setPets([]);
      setForm((prev) => ({ ...prev, pet_id: '' })); // Reset pet selection

      // Fetch pets for the selected client
      petApi
        .getAll(1, 100) // Get more pets to ensure we get all for this client
        .then((response) => {
          console.log('Pet API response:', response.data);
          const allPets = response.data?.result?.pets?.data || [];
          console.log('All pets:', allPets);

          // Find the selected client to get their name
          const selectedClient = clients.find((client) => client.id.toString() === form.client_id);
          console.log('Selected client:', selectedClient);

          if (selectedClient) {
            // Filter pets by checking the client relationship
            const clientPets = allPets.filter((pet: Pet) => {
              // Check if pet has a client relationship
              if (pet.client) {
                const petClientName = `${pet.client.first_name} ${pet.client.middle_name ? pet.client.middle_name + ' ' : ''}${pet.client.last_name}`;
                const selectedClientName = `${selectedClient.first_name} ${selectedClient.middle_name ? selectedClient.middle_name + ' ' : ''}${selectedClient.last_name}`;
                return petClientName === selectedClientName;
              }
              // Fallback to client_id comparison if client relationship doesn't exist
              return pet.client_id === form.client_id;
            });

            console.log('Filtered client pets:', clientPets);
            setPets(clientPets);
          } else {
            console.log('Selected client not found');
            setPets([]);
          }
        })
        .catch((error) => {
          console.error('Error fetching pets:', error);
          setPets([]);
          addToast({
            scheme: 'danger',
            title: 'Error',
            message: 'Failed to load pets for selected client.',
            timeout: 4000
          });
        })
        .finally(() => {
          setPetsLoading(false);
        });
    } else {
      setPets([]);
      setForm((prev) => ({ ...prev, pet_id: '' }));
    }
  }, [form.client_id, clients, addToast]);

  const handleInputChange = (field: keyof AddVaccineForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null && value !== '') {
          formData.append(key, value);
        }
      });

      const response = await vaccinationApi.create(formData);

      if (response.data.code === 200) {
        addToast({
          scheme: 'success',
          title: 'Success',
          message: 'Vaccine record added successfully!',
          timeout: 2000
        });
        if (onSuccess) onSuccess();
        setTimeout(() => {
          closeModal();
        }, 1000);
      } else {
        addToast({
          scheme: 'danger',
          title: 'Error',
          message: response.data.message || 'Failed to add vaccine record',
          timeout: 4000
        });
      }
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === 'object' && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message ||
            'Failed to add vaccine record'
          : 'Failed to add vaccine record';
      addToast({
        scheme: 'danger',
        title: 'Error',
        message: errorMessage,
        timeout: 4000
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className={styles.modalContainer}>
        <div className={styles.section}>
          <div className={styles.loadingWrapper}>
            <Loader />
            <p>Loading form data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.modalContainer}>
      <h3 className={styles.header}>New Vaccine Record</h3>
      <form onSubmit={handleSubmit}>
        <div className={styles.section}>
          <div className={styles.formGroup}>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="client_id">
                Client Search
              </label>
              <Select
                id="client_id"
                options={(clients || []).map((client) => ({
                  value: client.id.toString(),
                  label: `${client.first_name} ${client.middle_name ? client.middle_name + ' ' : ''}${client.last_name}`
                }))}
                placeholder="Search existing clients..."
                value={form.client_id}
                onValueChange={(value) => handleInputChange('client_id', value)}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="pet_id">
                Pet
              </label>
              <Select
                id="pet_id"
                options={(pets || []).map((pet) => ({
                  value: pet.id.toString(),
                  label: pet.name
                }))}
                placeholder={petsLoading ? 'Loading pets...' : 'Select a pet'}
                value={form.pet_id}
                onValueChange={(value) => handleInputChange('pet_id', value)}
                required
                disabled={!form.client_id || petsLoading}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="vaccination_name_id">
                Vaccine Name
              </label>
              <Select
                id="vaccination_name_id"
                options={(vaccineTypes || []).map((vaccine) => ({
                  value: vaccine.id.toString(),
                  label: vaccine.name
                }))}
                placeholder="Select vaccine name"
                value={form.vaccination_name_id}
                onValueChange={(value) => handleInputChange('vaccination_name_id', value)}
                required
              />
            </div>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="expiration_date">
                Expiry Date
              </label>
              <DatePicker
                value={form.expiration_date}
                onChange={(e) => handleInputChange('expiration_date', e.target.value)}
                placeholder="MM/DD/YYYY"
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="certificate">
                Upload Vaccine Certificate
              </label>
              <FileInput
                id="certificate"
                accept="application/pdf,image/*"
                onChange={handleFileChange}
                helperText="Select your file or drag and drop"
                maxSize={2 * 1024 * 1024}
                showFileList={true}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="notes">
                Notes
              </label>
              <Textarea
                id="notes"
                value={form.notes}
                onValueChange={(value) => handleInputChange('notes', value)}
                placeholder="Enter notes (optional)"
                rows={3}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="vaccination_status_id">
                Vaccination Status
              </label>
              <Select
                id="vaccination_status_id"
                options={(statusRefs || []).map((status) => ({
                  value: status.id.toString(),
                  label: status.name
                }))}
                placeholder="Select status"
                value={form.vaccination_status_id}
                onValueChange={(value) => handleInputChange('vaccination_status_id', value)}
                required
              />
            </div>
          </div>

          <div className={styles.buttonContainer}>
            <Button
              type="button"
              variant="secondary"
              onClick={closeModal}
              disabled={loading || initialLoading}
              style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              isLoading={loading || initialLoading}
              disabled={loading || initialLoading}>
              {loading || initialLoading ? 'Saving Vaccine Record...' : 'Save Vaccine Record'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddVaccine;
