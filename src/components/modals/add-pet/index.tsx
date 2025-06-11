import { useClientStore } from '@/store/client.store';
import { usePetStore } from '@/store/pet.store';
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
  chip_number: string;
  belongings: string;
  allergies_notes: string;
  medication_notes: string;
  diet_notes: string;
  notes: string;
}

const AddPet = ({ clientId }: { clientId?: string }) => {
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
    chip_number: '',
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

  useEffect(() => {
    fetchReferences();
  }, [fetchReferences]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createPet(form);
    if (result.success) {
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
        chip_number: '',
        belongings: '',
        allergies_notes: '',
        medication_notes: '',
        diet_notes: '',
        notes: ''
      });
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
                type="text"
                name="age"
                value={form.age}
                onChange={handleChange}
                required
              />
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
              <label className={styles.label} htmlFor="chip_number">
                Chip Number
              </label>
              <input
                id="chip_number"
                className={styles.input}
                type="text"
                name="chip_number"
                value={form.chip_number}
                onChange={handleChange}
                required
              />
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
