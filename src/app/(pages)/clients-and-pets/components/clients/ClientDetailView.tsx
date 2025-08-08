import BaseModal from '@/components/common/base-modal';
import Loader from '@/components/common/loader';
import AddPet from '@/components/modals/add-pet';
import { Client, clientApi, Pet } from '@/services/client.api';
import { vaccinationApi } from '@/services/vaccination.api';
import { useAuthStore } from '@/store/auth.store';
import { useModalStore } from '@/store/modal-store';
import { useToastStore } from '@/store/toast.store';
import { getPetImageUrl } from '@/utils/image';
import Image from 'next/image';
import React, { Suspense, useEffect, useMemo, useState } from 'react';
import styles from './ClientDetailView.module.scss';
import ClientInfo from './ClientInfo';
import ClientPets from './ClientPets';
import ClientTabs from './ClientTabs';
import { useTabLoading } from './hooks/useTabLoading';
import { VaccinationData } from './types';

// Lazy load tab components for better performance
const LazyActivityTab = React.lazy(() => import('./ActivityTab'));
const LazyVaccinationTab = React.lazy(() => import('./VaccinationTab'));
const LazyPlaceholderTab = React.lazy(() => import('./PlaceholderTab'));

interface ClientDetailViewProps {
  client: Client;
  pets: Pet[];
  onBack: () => void;
}

const ClientDetailView: React.FC<ClientDetailViewProps> = ({
  client: initialClient,
  pets: initialPets,
  onBack
}) => {
  const openModal = useModalStore((state) => state.openModal);
  const closeModal = useModalStore((state) => state.closeModal);
  const [selectedTab, setSelectedTab] = useState<string>('Activity');
  const [vaccinations, setVaccinations] = useState<VaccinationData[]>([]);
  const [vaccinationsLoading, setVaccinationsLoading] = useState(false);
  const [client, setClient] = useState<Client>(initialClient);
  const [pets, setPets] = useState<Pet[]>(initialPets);
  const [loading, setLoading] = useState(false);

  const { tabLoading, loadingTab, switchTab } = useTabLoading();
  const { isAuthenticated } = useAuthStore();
  const addToast = useToastStore((state) => state.addToast);

  // Fetch client data with pets when component mounts or client changes
  useEffect(() => {
    const fetchClientWithPets = async () => {
      setLoading(true);
      try {
        const response = await clientApi.findById(initialClient.id);
        if (response.data && response.data.result) {
          const clientData = response.data.result as Client;
          setClient(clientData);
          setPets(clientData.pets || []);
        }
      } catch (error) {
        console.error('Error fetching client with pets:', error);
        addToast({
          scheme: 'danger',
          title: 'Error',
          message: 'Failed to load client data. Please try again.',
          timeout: 4000
        });
      } finally {
        setLoading(false);
      }
    };

    fetchClientWithPets();
  }, [initialClient.id, addToast]);

  // Fetch vaccination data
  useEffect(() => {
    if (selectedTab === 'Vaccination Records') {
      setVaccinationsLoading(true);
      vaccinationApi
        .getAll()
        .then((vaccRes) => {
          const responseData = vaccRes.data;
          const vaccData = responseData?.result?.pets?.data || [];
          setVaccinations(vaccData);
        })
        .catch((error) => {
          console.error('Vaccination API Error:', error);
          setVaccinations([]);
          addToast({
            scheme: 'danger',
            title: 'Error',
            message: 'Failed to load vaccination records. Please try again.',
            timeout: 4000
          });
        })
        .finally(() => setVaccinationsLoading(false));
    }
  }, [selectedTab, addToast]);

  // Filter vaccinations for current client
  const filteredVaccinations = useMemo(() => {
    if (selectedTab !== 'Vaccination Records') return [];

    const clientVaccinations = vaccinations.filter(
      (vaccination) => vaccination.client?.id === client.id
    );

    return clientVaccinations.map((pet) => ({
      ownerAndContact: [
        `${client.first_name} ${client.last_name}`,
        client.mobile_number || client.email || ''
      ],
      pet: pet.name,
      currentCount: pet.vaccination_current_count?.toString() || '0',
      dueSoonCount: pet.vaccination_due_soon_count?.toString() || '0',
      overdueCount: pet.vaccination_overdue_count?.toString() || '0',
      missingCount: pet.vaccination_missing_count?.toString() || '0',
      actions: [
        {
          name: 'View',
          type: 'view',
          icon: '/images/actions/view.svg',
          onClick: () => {}
        },
        {
          name: 'Edit',
          type: 'edit',
          icon: '/images/actions/edit.svg',
          onClick: () => {}
        },
        {
          name: 'Delete',
          type: 'delete',
          icon: '/images/actions/trash.svg',
          onClick: () => {}
        }
      ]
    }));
  }, [vaccinations, client, selectedTab]);

  const handlePetAdded = async () => {
    // Refresh client data with pets when a new pet is added
    try {
      const response = await clientApi.findById(client.id);
      if (response.data && response.data.result) {
        const clientData = response.data.result as Client;
        setClient(clientData);
        setPets(clientData.pets || []);
      }
    } catch (error) {
      console.error('Error refreshing client data:', error);
    }
  };

  const addPet = ({ clientId }: { clientId: string }) => {
    // Check authentication before opening modal
    if (!isAuthenticated) {
      addToast({
        scheme: 'warning',
        title: 'Authentication Required',
        message: 'Please log in to add new pets.',
        timeout: 4000
      });
      return;
    }

    openModal(
      <BaseModal onClose={closeModal}>
        <AddPet clientId={clientId} onPetAdded={handlePetAdded} />
      </BaseModal>
    );
  };

  const handleAddPet = () => {
    addPet({ clientId: client.id.toString() });
  };

  const handleTabChange = (tab: string) => {
    switchTab(tab, setSelectedTab);
  };

  const renderTabContent = () => {
    if (tabLoading) {
      return (
        <div className={styles.activity}>
          <div className={styles.loadingWrapper}>
            <Loader />
            <p>Loading {loadingTab}...</p>
          </div>
        </div>
      );
    }

    return (
      <Suspense
        fallback={
          <div className={styles.activity}>
            <div className={styles.loadingWrapper}>
              <Loader />
              <p>Loading {selectedTab}...</p>
            </div>
          </div>
        }>
        {(() => {
          switch (selectedTab) {
            case 'Activity':
              return <LazyActivityTab />;
            case 'Vaccination Records':
              return (
                <LazyVaccinationTab
                  vaccinationsLoading={vaccinationsLoading}
                  filteredVaccinations={filteredVaccinations}
                />
              );
            default:
              return <LazyPlaceholderTab tabName={selectedTab} />;
          }
        })()}
      </Suspense>
    );
  };

  return (
    <div className={styles.clientDetail}>
      <button className={styles.back} onClick={onBack}>
        ← Back to List
      </button>
      {loading ? (
        <div className={styles.loadingWrapper}>
          <Loader />
          <p>Loading client data...</p>
        </div>
      ) : (
        <>
          <div className={styles.header}>
            <div className={styles.avatar}>
              {client.photo_path ? (
                <Image
                  src={getPetImageUrl(client.photo_path) || ''}
                  alt={`${client.first_name} ${client.last_name}`}
                  width={72}
                  height={72}
                  className={styles.clientImage}
                  onError={(e) => {
                    console.warn('Failed to load client image:', client.photo_path);
                    // Hide the image on error and show initials
                    e.currentTarget.style.display = 'none';
                    const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                    if (placeholder) {
                      placeholder.style.display = 'flex';
                    }
                  }}
                  unoptimized={true}
                />
              ) : null}
              {/* Fallback placeholder with client initials */}
              <div
                className={styles.avatarPlaceholder}
                style={{ display: client.photo_path ? 'none' : 'flex' }}>
                {`${client.first_name.charAt(0)}${client.last_name.charAt(0)}`.toUpperCase()}
              </div>
            </div>
            <ClientInfo client={client} />
            <ClientPets pets={pets} onAddPet={handleAddPet} />
          </div>

          <ClientTabs selectedTab={selectedTab} onTabChange={handleTabChange} />

          {renderTabContent()}
        </>
      )}
    </div>
  );
};

export default ClientDetailView;
