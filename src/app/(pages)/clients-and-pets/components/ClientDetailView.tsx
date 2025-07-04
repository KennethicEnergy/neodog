import BaseModal from '@/components/common/base-modal';
import Loader from '@/components/common/loader';
import AddPet from '@/components/modals/add-pet';
import { vaccinationApi } from '@/services/vaccination.api';
import { useModalStore } from '@/store/modal-store';
import React, { Suspense, useEffect, useMemo, useState } from 'react';
import styles from './ClientDetailView.module.scss';
import { useTabLoading } from './hooks/useTabLoading';
import { ClientInfo, ClientPets, ClientTabs } from './index';
import { Client, Pet, VaccinationData } from './types';

// Lazy load tab components for better performance
const LazyActivityTab = React.lazy(() => import('./ActivityTab'));
const LazyVaccinationTab = React.lazy(() => import('./VaccinationTab'));
const LazyPlaceholderTab = React.lazy(() => import('./PlaceholderTab'));

interface ClientDetailViewProps {
  client: Client;
  pets: Pet[];
  onBack: () => void;
}

const ClientDetailView: React.FC<ClientDetailViewProps> = ({ client, pets, onBack }) => {
  const openModal = useModalStore((state) => state.openModal);
  const closeModal = useModalStore((state) => state.closeModal);
  const [selectedTab, setSelectedTab] = useState<string>('Activity');
  const [vaccinations, setVaccinations] = useState<VaccinationData[]>([]);
  const [vaccinationsLoading, setVaccinationsLoading] = useState(false);

  const { tabLoading, loadingTab, switchTab } = useTabLoading();

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
        })
        .finally(() => setVaccinationsLoading(false));
    }
  }, [selectedTab]);

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

  const addPet = ({ clientId }: { clientId: string }) => {
    openModal(
      <BaseModal onClose={closeModal}>
        <AddPet clientId={clientId} />
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
      <div className={styles.header}>
        <div className={styles.avatar} />
        <ClientInfo client={client} />
        <ClientPets pets={pets} onAddPet={handleAddPet} />
      </div>

      <ClientTabs selectedTab={selectedTab} onTabChange={handleTabChange} />

      {renderTabContent()}
    </div>
  );
};

export default ClientDetailView;
