import BaseModal from '@/components/common/base-modal';
import { Button } from '@/components/common/button';
import { DatePicker } from '@/components/common/date-picker';
import { ExistingFile, FileInput } from '@/components/common/file-input';
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

interface VaccinationData {
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
  vaccination_files: Array<{
    id: number;
    vaccination_id: number;
    path: string;
    original_name: string;
    name: string;
    full_path: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  }>;
}

interface AddVaccineProps {
  onSuccess?: () => void;
  vaccinationId?: number; // For edit mode
  isEditMode?: boolean; // Flag to indicate edit mode
}

const AddVaccine = ({ onSuccess, vaccinationId, isEditMode = false }: AddVaccineProps) => {
  const closeModal = useModalStore((state) => state.closeModal);
  const openModal = useModalStore((state) => state.openModal);
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
  const [existingFiles, setExistingFiles] = useState<{ [key: string]: ExistingFile[] }>({});
  const [clients, setClients] = useState<Client[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [vaccineTypes, setVaccineTypes] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [petsLoading, setPetsLoading] = useState(false);

  const MAX_VACCINES = 5;

  // Fetch vaccination data for edit mode
  useEffect(() => {
    if (isEditMode && vaccinationId) {
      setInitialLoading(true);
      vaccinationApi
        .findById(vaccinationId)
        .then((response) => {
          const vaccinationData: VaccinationData = response.data.result;

          // Format the expiration date to YYYY-MM-DD for the date picker
          const expirationDate = vaccinationData.expiration_date
            ? new Date(vaccinationData.expiration_date).toISOString().split('T')[0]
            : '';

          setForm({
            client_id: vaccinationData.client_id.toString(),
            pet_id: vaccinationData.pet_id.toString(),
            vaccinations: [
              {
                id: '1',
                vaccination_name_id: vaccinationData.vaccination_name_id.toString(),
                expiration_date: expirationDate,
                files: []
              }
            ]
          });

          // Set existing files for the vaccination
          if (vaccinationData.vaccination_files && vaccinationData.vaccination_files.length > 0) {
            setExistingFiles({
              '1': vaccinationData.vaccination_files.map((file) => ({
                id: file.id,
                name: file.name,
                original_name: file.original_name,
                path: file.path,
                full_path: file.full_path
              }))
            });
          }
        })
        .catch((error) => {
          console.error('Error fetching vaccination data:', error);
          addToast({
            scheme: 'danger',
            title: 'Error',
            message: 'Failed to load vaccination data for editing.',
            timeout: 4000
          });
        })
        .finally(() => {
          setInitialLoading(false);
        });
    }
  }, [isEditMode, vaccinationId, addToast]);

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
      if (!isEditMode) {
        setForm((prev) => ({ ...prev, pet_id: '' })); // Reset pet selection only in add mode
      }

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
      if (!isEditMode) {
        setForm((prev) => ({ ...prev, pet_id: '' }));
      }
    }
  }, [form.client_id, clients, addToast, isEditMode]);

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

  const handleFileRemove = async (vaccinationIndex: string, fileId?: number, fileName?: string) => {
    if (fileId) {
      // Show confirmation modal for existing files
      openModal(
        <BaseModal onClose={closeModal}>
          <div className={styles.deleteModal}>
            <h3>Delete File</h3>
            <p>
              Are you sure you want to delete <strong>{fileName || 'this file'}</strong>?
            </p>
            <p>This action cannot be undone.</p>
            <div className={styles.buttonGroup}>
              <Button
                type="button"
                variant="secondary"
                onClick={closeModal}
                style={{ marginRight: 8 }}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="danger"
                onClick={async () => {
                  try {
                    // Call API to delete the file from server
                    await vaccinationApi.deleteVaccinationFile(fileId);

                    // Remove existing file from local state
                    setExistingFiles((prev) => {
                      const updated = { ...prev };
                      if (updated[vaccinationIndex]) {
                        updated[vaccinationIndex] = updated[vaccinationIndex].filter(
                          (file) => file.id !== fileId
                        );
                      }
                      return updated;
                    });

                    closeModal();
                    addToast({
                      scheme: 'success',
                      title: 'Success',
                      message: 'File deleted successfully.',
                      timeout: 2000
                    });
                  } catch (error) {
                    console.error('Error deleting file:', error);
                    closeModal();
                    addToast({
                      scheme: 'danger',
                      title: 'Error',
                      message: 'Failed to delete file. Please try again.',
                      timeout: 4000
                    });
                  }
                }}>
                Delete
              </Button>
            </div>
          </div>
        </BaseModal>
      );
    }
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

      if (isEditMode && vaccinationId) {
        // For edit mode, use PUT method override
        formData.append('_method', 'PUT');
        formData.append('client_id', form.client_id);
        formData.append('pet_id', form.pet_id);

        // Add vaccination data for single vaccination in edit mode
        const vaccination = form.vaccinations[0];
        formData.append('vaccination_name_id', vaccination.vaccination_name_id);
        formData.append('expiration_date', vaccination.expiration_date);
        formData.append('vaccination_status_id', '1'); // Default to 1 for edit mode
        formData.append('notes', ''); // Include notes field as empty string

        // Add files if any
        vaccination.files.forEach((file, fileIndex) => {
          formData.append(`files[${fileIndex}]`, file);
        });

        // Send update request
        const response = await vaccinationApi.update(vaccinationId, formData);

        if (response.data.code === 200) {
          addToast({
            scheme: 'success',
            title: 'Success',
            message: 'Vaccine record updated successfully!',
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
            message: response.data.message || 'Failed to update vaccine record',
            timeout: 4000
          });
        }
      } else {
        // Original create logic for add mode
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
      }
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === 'object' && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message ||
            (isEditMode ? 'Failed to update vaccine record' : 'Failed to add vaccine record')
          : isEditMode
            ? 'Failed to update vaccine record'
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
      <h3 className={styles.header}>{isEditMode ? 'Edit Vaccine Record' : 'New Vaccine Record'}</h3>
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
                disabled={isEditMode} // Disable client selection in edit mode
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
                disabled={!form.client_id || petsLoading || isEditMode} // Disable pet selection in edit mode
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
                  {index > 0 && !isEditMode && (
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
                      onFileRemove={(fileId, fileName) =>
                        handleFileRemove(vaccination.id, fileId, fileName)
                      }
                      existingFiles={existingFiles[vaccination.id] || []}
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

          {/* Add Another Vaccine Button - Hidden in edit mode */}
          {!isEditMode && form.vaccinations.length < MAX_VACCINES && (
            <div className={styles.addVaccineSection}>
              <Button
                size="sm"
                variant="secondary"
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
              {loading || initialLoading
                ? isEditMode
                  ? 'Updating Vaccine Record...'
                  : 'Saving Vaccine Record...'
                : isEditMode
                  ? 'Update Vaccine Record'
                  : 'Save Vaccine Record'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddVaccine;
