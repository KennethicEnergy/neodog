import { useClientStore } from '@/store/client.store';
import { useModalStore } from '@/store/modal-store';
import { usePetStore } from '@/store/pet.store';
import { useToastStore } from '@/store/toast.store';
import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';

interface PetForm {
  client_id: string;
  name: string;
  breed: string;
  pet_sex_id: string;
  neutered: string;
  pet_classification_id: string;
  age: string;
  color: string;
  pet_size_id: string;
  microchip_number: string;
  photo: File | null;
  belongings: string;
  allergies_notes: string;
  medication_notes: string;
  diet_notes: string;
  notes: string;
}

const AddPet = ({ clientId }: { clientId?: string }) => {
  const closeModal = useModalStore((state) => state.closeModal);
  const addToast = useToastStore((state) => state.addToast);
  const [form, setForm] = useState<PetForm>({
    client_id: clientId || '',
    name: '',
    breed: '',
    pet_sex_id: '',
    neutered: '',
    pet_classification_id: '',
    age: '',
    color: '',
    pet_size_id: '',
    microchip_number: '',
    photo: null,
    belongings: '',
    allergies_notes: '',
    medication_notes: '',
    diet_notes: '',
    notes: ''
  });

  const { clients } = useClientStore();
  const {
    createPet,
    isLoading,
    petSexReferences,
    petClassificationReferences,
    petSizeReferences,
    fetchReferences
  } = usePetStore();

  const [ageError, setAgeError] = useState('');

  useEffect(() => {
    fetchReferences();
  }, [fetchReferences]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'age') {
      // Only allow digits
      if (!/^\d*$/.test(value)) {
        setAgeError('Age must be a number');
      } else {
        setAgeError('');
      }
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      // Check file size (2MB = 2 * 1024 * 1024 bytes)
      if (file.size > 2 * 1024 * 1024) {
        addToast({
          scheme: 'danger',
          title: 'File Too Large',
          message: 'Photo must be less than 2MB',
          timeout: 3000
        });
        e.target.value = '';
        setForm((prev) => ({ ...prev, photo: null }));
        return;
      }
    }
    setForm((prev) => ({ ...prev, photo: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d+$/.test(form.age)) {
      setAgeError('Age must be a number');
      return;
    }
    setAgeError('');

    // Create FormData for file upload
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== '') {
        if (key === 'photo' && value instanceof File) {
          formData.append(key, value);
        } else if (key !== 'photo') {
          formData.append(key, String(value));
        }
      }
    });

    const result = await createPet(formData);
    console.log(result);
    if (result.success) {
      addToast({
        scheme: 'success',
        title: 'Success',
        message: 'Pet created successfully',
        timeout: 3000
      });
      setForm({
        client_id: '',
        name: '',
        breed: '',
        pet_sex_id: '',
        neutered: '',
        pet_classification_id: '',
        age: '',
        color: '',
        pet_size_id: '',
        microchip_number: '',
        photo: null,
        belongings: '',
        allergies_notes: '',
        medication_notes: '',
        diet_notes: '',
        notes: ''
      });
      closeModal();
    } else {
      // Handle validation errors
      if (result.fieldErrors) {
        const errorMessages = Object.values(result.fieldErrors).flat();
        const errorMessage = errorMessages.join(', ');
        addToast({
          scheme: 'danger',
          title: 'Validation Error',
          message: errorMessage,
          timeout: 5000
        });
      } else if (result.message) {
        addToast({
          scheme: 'danger',
          title: 'Error',
          message: result.message,
          timeout: 5000
        });
      }
    }
  };

  return (
    <div className={styles.modalContainer}>
      <h2 className={styles.header}>Add Pet</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Pet Information</div>

          <div className={styles.formGroup}>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="client_id">
                Owner
              </label>
              <select
                id="client_id"
                className={styles.input}
                name="client_id"
                value={form.client_id}
                onChange={handleChange}
                disabled={!!clientId}
                required>
                <option value="">Select Owner</option>
                {clients?.map((client) => (
                  <option key={client.id} value={client.id}>
                    {`${client.first_name} ${client.last_name}`}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="name">
                Pet Name
              </label>
              <input
                id="name"
                className={styles.input}
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="breed">
                Breed
              </label>
              <input
                id="breed"
                className={styles.input}
                type="text"
                name="breed"
                value={form.breed}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="pet_sex_id">
                Sex
              </label>
              <select
                id="pet_sex_id"
                className={styles.input}
                name="pet_sex_id"
                value={form.pet_sex_id}
                onChange={handleChange}
                required>
                <option value="">Select Sex</option>
                {petSexReferences.map((sex) => (
                  <option key={sex.id} value={sex.id}>
                    {sex.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="neutered">
                Neutered
              </label>
              <select
                id="neutered"
                className={styles.input}
                name="neutered"
                value={form.neutered}
                onChange={handleChange}
                required>
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="pet_classification_id">
                Classification
              </label>
              <select
                id="pet_classification_id"
                className={styles.input}
                name="pet_classification_id"
                value={form.pet_classification_id}
                onChange={handleChange}
                required>
                <option value="">Select Classification</option>
                {petClassificationReferences.map((classification) => (
                  <option key={classification.id} value={classification.id}>
                    {classification.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="age">
                Age
              </label>
              <input
                id="age"
                className={styles.input}
                type="number"
                name="age"
                value={form.age}
                onChange={handleChange}
                pattern="\\d*"
                inputMode="numeric"
                min="0"
                required
                aria-invalid={!!ageError}
              />
              {ageError && <div style={{ color: 'red', fontSize: 12 }}>{ageError}</div>}
            </div>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="color">
                Color
              </label>
              <input
                id="color"
                className={styles.input}
                type="text"
                name="color"
                value={form.color}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="pet_size_id">
                Size
              </label>
              <select
                id="pet_size_id"
                className={styles.input}
                name="pet_size_id"
                value={form.pet_size_id}
                onChange={handleChange}
                required>
                <option value="">Select Size</option>
                {petSizeReferences.map((size) => (
                  <option key={size.id} value={size.id}>
                    {size.name}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="microchip_number">
                Microchip Number
              </label>
              <input
                id="microchip_number"
                className={styles.input}
                type="text"
                name="microchip_number"
                value={form.microchip_number}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="photo">
                Photo
              </label>
              <input
                id="photo"
                className={styles.input}
                type="file"
                name="photo"
                accept="image/jpeg,image/png,image/jpg,image/gif,image/svg+xml,image/webp"
                onChange={handleFileChange}
                required
              />
              <small style={{ fontSize: '12px', color: '#666' }}>
                Accepted formats: JPEG, PNG, JPG, GIF, SVG, WebP (max 2MB)
              </small>
            </div>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="belongings">
                Belongings
              </label>
              <input
                id="belongings"
                className={styles.input}
                type="text"
                name="belongings"
                value={form.belongings}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.sectionTitle}>Notes</div>

          <div className={styles.formGroup}>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="allergies_notes">
                Allergies Notes
              </label>
              <textarea
                id="allergies_notes"
                className={styles.textarea}
                name="allergies_notes"
                value={form.allergies_notes}
                onChange={handleChange}
                style={{ resize: 'none' }}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="medication_notes">
                Medication Notes
              </label>
              <textarea
                id="medication_notes"
                className={styles.textarea}
                name="medication_notes"
                value={form.medication_notes}
                onChange={handleChange}
                style={{ resize: 'none' }}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="diet_notes">
                Diet Notes
              </label>
              <textarea
                id="diet_notes"
                className={styles.textarea}
                name="diet_notes"
                value={form.diet_notes}
                onChange={handleChange}
                style={{ resize: 'none' }}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="notes">
                Additional Notes
              </label>
              <textarea
                id="notes"
                className={styles.textarea}
                name="notes"
                value={form.notes}
                onChange={handleChange}
                style={{ resize: 'none' }}
                required
              />
            </div>
          </div>

          {/* {error && <div className={styles.error}>{error}</div>}
          {success && <div className={styles.success}>{success}</div>} */}

          <div className={styles.buttonContainer}>
            <button className={styles.button} type="submit" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Pet'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddPet;
