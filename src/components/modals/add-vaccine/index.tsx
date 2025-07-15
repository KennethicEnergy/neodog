import { Button } from '@/components/common/button';
import { DatePicker } from '@/components/common/date-picker';
import { FileInput } from '@/components/common/file-input';
import Loader from '@/components/common/loader';
import { Select } from '@/components/common/select';
import { Textarea } from '@/components/common/textarea';
import { vaccinationApi } from '@/services/vaccination.api';
import { useModalStore } from '@/store/modal-store';
import { usePetStore } from '@/store/pet.store';
import { useToastStore } from '@/store/toast.store';
import React, { useEffect, useState } from 'react';
import styles from '../add-pet/styles.module.scss';

interface AddVaccineForm {
  pet_id: string;
  vaccination_name_id: string;
  file: File | null;
  vaccination_date: string;
  expiration_date: string;
  notes: string;
  vaccination_status_id: string;
}

const AddVaccine = () => {
  const closeModal = useModalStore((state) => state.closeModal);
  const addToast = useToastStore((state) => state.addToast);
  const { pets, fetchPets, isLoading: petsLoading } = usePetStore();
  const [form, setForm] = useState<AddVaccineForm>({
    pet_id: '',
    vaccination_name_id: '',
    file: null,
    vaccination_date: '',
    expiration_date: '',
    notes: '',
    vaccination_status_id: ''
  });
  const [vaccineTypes, setVaccineTypes] = useState<{ id: number; name: string }[]>([]);
  const [statusRefs, setStatusRefs] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    // Fetch vaccine types and status
    setInitialLoading(true);
    Promise.all([
      vaccinationApi.getVaccinationNameReferences(),
      vaccinationApi.getVaccinationStatusReferences()
    ])
      .then(([typesRes, statusRes]) => {
        setVaccineTypes(typesRes.data?.result || []);
        setStatusRefs(statusRes.data?.result || []);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
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

  useEffect(() => {
    // Fetch pets for selection
    fetchPets(1, 100);
  }, [fetchPets]);

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
          message: 'Vaccine added successfully!',
          timeout: 2000
        });
        setTimeout(() => {
          closeModal();
        }, 1000);
      } else {
        addToast({
          scheme: 'danger',
          title: 'Error',
          message: response.data.message || 'Failed to add vaccine',
          timeout: 4000
        });
      }
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === 'object' && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message ||
            'Failed to add vaccine'
          : 'Failed to add vaccine';
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

  if (initialLoading || petsLoading) {
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
      <h2 className={styles.header}>New Vaccine Record</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.section}>
          <div className={styles.formGroup}>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="pet_id">
                Pet
              </label>
              <Select
                id="pet_id"
                options={pets.map((pet) => ({ value: pet.id.toString(), label: pet.name }))}
                placeholder="Select a pet"
                value={form.pet_id}
                onValueChange={(value) => handleInputChange('pet_id', value)}
                required
              />
            </div>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="vaccination_name_id">
                Vaccination Name
              </label>
              <Select
                id="vaccination_name_id"
                options={vaccineTypes.map((vaccine) => ({
                  value: vaccine.id.toString(),
                  label: vaccine.name
                }))}
                placeholder="Select a vaccine"
                value={form.vaccination_name_id}
                onValueChange={(value) => handleInputChange('vaccination_name_id', value)}
                required
              />
            </div>
          </div>
          <div className={styles.formGroup}>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="vaccination_date">
                Vaccination Date
              </label>
              <DatePicker
                value={form.vaccination_date}
                onChange={(e) => handleInputChange('vaccination_date', e.target.value)}
                placeholder="MM/DD/YYYY"
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
              <label className={styles.label} htmlFor="vaccination_status_id">
                Vaccination Status
              </label>
              <Select
                id="vaccination_status_id"
                options={statusRefs.map((status) => ({
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
              <label className={styles.label} htmlFor="certificate">
                Upload Vaccine Certificate
              </label>
              <FileInput
                id="certificate"
                accept="application/pdf,image/*"
                onChange={handleFileChange}
                helperText="Accepted formats: PDF, JPEG, PNG, JPG, GIF, SVG, WebP (max 2MB)"
                maxSize={2 * 1024 * 1024}
                showFileList={true}
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
              {loading || initialLoading ? 'Adding Vaccine...' : 'Add Vaccine'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddVaccine;
