import { vaccinationApi } from '@/services/vaccination.api';
import { useModalStore } from '@/store/modal-store';
import { usePetStore } from '@/store/pet.store';
import { useToastStore } from '@/store/toast.store';
import React, { useEffect, useState } from 'react';
import Loader from '../../common/loader';
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
              <select
                id="pet_id"
                className={styles.input}
                name="pet_id"
                value={form.pet_id}
                onChange={handleChange}
                required>
                <option value="">Select a pet</option>
                {pets.map((pet) => (
                  <option key={pet.id} value={pet.id}>
                    {pet.name}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="vaccination_name_id">
                Vaccination Name
              </label>
              <select
                id="vaccination_name_id"
                className={styles.input}
                name="vaccination_name_id"
                value={form.vaccination_name_id}
                onChange={handleChange}
                required>
                <option value="">Select a vaccine</option>
                {vaccineTypes.map((vaccine) => (
                  <option key={vaccine.id} value={vaccine.id}>
                    {vaccine.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className={styles.formGroup}>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="vaccination_date">
                Vaccination Date
              </label>
              <input
                id="vaccination_date"
                className={styles.input}
                type="date"
                name="vaccination_date"
                value={form.vaccination_date}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="expiration_date">
                Expiry Date
              </label>
              <input
                id="expiration_date"
                className={styles.input}
                type="date"
                name="expiration_date"
                value={form.expiration_date}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className={styles.formGroup}>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="vaccination_status_id">
                Vaccination Status
              </label>
              <select
                id="vaccination_status_id"
                className={styles.input}
                name="vaccination_status_id"
                value={form.vaccination_status_id}
                onChange={handleChange}
                required>
                <option value="">Select status</option>
                {statusRefs.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className={styles.formGroup}>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="notes">
                Notes
              </label>
              <input
                id="notes"
                className={styles.input}
                type="text"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Enter notes (optional)"
              />
            </div>
          </div>
          <div className={styles.formGroup}>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="certificate">
                Upload Vaccine Certificate
              </label>
              <input
                id="certificate"
                className={styles.input}
                type="file"
                name="file"
                accept="application/pdf,image/*"
                onChange={handleFileChange}
              />
              <small style={{ fontSize: '12px', color: '#666' }}>
                Accepted formats: PDF, JPEG, PNG, JPG, GIF, SVG, WebP (max 2MB)
              </small>
            </div>
          </div>
          <div className={styles.buttonContainer}>
            <button
              className={styles.button}
              type="button"
              onClick={closeModal}
              disabled={loading || initialLoading}
              style={{ marginRight: 8 }}>
              Cancel
            </button>
            <button className={styles.button} type="submit" disabled={loading || initialLoading}>
              {loading ? (
                <>
                  <Loader />
                  <span>Adding Vaccine...</span>
                </>
              ) : (
                'Add Vaccine'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddVaccine;
