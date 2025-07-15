import { Button } from '@/components/common/button';
import { DatePicker } from '@/components/common/date-picker';
import { Input } from '@/components/common/input';
import Loader from '@/components/common/loader';
import PhotoUpload from '@/components/common/photo-upload';
import { Select, SelectOption } from '@/components/common/select';
import { Textarea } from '@/components/common/textarea';
import { createMultiMessageToast } from '@/components/common/toast';
import { Toggle } from '@/components/common/toggle';
import { petApi } from '@/services/pet.api';
import { vaccinationApi } from '@/services/vaccination.api';
import { useAuthStore } from '@/store/auth.store';
import { useClientStore } from '@/store/client.store';
import { useModalStore } from '@/store/modal-store';
import { usePetStore } from '@/store/pet.store';
import { useToastStore } from '@/store/toast.store';
import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';

export interface PetFormData {
  client_id: string;
  photo?: File | null;
  name: string;
  pet_breed_id: string;
  date_of_birth: string;
  pet_sex_id: string;
  color_or_markings: string;
  weight: string;
  height: string;
  microchip_number: string;
  enrollment_date: string;
  spayed_or_neutered: boolean;
  emergency_contact_name: string;
  e_c_phone_number: string;
  veterinarian_name: string;
  v_phone_number: string;
  handling_instruction: string;
  behavioral_notes: string;
  care_preferences: string;
  feeding_instructions: string;
  walking_preferences: string;
  favorite_toys: string;
  allergies: string;
  current_medications: string;
  medical_conditions: string;
  admin_and_logistics: string;
  pet_status_id: string;
}

interface AddPetProps {
  clientId?: string;
}

const AddPet = ({ clientId }: AddPetProps) => {
  const closeModal = useModalStore((state) => state.closeModal);
  const addToast = useToastStore((state) => state.addToast);
  const { clients, fetchClients } = useClientStore();
  const { createPet, isLoading: petsLoading } = usePetStore();
  const [form, setForm] = useState<PetFormData>({
    client_id: clientId || '',
    photo: null,
    name: '',
    pet_breed_id: '',
    date_of_birth: '',
    pet_sex_id: '',
    color_or_markings: '',
    weight: '',
    height: '',
    microchip_number: '',
    enrollment_date: '',
    spayed_or_neutered: false,
    emergency_contact_name: '',
    e_c_phone_number: '',
    veterinarian_name: '',
    v_phone_number: '',
    handling_instruction: '',
    behavioral_notes: '',
    care_preferences: '',
    feeding_instructions: '',
    walking_preferences: '',
    favorite_toys: '',
    allergies: '',
    current_medications: '',
    medical_conditions: '',
    admin_and_logistics: '',
    pet_status_id: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [initialLoading, setInitialLoading] = useState(true);

  // Reference data with localStorage caching
  const [breedOptions, setBreedOptions] = useState<SelectOption[]>([]);
  const [sexOptions, setSexOptions] = useState<SelectOption[]>([]);
  const [statusOptions, setStatusOptions] = useState<SelectOption[]>([]);

  // Authentication check
  const { isAuthenticated } = useAuthStore();

  // Client options
  const clientOptions: SelectOption[] =
    clients?.map((client) => ({
      value: client.id,
      label: `${client.first_name} ${client.last_name}`
    })) || [];

  // Helper function to get cached data or fetch from API
  const getCachedOrFetchData = async (
    cacheKey: string,
    fetchFunction: () => Promise<{ data: { result: Array<{ id: number; name: string }> } }>,
    setterFunction: (data: SelectOption[]) => void
  ) => {
    try {
      // Check if we have cached data
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsedData = JSON.parse(cached);
        const now = Date.now();
        // Cache for 1 hour (3600000 ms)
        if (now - parsedData.timestamp < 3600000) {
          setterFunction(parsedData.data);
          return;
        }
      }

      // Check if user is authenticated before making API call
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn(`No authentication token found for ${cacheKey}`);
        // Try to use cached data even if expired
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const parsedData = JSON.parse(cached);
          setterFunction(parsedData.data);
        }
        return;
      }

      // Fetch fresh data
      const response = await fetchFunction();
      const data = response.data?.result || [];
      const options = data.map((item: { id: number; name: string }) => ({
        value: item.id.toString(),
        label: item.name
      }));

      // Cache the data
      localStorage.setItem(
        cacheKey,
        JSON.stringify({
          data: options,
          timestamp: Date.now()
        })
      );

      setterFunction(options);
    } catch (error: unknown) {
      console.error(`Error fetching ${cacheKey}:`, error);

      // Handle authentication errors specifically
      const axiosError = error as { response?: { status?: number } };
      if (axiosError.response?.status === 401) {
        console.warn(`Authentication error for ${cacheKey}, using cached data if available`);
        addToast({
          scheme: 'warning',
          title: 'Authentication Required',
          message: 'Please log in again to access fresh data.',
          timeout: 4000
        });
      }

      // Try to use cached data even if expired
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          const parsedData = JSON.parse(cached);
          setterFunction(parsedData.data);
        } catch (parseError) {
          console.error(`Error parsing cached data for ${cacheKey}:`, parseError);
        }
      }
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      setInitialLoading(true);
      try {
        await Promise.all([
          getCachedOrFetchData(
            'pet_breed_references',
            petApi.getPetBreedReferences,
            setBreedOptions
          ),
          getCachedOrFetchData('pet_sex_references', petApi.getPetSexReferences, setSexOptions),
          getCachedOrFetchData(
            'pet_status_references',
            petApi.getPetStatusReferences,
            setStatusOptions
          ),
          getCachedOrFetchData(
            'pet_vaccination_status_references',
            vaccinationApi.getVaccinationStatusReferences,
            () => {} // Not used in this form
          ),
          fetchClients(1, 999) // Fetch clients when the modal opens
        ]);
      } catch (error) {
        console.error('Error loading references:', error);
        addToast({
          scheme: 'danger',
          title: 'Error',
          message: 'Failed to load form data. Please try again.',
          timeout: 4000
        });
      } finally {
        setInitialLoading(false);
      }
    };

    loadInitialData();
  }, [addToast, fetchClients]);

  // Check authentication after all hooks are declared
  useEffect(() => {
    if (!isAuthenticated) {
      addToast({
        scheme: 'warning',
        title: 'Authentication Required',
        message: 'Please log in to access this feature.',
        timeout: 4000
      });
      closeModal();
    }
  }, [isAuthenticated, addToast, closeModal]);

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.client_id) newErrors.client_id = 'Client is required';
    if (!form.name) newErrors.name = 'Pet name is required';
    if (!form.pet_breed_id) newErrors.pet_breed_id = 'Breed is required';
    if (!form.date_of_birth) newErrors.date_of_birth = 'Date of birth is required';
    if (!form.pet_sex_id) newErrors.pet_sex_id = 'Sex is required';
    if (!form.color_or_markings) newErrors.color_or_markings = 'Color/markings is required';
    if (!form.weight) newErrors.weight = 'Weight is required';
    if (!form.height) newErrors.height = 'Height is required';
    if (!form.enrollment_date) newErrors.enrollment_date = 'Enrollment date is required';
    if (!form.pet_status_id) newErrors.pet_status_id = 'Status is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof PetFormData, value: string | boolean | File | null) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const formData = new FormData();

      // Append all form fields to FormData
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null && value !== '') {
          if (key === 'photo' && value instanceof File) {
            formData.append(key, value);
          } else if (key === 'spayed_or_neutered') {
            formData.append(key, value ? '1' : '0');
          } else if (key !== 'photo') {
            formData.append(key, String(value));
          }
        }
      });

      const result = await createPet(formData);

      if (result.success) {
        addToast({
          scheme: 'success',
          title: 'Success',
          message: 'Pet created successfully',
          timeout: 3000
        });
        closeModal();
      } else {
        if (result.fieldErrors) {
          const errorMessages = Object.values(result.fieldErrors).flat();
          addToast(createMultiMessageToast('danger', 'Validation Error', errorMessages, 5000));
        } else if (result.message) {
          addToast({
            scheme: 'danger',
            title: 'Error',
            message: result.message,
            timeout: 5000
          });
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      addToast({
        scheme: 'danger',
        title: 'Error',
        message: 'Failed to save pet. Please try again.',
        timeout: 5000
      });
    }
  };

  if (initialLoading) {
    return (
      <div className={styles.modalContainer}>
        <div className={styles.loadingWrapper}>
          <Loader />
          <p>Loading form data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.modalContainer}>
      <h3 className={styles.header}>Add Pet</h3>
      <form onSubmit={handleSubmit}>
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Owner Information</div>
          <div className={styles.formGroup}>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="client_id">
                Client/Owner
              </label>
              <Select
                id="client_id"
                options={clientOptions}
                placeholder="Select client"
                value={form.client_id}
                onValueChange={(value) => handleInputChange('client_id', value)}
                error={!!errors.client_id}
                helperText={errors.client_id}
                required
                disabled={!!clientId}
              />
            </div>
          </div>

          <div className={styles.sectionTitle}>Pet Details</div>

          <div className={styles.formGroup}>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="photo">
                Photo
              </label>
              <PhotoUpload
                id="photo"
                size="sm"
                value={form.photo}
                onChange={(file) => {
                  if (file && file.size > 2 * 1024 * 1024) {
                    addToast({
                      scheme: 'danger',
                      title: 'File Too Large',
                      message: 'Photo must be less than 2MB',
                      timeout: 3000
                    });
                    return;
                  }
                  handleInputChange('photo', file);
                }}
                helperText="Accepted formats: JPEG, PNG, JPG, GIF, SVG, WebP (max 2MB)"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="name">
                Pet Name
              </label>
              <Input
                id="name"
                placeholder="Enter pet's name"
                value={form.name}
                onValueChange={(value) => handleInputChange('name', value)}
                error={!!errors.name}
                helperText={errors.name}
                required
              />
            </div>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="pet_breed_id">
                Breed
              </label>
              <Select
                id="pet_breed_id"
                options={breedOptions}
                placeholder="Select breed"
                value={form.pet_breed_id}
                onValueChange={(value) => handleInputChange('pet_breed_id', value)}
                error={!!errors.pet_breed_id}
                helperText={errors.pet_breed_id}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="date_of_birth">
                Date of Birth
              </label>
              <DatePicker
                value={form.date_of_birth}
                onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                placeholder="MM/DD/YYYY"
                max={new Date().toISOString().split('T')[0]}
                error={!!errors.date_of_birth}
                helperText={errors.date_of_birth}
                required
              />
            </div>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="pet_sex_id">
                Sex
              </label>
              <Select
                id="pet_sex_id"
                options={sexOptions}
                placeholder="Select sex"
                value={form.pet_sex_id}
                onValueChange={(value) => handleInputChange('pet_sex_id', value)}
                error={!!errors.pet_sex_id}
                helperText={errors.pet_sex_id}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="color_or_markings">
                Color/Markings
              </label>
              <Input
                id="color_or_markings"
                placeholder="e.g. Golden with white markings"
                value={form.color_or_markings}
                onValueChange={(value) => handleInputChange('color_or_markings', value)}
                error={!!errors.color_or_markings}
                helperText={errors.color_or_markings}
                required
              />
            </div>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="weight">
                Weight
              </label>
              <Input
                id="weight"
                type="number"
                placeholder="e.g. 25kg. or 55 lbs."
                value={form.weight}
                onValueChange={(value) => handleInputChange('weight', value)}
                error={!!errors.weight}
                helperText={errors.weight}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="height">
                Height
              </label>
              <Input
                id="height"
                type="number"
                placeholder="e.g. 60 cm. or 24 in."
                value={form.height}
                onValueChange={(value) => handleInputChange('height', value)}
                error={!!errors.height}
                helperText={errors.height}
                required
              />
            </div>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="microchip_number">
                Microchip Number
              </label>
              <Input
                id="microchip_number"
                placeholder="00000000000000"
                value={form.microchip_number}
                onValueChange={(value) => handleInputChange('microchip_number', value)}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="enrollment_date">
                Enrollment Date
              </label>
              <DatePicker
                value={form.enrollment_date}
                onChange={(e) => handleInputChange('enrollment_date', e.target.value)}
                placeholder="MM/DD/YYYY"
                max={new Date().toISOString().split('T')[0]}
                error={!!errors.enrollment_date}
                helperText={errors.enrollment_date}
                required
              />
            </div>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="spayed_or_neutered">
                Spayed/Neutered
              </label>
              <Toggle
                id="spayed_or_neutered"
                checked={form.spayed_or_neutered}
                onCheckedChange={(checked) => handleInputChange('spayed_or_neutered', checked)}
                label="Spayed/Neutered"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="pet_status_id">
                Pet Status
              </label>
              <Select
                id="pet_status_id"
                options={statusOptions}
                placeholder="Select status"
                value={form.pet_status_id}
                onValueChange={(value) => handleInputChange('pet_status_id', value)}
                error={!!errors.pet_status_id}
                helperText={errors.pet_status_id}
                required
              />
            </div>
          </div>

          {/* Contact Information Section */}
          <div className={styles.sectionTitle}>Contact Information</div>

          <div className={styles.formGroup}>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="emergency_contact_name">
                Emergency Contact
              </label>
              <Input
                id="emergency_contact_name"
                placeholder="Contact Name"
                value={form.emergency_contact_name}
                onValueChange={(value) => handleInputChange('emergency_contact_name', value)}
              />
            </div>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="e_c_phone_number">
                Phone Number
              </label>
              <Input
                id="e_c_phone_number"
                placeholder="(000) 000-0000"
                value={form.e_c_phone_number}
                onValueChange={(value) => handleInputChange('e_c_phone_number', value)}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="veterinarian_name">
                Veterinarian
              </label>
              <Input
                id="veterinarian_name"
                placeholder="Vet Name"
                value={form.veterinarian_name}
                onValueChange={(value) => handleInputChange('veterinarian_name', value)}
              />
            </div>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="v_phone_number">
                Phone Number
              </label>
              <Input
                id="v_phone_number"
                placeholder="(000) 000-0000"
                value={form.v_phone_number}
                onValueChange={(value) => handleInputChange('v_phone_number', value)}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="handling_instruction">
                Special Handling Requirements
              </label>
              <Textarea
                id="handling_instruction"
                placeholder="Special handling requirements or precautions"
                value={form.handling_instruction}
                onValueChange={(value) => handleInputChange('handling_instruction', value)}
                rows={3}
              />
            </div>
          </div>

          {/* Behavioral Notes Section */}
          <div className={styles.sectionTitle}>Behavioral Notes</div>

          <div className={styles.formGroup}>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="behavioral_notes">
                Behavioral Notes
              </label>
              <Textarea
                id="behavioral_notes"
                placeholder="Behavioral traits, temperament, and social preferences"
                value={form.behavioral_notes}
                onValueChange={(value) => handleInputChange('behavioral_notes', value)}
                rows={3}
              />
            </div>
          </div>

          {/* Care Information Section */}
          <div className={styles.sectionTitle}>Care Information</div>

          <div className={styles.formGroup}>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="care_preferences">
                Care Preferences
              </label>
              <Textarea
                id="care_preferences"
                placeholder="Preferred care routines and preferences"
                value={form.care_preferences}
                onValueChange={(value) => handleInputChange('care_preferences', value)}
                rows={3}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="feeding_instructions">
                Feeding Instructions
              </label>
              <Textarea
                id="feeding_instructions"
                placeholder="Diet, feeding schedule, and food preferences"
                value={form.feeding_instructions}
                onValueChange={(value) => handleInputChange('feeding_instructions', value)}
                rows={3}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="walking_preferences">
                Walking Preferences
              </label>
              <Textarea
                id="walking_preferences"
                placeholder="Exercise needs, walking preferences, and restrictions"
                value={form.walking_preferences}
                onValueChange={(value) => handleInputChange('walking_preferences', value)}
                rows={3}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="favorite_toys">
                Favorite Toys
              </label>
              <Textarea
                id="favorite_toys"
                placeholder="Preferred toys and play activities"
                value={form.favorite_toys}
                onValueChange={(value) => handleInputChange('favorite_toys', value)}
                rows={3}
              />
            </div>
          </div>

          {/* Medical Information Section */}
          <div className={styles.sectionTitle}>Medical Information</div>

          <div className={styles.formGroup}>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="allergies">
                Allergies
              </label>
              <Textarea
                id="allergies"
                placeholder="Known allergies and reactions"
                value={form.allergies}
                onValueChange={(value) => handleInputChange('allergies', value)}
                rows={3}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="current_medications">
                Current Medications
              </label>
              <Textarea
                id="current_medications"
                placeholder="Current medications and dosage instructions"
                value={form.current_medications}
                onValueChange={(value) => handleInputChange('current_medications', value)}
                rows={3}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="medical_conditions">
                Medical Conditions
              </label>
              <Textarea
                id="medical_conditions"
                placeholder="Known medical conditions and health issues"
                value={form.medical_conditions}
                onValueChange={(value) => handleInputChange('medical_conditions', value)}
                rows={3}
              />
            </div>
          </div>

          {/* Admin & Logistics Section */}
          <div className={styles.sectionTitle}>Admin & Logistics</div>

          <div className={styles.formGroup}>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="admin_and_logistics">
                Admin & Logistics
              </label>
              <Textarea
                id="admin_and_logistics"
                placeholder="Administrative notes and logistical information"
                value={form.admin_and_logistics}
                onValueChange={(value) => handleInputChange('admin_and_logistics', value)}
                rows={3}
              />
            </div>
          </div>

          <div className={styles.buttonContainer}>
            <Button type="submit" variant="default" isLoading={petsLoading} disabled={petsLoading}>
              {petsLoading ? 'Adding Pet...' : 'Add Pet'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddPet;
