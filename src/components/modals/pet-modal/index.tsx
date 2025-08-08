import { Pet } from '@/app/(pages)/clients-and-pets/components/clients/types';
import VaccinationsTable from '@/app/(pages)/vaccinations/components/VaccinationsTable';
import BaseModal from '@/components/common/base-modal';
import { Button } from '@/components/common/button';
import Loader from '@/components/common/loader';
import StatusTag from '@/components/common/status-tag';
import { petApi } from '@/services/pet.api';
import { Vaccination, vaccinationApi } from '@/services/vaccination.api';
import { useModalStore } from '@/store/modal-store';
import { useToastStore } from '@/store/toast.store';
import { getPetImageUrl } from '@/utils/image';
import Image from 'next/image';
import React, { useEffect, useMemo, useState } from 'react';
import AddNotesModal from '../add-notes';
import AddPet from '../add-pet';
import styles from './pet-modal.module.scss';

interface PetModalProps {
  pet: Pet;
  onClose: () => void;
  onEdit?: () => void;
}

interface ActualPetData {
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
  microchip_number: string;
  enrollment_date: string;
  spayed_or_neutered: number;
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
  last_visit: string;
  pet_status_id: number;
  created_at: string;
  updated_at: string;
  client: {
    id: number;
    facility_id: number;
    photo_path: string | null;
    first_name: string;
    middle_name: string;
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
  };
  pet_breed: {
    id: number;
    code: string;
    name: string;
    description: string;
    created_at: string | null;
    updated_at: string | null;
  };
  pet_sex: {
    id: number;
    code: string;
    name: string;
    description: string;
    created_at: string | null;
    updated_at: string | null;
  };
  pet_status: {
    id: number;
    code: string;
    name: string;
    description: string;
    created_at: string | null;
    updated_at: string | null;
  };
}

interface ReferenceData {
  value: string;
  label: string;
}

const TABS = [
  { key: 'Info', label: 'Info', iconBase: '/images/add-pet-modal/info' },
  { key: 'Notes', label: 'Notes', iconBase: '/images/add-pet-modal/notes' },
  { key: 'Belongings', label: 'Belongings', iconBase: '/images/add-pet-modal/belongings' },
  { key: 'Vaccinations', label: 'Vaccinations', iconBase: '/images/add-pet-modal/vaccinations' }
];

// Mock data for demonstration
const mockNotes = [
  {
    text: 'Prefers soft toys and gentle play. Get anxious around loud noises',
    date: 'April 5, 2025'
  },
  {
    text: 'Needs muzzle during nail trimming. Very food motivated for training',
    date: 'March 20, 2025'
  },
  {
    text: 'Loves to swim in the lake. Keep away from chocolate.',
    date: 'February 10, 2025'
  },
  {
    text: 'Gets along well with other dogs. Dislikes cats.',
    date: 'January 15, 2025'
  },
  {
    text: 'Sensitive stomach. Feed only recommended food.',
    date: 'December 5, 2024'
  }
];

const mockBelongings = [
  {
    label: 'Leash',
    image: '/images/mock/leash.png'
  },
  {
    label: 'Food Bowl',
    image: '/images/mock/food-bowl.png'
  },
  {
    label: 'Tennis Ball',
    image: '/images/mock/tennis-ball.png'
  },
  {
    label: 'Blanket',
    image: '/images/mock/blanket.png'
  },
  {
    label: 'Chew Toy',
    image: '/images/mock/chew-toy.png'
  }
];

// Extended type to include vaccination_files and nested objects (matching view-vaccination modal)
interface VaccinationWithDetails extends Vaccination {
  vaccination_name?: {
    id: number;
    code: string;
    name: string;
    description: string;
  };
  vaccination_status?: {
    id: number;
    code: string;
    name: string;
    description: string;
  };
  vaccination_files?: Array<{
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

// Define VaccinationTableRow interface for the table
interface VaccinationTableRow extends Record<string, unknown> {
  id?: number;
  clientName?: string[];
  petName?: string;
  vaccine?: string;
  expiryDate?: string;
  dateCreated?: string;
  status?: string;
  statusCode?: string;
  actions: object[];
}

const PetModal: React.FC<PetModalProps> = ({ pet, onClose }) => {
  const [activeTab, setActiveTab] = useState('Info');
  const [actualPetData, setActualPetData] = useState<ActualPetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [vaccinations, setVaccinations] = useState<VaccinationWithDetails[]>([]);
  const [vaccinationsLoading, setVaccinationsLoading] = useState(false);
  const openModal = useModalStore((state) => state.openModal);
  const closeModal = useModalStore((state) => state.closeModal);
  const addToast = useToastStore((state) => state.addToast);

  const getReferenceData = (cacheKey: string): ReferenceData[] => {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsedData = JSON.parse(cached);
        return parsedData.data || [];
      }
    } catch (error) {
      console.error(`Error parsing ${cacheKey}:`, error);
    }
    return [];
  };

  const getReferenceName = (cacheKey: string, id: string): string => {
    const references = getReferenceData(cacheKey);
    const reference = references.find((ref) => ref.value === id);
    return reference?.label || 'Unknown';
  };

  // Fetch actual pet data
  useEffect(() => {
    const fetchPetData = async () => {
      try {
        setLoading(true);
        const response = await petApi.findById(pet.id);
        if (response.data.code === 200) {
          setActualPetData(response.data.result as ActualPetData);
        } else {
          addToast({
            scheme: 'danger',
            title: 'Error',
            message: 'Failed to load pet details.',
            timeout: 4000
          });
        }
      } catch (error) {
        console.error('Error fetching pet data:', error);
        addToast({
          scheme: 'danger',
          title: 'Error',
          message: 'Failed to load pet details.',
          timeout: 4000
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPetData();
  }, [pet.id, addToast]);

  // Fetch vaccination data when Vaccinations tab is selected
  useEffect(() => {
    if (activeTab === 'Vaccinations') {
      setVaccinationsLoading(true);

      const fetchVaccinations = async () => {
        try {
          const response = await vaccinationApi.viewRecordsByPetId(pet.id);
          if (response.data && response.data.result) {
            // Handle the response structure like in view-vaccination modal
            const result = response.data.result;
            let petVaccinations: VaccinationWithDetails[] = [];

            if (result.vaccinations) {
              // If the response has a vaccinations array
              petVaccinations = Array.isArray(result.vaccinations)
                ? result.vaccinations
                : [result.vaccinations];
            } else if (Array.isArray(result)) {
              // If the result is directly an array
              petVaccinations = result;
            } else {
              // If the result is a single object
              petVaccinations = [result];
            }

            setVaccinations(petVaccinations);
          }
        } catch (error) {
          console.error('Error fetching vaccination records:', error);
          setVaccinations([]);
          addToast({
            scheme: 'danger',
            title: 'Error',
            message: 'Failed to load vaccination records. Please try again.',
            timeout: 4000
          });
        } finally {
          setVaccinationsLoading(false);
        }
      };

      fetchVaccinations();
    }
  }, [activeTab, pet.id, addToast]);

  const handleSave = (note: string) => {
    console.log(note);
    closeModal();
  };

  const handleAdd = () => {
    openModal(<AddNotesModal onSave={handleSave} onCancel={closeModal} />);
  };

  useEffect(() => {
    if (pet.id) {
      (async () => {
        try {
          const response = await petApi.findById(pet.id);
          if (response.data && response.data.result) {
            const pet = response.data.result;
            setActualPetData(pet as ActualPetData);
          }
        } catch {
          addToast({
            scheme: 'danger',
            title: 'Error',
            message: 'Failed to load pet details.',
            timeout: 4000
          });
        }
      })();
    }
  }, [pet.id, addToast]);

  // Transform vaccinations into the format expected by VaccinationsTable
  const filteredVaccinations = useMemo((): VaccinationTableRow[] => {
    if (activeTab !== 'Vaccinations') return [];

    return vaccinations.map((vaccination) => {
      return {
        id: vaccination.id,
        clientName: [
          `${actualPetData?.client?.first_name || ''} ${actualPetData?.client?.last_name || ''}`,
          actualPetData?.client?.mobile_number || actualPetData?.client?.email || ''
        ],
        petName: pet.name,
        vaccine: vaccination.vaccination_name?.name || 'Unknown Vaccination',
        expiryDate: vaccination.expiration_date
          ? new Date(vaccination.expiration_date).toLocaleDateString()
          : 'N/A',
        dateCreated: vaccination.created_at
          ? new Date(vaccination.created_at).toLocaleDateString()
          : 'N/A',
        status: vaccination.vaccination_status?.name || 'Unknown Status',
        statusCode: vaccination.vaccination_status?.code || 'unknown',
        actions: []
      };
    });
  }, [vaccinations, actualPetData, pet.name, activeTab]);

  return (
    <BaseModal onClose={onClose}>
      <div className={styles.petModalWrapper}>
        <div className={styles.petModalContainer}>
          <div className={styles.header}>
            <h3 className={styles.headerTitle}>Pet Profile</h3>
            <div className={styles.headerRow}>
              <div className={styles.avatarSection}>
                {actualPetData?.photo_path ? (
                  <Image
                    src={getPetImageUrl(actualPetData.photo_path) || ''}
                    alt={pet.name}
                    width={96}
                    height={96}
                    className={styles.avatar}
                    onError={(e) => {
                      console.warn('Failed to load pet image:', actualPetData.photo_path);
                      e.currentTarget.style.display = 'none';
                      const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                      if (placeholder) {
                        placeholder.style.display = 'flex';
                      }
                    }}
                    unoptimized={true}
                  />
                ) : null}
                {/* Fallback placeholder with pet initials */}
                <div
                  className={styles.avatarPlaceholder}
                  style={{ display: actualPetData?.photo_path ? 'none' : 'flex' }}>
                  {pet.name.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className={styles.headerInfo}>
                <div className={styles.petNameRow}>
                  <span className={styles.petName}>{pet.name}</span>
                  <StatusTag status={pet.status} bgColor="info" />
                </div>
                <div className={styles.ownerInfoList}>
                  <div className={styles.ownerInfoItem}>
                    <Image src="/images/contact/user.svg" alt="Owner" width={20} height={20} />
                    <span className={styles.ownerText}>
                      {actualPetData?.client?.first_name} {actualPetData?.client?.last_name}
                    </span>
                  </div>
                  <div className={styles.ownerInfoItem}>
                    <Image src="/images/contact/phone.svg" alt="Phone" width={20} height={20} />
                    <span className={styles.ownerText}>{actualPetData?.client?.mobile_number}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.tabs} role="tablist">
            {TABS.map((tab) => (
              <div
                key={tab.key}
                className={activeTab === tab.key ? styles.tabActive : styles.tab}
                onClick={() => setActiveTab(tab.key)}
                role="tab"
                aria-selected={activeTab === tab.key}
                tabIndex={activeTab === tab.key ? 0 : -1}>
                <Image
                  src={
                    activeTab === tab.key
                      ? `${tab.iconBase}-active.svg`
                      : `${tab.iconBase}-inactive.svg`
                  }
                  alt={tab.label}
                  width={20}
                  height={20}
                  className={styles.tabIcon}
                />
                <span>{tab.label}</span>
              </div>
            ))}
          </div>
          <div className={styles.modalContent}>
            <div className={styles.tabContent}>
              {activeTab === 'Info' && (
                <div className={styles.infoSection}>
                  <h3>Pet Information</h3>
                  {loading ? (
                    <div className={styles.loadingWrapper}>
                      <Loader />
                    </div>
                  ) : (
                    <div className={styles.infoGrid}>
                      <div>
                        <div className={styles.label}>Name</div>
                        <div className={styles.value}>{actualPetData?.name}</div>
                      </div>
                      <div>
                        <div className={styles.label}>Breed</div>
                        <div className={styles.value}>
                          {actualPetData?.pet_breed_id
                            ? getReferenceName(
                                'pet_breed_references',
                                String(actualPetData.pet_breed_id)
                              )
                            : '-'}
                        </div>
                      </div>
                      <div>
                        <div className={styles.label}>Age</div>
                        <div className={styles.value}>{actualPetData?.age}</div>
                      </div>
                      <div>
                        <div className={styles.label}>Sex</div>
                        <div className={styles.value}>
                          {actualPetData?.pet_sex_id
                            ? getReferenceName(
                                'pet_sex_references',
                                String(actualPetData.pet_sex_id)
                              )
                            : '-'}
                        </div>
                      </div>
                      <div>
                        <div className={styles.label}>Weight</div>
                        <div className={styles.value}>{actualPetData?.weight}</div>
                      </div>
                      <div>
                        <div className={styles.label}>Color</div>
                        <div className={styles.value}>{actualPetData?.color_or_markings}</div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {activeTab === 'Notes' && (
                <div className={styles.notesSection}>
                  <h3>Pet Notes</h3>
                  <div className={styles.notesList}>
                    {mockNotes.map((note, idx) => (
                      <div className={styles.noteCard} key={idx}>
                        <div className={styles.noteText}>
                          <span>{note.text}</span>
                          <span className={styles.noteEditIcon}>
                            <Image
                              src="/images/actions/edit.svg"
                              alt="Edit"
                              width={18}
                              height={18}
                            />
                          </span>
                        </div>
                        <div className={styles.noteFooter}>
                          <span className={styles.noteDate}>{note.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {activeTab === 'Belongings' && (
                <div className={styles.belongingsSection}>
                  <h3>Pet Belongings</h3>
                  <div className={styles.belongingsGrid}>
                    {mockBelongings.map((item, idx) => (
                      <div className={styles.belongingCard} key={idx}>
                        <div className={styles.belongingImageContainer}>
                          <Image
                            src={item.image}
                            alt={item.label}
                            width={100}
                            height={100}
                            className={styles.belongingImage}
                          />
                        </div>

                        <div className={styles.belongingLabel}>{item.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {activeTab === 'Vaccinations' && (
                <div className={styles.vaccinationsSection}>
                  <h3>Pet Vaccinations</h3>
                  {vaccinationsLoading ? (
                    <div className={styles.loadingWrapper}>
                      <Loader />
                      <p>Loading vaccination records...</p>
                    </div>
                  ) : filteredVaccinations.length > 0 ? (
                    <VaccinationsTable vaccinations={filteredVaccinations} hideActions={true} />
                  ) : (
                    <div style={{ color: '#888', padding: '2rem 0', textAlign: 'center' }}>
                      No vaccination records found for this pet.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className={styles.footer}>
            <Button variant="white" size="md" onClick={onClose} className={styles.footerButton}>
              Cancel
            </Button>
            {activeTab === 'Info' ? (
              <Button
                variant="dark"
                size="md"
                onClick={() => {
                  openModal(
                    <BaseModal onClose={onClose}>
                      <AddPet petId={pet.id} />
                    </BaseModal>
                  );
                }}
                className={styles.footerButton}>
                Edit
              </Button>
            ) : (
              <Button variant="dark" size="md" onClick={handleAdd} className={styles.footerButton}>
                Add
              </Button>
            )}
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

export default PetModal;
