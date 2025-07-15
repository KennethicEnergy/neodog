import { Pet } from '@/app/(pages)/clients-and-pets/components/clients/types';
import BaseModal from '@/components/common/base-modal';
import { Button } from '@/components/common/button';
import Loader from '@/components/common/loader';
import StatusTag from '@/components/common/status-tag';
import { petApi } from '@/services/pet.api';
import { useModalStore } from '@/store/modal-store';
import { useToastStore } from '@/store/toast.store';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import AddNotesModal from '../add-notes';
import styles from './pet-modal.module.scss';

interface PetModalProps {
  pet: Pet;
  onClose: () => void;
  onEdit?: () => void;
}

interface ActualPetData {
  id: number;
  client_id: string;
  name: string;
  breed: string;
  pet_breed_id: string;
  pet_sex_id: string;
  neutered: string;
  pet_classification_id: string;
  age: string;
  color: string;
  pet_size_id: string;
  microchip_number: string;
  photo?: File;
  belongings: string;
  allergies_notes: string;
  medication_notes: string;
  diet_notes: string;
  notes: string;
  created_at?: string;
  updated_at?: string;
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

const mockVaccinations = [
  {
    name: 'Rabies Vaccination',
    type: 'Vaccination',
    given: 'April 15, 2025',
    due: 'April 15, 2025',
    status: 'CURRENT'
  },
  {
    name: 'DHPP Vaccination',
    type: 'Vaccination',
    given: 'March 10, 2025',
    due: 'March 10, 2026',
    status: 'CURRENT'
  },
  {
    name: 'Bordetella',
    type: 'Vaccination',
    given: 'February 1, 2025',
    due: 'February 1, 2026',
    status: 'CURRENT'
  },
  {
    name: 'Leptospirosis',
    type: 'Vaccination',
    given: 'January 5, 2025',
    due: 'January 5, 2026',
    status: 'CURRENT'
  }
];

const PetModal: React.FC<PetModalProps> = ({ pet, onClose, onEdit }) => {
  const [activeTab, setActiveTab] = useState('Info');
  const [actualPetData, setActualPetData] = useState<ActualPetData | null>(null);
  const [loading, setLoading] = useState(true);
  const openModal = useModalStore((state) => state.openModal);
  const closeModal = useModalStore((state) => state.closeModal);
  const addToast = useToastStore((state) => state.addToast);

  // Helper function to get reference data from localStorage
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

  // Helper function to get reference name by ID
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

  const getVaccinationStatusClass = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'CURRENT':
        return 'success';
      case 'OVERDUE':
        return 'danger';
      case 'DUE SOON':
        return 'warning';
      case 'PENDING':
        return 'primary';
      default:
        return 'info';
    }
  };

  const handleSave = (note: string) => {
    console.log(note);
    closeModal();
  };

  const handleAdd = () => {
    openModal(<AddNotesModal onSave={handleSave} onCancel={closeModal} />);
  };

  return (
    <BaseModal onClose={onClose}>
      <div className={styles.petModalWrapper}>
        <div className={styles.petModalContainer}>
          <div className={styles.header}>
            <h3 className={styles.headerTitle}>Pet Profile</h3>
            <div className={styles.headerRow}>
              <div className={styles.avatarSection}>
                {pet.image ? (
                  <Image
                    src={pet.image}
                    alt={pet.name}
                    width={96}
                    height={96}
                    className={styles.avatar}
                  />
                ) : (
                  <div className={styles.avatarPlaceholder} />
                )}
              </div>
              <div className={styles.headerInfo}>
                <div className={styles.petNameRow}>
                  <span className={styles.petName}>{pet.name}</span>
                  <StatusTag status={pet.status} bgColor="info" />
                </div>
                <div className={styles.ownerInfoList}>
                  <div className={styles.ownerInfoItem}>
                    <Image src="/images/contact/user.svg" alt="Owner" width={20} height={20} />
                    <span className={styles.ownerText}>Sarah Johnson</span>
                  </div>
                  <div className={styles.ownerInfoItem}>
                    <Image src="/images/contact/phone.svg" alt="Phone" width={20} height={20} />
                    <span className={styles.ownerText}>555 123-4567</span>
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
                        <div className={styles.value}>{actualPetData?.name || pet.name}</div>
                      </div>
                      <div>
                        <div className={styles.label}>Breed</div>
                        <div className={styles.value}>
                          {actualPetData?.pet_breed_id
                            ? getReferenceName('pet_breed_references', actualPetData.pet_breed_id)
                            : actualPetData?.breed || pet.breed || 'Unknown Breed'}
                        </div>
                      </div>
                      <div>
                        <div className={styles.label}>Age</div>
                        <div className={styles.value}>
                          {actualPetData?.age || pet.age || 'Unknown'}
                        </div>
                      </div>
                      <div>
                        <div className={styles.label}>Sex</div>
                        <div className={styles.value}>
                          {actualPetData?.pet_sex_id
                            ? getReferenceName('pet_sex_references', actualPetData.pet_sex_id)
                            : 'Unknown'}
                        </div>
                      </div>
                      <div>
                        <div className={styles.label}>Weight</div>
                        <div className={styles.value}>Not Available</div>
                      </div>
                      <div>
                        <div className={styles.label}>Color</div>
                        <div className={styles.value}>{actualPetData?.color || 'Unknown'}</div>
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
                  <div className={styles.vaccinationsList}>
                    {mockVaccinations.map((vax, idx) => (
                      <div className={styles.vaccinationCard} key={idx}>
                        <div className={styles.vaxHeader}>
                          <div>
                            <div className={styles.vaxName}>{vax.name}</div>
                            <div className={styles.vaxType}>{vax.type}</div>
                          </div>
                          <div className={styles.vaxStatus}>
                            <StatusTag
                              status={vax.status}
                              bgColor={getVaccinationStatusClass(vax.status)}
                            />
                          </div>
                        </div>
                        <div className={styles.vaxFooter}>
                          <div className={styles.vaxDates}>
                            <div>Given: {vax.given}</div>
                            <div>Due: {vax.due}</div>
                          </div>
                          <div className={styles.vaxActions}>
                            <Image
                              src="/images/actions/view.svg"
                              alt="View"
                              width={18}
                              height={18}
                            />
                            <Image
                              src="/images/actions/edit.svg"
                              alt="Download"
                              width={18}
                              height={18}
                            />
                            <Image
                              src="/images/actions/download.svg"
                              alt="Download"
                              width={18}
                              height={18}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className={styles.footer}>
            <Button variant="white" size="md" onClick={onClose} className={styles.footerButton}>
              Cancel
            </Button>
            {activeTab === 'Info' ? (
              <Button variant="dark" size="md" onClick={onEdit} className={styles.footerButton}>
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
