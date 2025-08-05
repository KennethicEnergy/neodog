import { Button } from '@/components/common/button';
import { DatePicker } from '@/components/common/date-picker';
import { FileInput } from '@/components/common/file-input';
import Loader from '@/components/common/loader';
import { Select } from '@/components/common/select';
import { petApi } from '@/services/pet.api';
import { vaccinationApi } from '@/services/vaccination.api';
import { useModalStore } from '@/store/modal-store';
import { useToastStore } from '@/store/toast.store';
import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';

interface VaccineFormEntry {
  id: string;
  vaccination_name_id: string;
  expiration_date: string;
  files: File[];
}

interface AddVaccineForm {
  client_id: string;
  pet_id: string;
  vaccinations: VaccineFormEntry[];
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
  const vaccinationsContainerRef = React.useRef<HTMLDivElement>(null);
  const [form, setForm] = useState<AddVaccineForm>({
    client_id: '',
    pet_id: '',
    vaccinations: [
      {
        id: '1',
        vaccination_name_id: '',
        expiration_date: '',
        files: []
      }
    ]
  });
  const [clients, setClients] = useState<Client[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [vaccineTypes, setVaccineTypes] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [petsLoading, setPetsLoading] = useState(false);

  const MAX_VACCINES = 5;

  useEffect(() => {
    // Fetch initial data
    setInitialLoading(true);
    Promise.all([
      vaccinationApi.getClientReferences(),
      vaccinationApi.getVaccinationNameReferences()
    ])
      .then(([clientsRes, typesRes]) => {
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
      })
      .catch(() => {
        // Set empty arrays to prevent map errors
        setClients([]);
        setVaccineTypes([]);
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
          const allPets = response.data?.result?.pets?.data || [];
          // Find the selected client to get their name
          const selectedClient = clients.find((client) => client.id.toString() === form.client_id);

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

            setPets(clientPets);
          } else {
            setPets([]);
          }
        })
        .catch(() => {
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

  const handleVaccinationChange = (
    index: number,
    field: keyof VaccineFormEntry,
    value: string | File[]
  ) => {
    setForm((prev) => ({
      ...prev,
      vaccinations: prev.vaccinations.map((vaccination, i) =>
        i === index ? { ...vaccination, [field]: value } : vaccination
      )
    }));
  };

  const addVaccination = () => {
    if (form.vaccinations.length < MAX_VACCINES) {
      setForm((prev) => ({
        ...prev,
        vaccinations: [
          ...prev.vaccinations,
          {
            id: (prev.vaccinations.length + 1).toString(),
            vaccination_name_id: '',
            expiration_date: '',
            files: []
          }
        ]
      }));

      // Scroll to the bottom of the container after adding new vaccination
      setTimeout(() => {
        if (vaccinationsContainerRef.current) {
          vaccinationsContainerRef.current.scrollTo({
            top: vaccinationsContainerRef.current.scrollHeight,
            behavior: 'smooth'
          });
        }
      }, 100); // Small delay to ensure DOM is updated
    }
  };

  const removeVaccination = (index: number) => {
    if (form.vaccinations.length > 1) {
      setForm((prev) => ({
        ...prev,
        vaccinations: prev.vaccinations.filter((_, i) => i !== index)
      }));
    }
  };

  const handleFileChange = (index: number, files: File[]) => {
    handleVaccinationChange(index, 'files', files);
  };

  const validateForm = (): boolean => {
    // Check if client and pet are selected
    if (!form.client_id || !form.pet_id) {
      addToast({
        scheme: 'danger',
        title: 'Validation Error',
        message: 'Please select a client and pet.',
        timeout: 4000
      });
      return false;
    }

    // Check if at least one vaccination has required fields
    const hasValidVaccination = form.vaccinations.some(
      (vaccination) => vaccination.vaccination_name_id && vaccination.expiration_date
    );

    if (!hasValidVaccination) {
      addToast({
        scheme: 'danger',
        title: 'Validation Error',
        message: 'Please fill in at least one vaccine name and expiry date.',
        timeout: 4000
      });
      return false;
    }

    // Check that all vaccinations with vaccine name also have expiry date and vice versa
    const hasIncompleteVaccination = form.vaccinations.some(
      (vaccination) =>
        (vaccination.vaccination_name_id && !vaccination.expiration_date) ||
        (!vaccination.vaccination_name_id && vaccination.expiration_date)
    );

    if (hasIncompleteVaccination) {
      addToast({
        scheme: 'danger',
        title: 'Validation Error',
        message:
          'Please complete all vaccine details (both vaccine name and expiry date are required).',
        timeout: 4000
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      // Add client_id as required by the API
      formData.append('client_id', form.client_id);

      // Add vaccinations array in the correct format
      form.vaccinations
        .filter((vaccination) => vaccination.vaccination_name_id && vaccination.expiration_date)
        .forEach((vaccination, index) => {
          formData.append(`vaccinations[${index}][pet_id]`, form.pet_id);
          formData.append(
            `vaccinations[${index}][vaccination_name_id]`,
            vaccination.vaccination_name_id
          );
          formData.append(`vaccinations[${index}][expiration_date]`, vaccination.expiration_date);
          formData.append(`vaccinations[${index}][vaccination_status_id]`, '1');
          formData.append(`vaccinations[${index}][notes]`, '');

          // Add files if any
          vaccination.files.forEach((file, fileIndex) => {
            formData.append(`vaccinations[${index}][files][${fileIndex}]`, file);
          });
        });

      // Log the form state before submission
      console.log('=== FORM SUBMISSION DEBUG ===');
      console.log('Form state:', form);
      console.log('Client ID:', form.client_id);
      console.log('Pet ID:', form.pet_id);
      console.log('Vaccinations count:', form.vaccinations.length);

      // Log each vaccination entry
      form.vaccinations.forEach((vaccination, index) => {
        console.log(`Vaccination ${index}:`, {
          id: vaccination.id,
          vaccination_name_id: vaccination.vaccination_name_id,
          expiration_date: vaccination.expiration_date,
          files_count: vaccination.files.length,
          files: vaccination.files.map((f) => ({ name: f.name, size: f.size, type: f.type }))
        });
      });

      console.log('FormData contents:');
      formData.forEach((value, key) => {
        console.log(`${key}:`, value);
      });

      // Send as FormData
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
          {/* Client and Pet Selection */}
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

          {/* Scrollable Vaccinations Container */}
          <div className={styles.vaccinationsContainer} ref={vaccinationsContainerRef}>
            {form.vaccinations.map((vaccination, index) => (
              <div key={vaccination.id} className={styles.vaccinationSection}>
                {/* Section Header */}
                <div className={styles.sectionHeader}>
                  <p className={styles.sectionTitle}>
                    {form.vaccinations.length === 1
                      ? 'Vaccine Certificate'
                      : `Vaccine Certificate ${index + 1}`}
                  </p>
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => removeVaccination(index)}
                      disabled={loading}>
                      ×
                    </Button>
                  )}
                </div>

                {/* File Upload */}
                <div className={styles.formGroup}>
                  <div className={styles.col}>
                    <FileInput
                      id={`certificate-${index}`}
                      accept="application/pdf,image/*,.docx"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        handleFileChange(index, files);
                      }}
                      helperText="Select your file or drag and drop"
                      maxSize={2 * 1024 * 1024}
                      showFileList={true}
                      multiple={true}
                    />
                  </div>
                </div>

                {/* Vaccine Details */}
                <div className={styles.formGroup}>
                  <div className={styles.col}>
                    <label className={styles.label} htmlFor={`vaccination_name_id-${index}`}>
                      Vaccine Name
                    </label>
                    <Select
                      id={`vaccination_name_id-${index}`}
                      options={(vaccineTypes || []).map((vaccine) => ({
                        value: vaccine.id.toString(),
                        label: vaccine.name
                      }))}
                      placeholder="Select vaccine name"
                      value={vaccination.vaccination_name_id}
                      onValueChange={(value) =>
                        handleVaccinationChange(index, 'vaccination_name_id', value)
                      }
                      required
                    />
                  </div>
                  <div className={styles.col}>
                    <label className={styles.label} htmlFor={`expiration_date-${index}`}>
                      Expiry Date
                    </label>
                    <DatePicker
                      value={vaccination.expiration_date}
                      onChange={(e) =>
                        handleVaccinationChange(index, 'expiration_date', e.target.value)
                      }
                      placeholder="MM/DD/YYYY"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Another Vaccine Button */}
          {form.vaccinations.length < MAX_VACCINES && (
            <div className={styles.addVaccineSection}>
              <Button
                type="button"
                className={styles.addVaccineButton}
                onClick={addVaccination}
                disabled={loading}>
                <span>+ Add Another Vaccine</span>
              </Button>
            </div>
          )}

          {/* Action Buttons */}
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
