'use client';
import BaseModal from '@/components/common/base-modal';
import Icon from '@/components/common/icon';
import Loader from '@/components/common/loader';
import SearchBar from '@/components/common/searchbar';
import { Client as BaseClient } from '@/services/client.api';
import { Pet } from '@/services/pet.api';
import { useClientStore } from '@/store/client.store';
import { useModalStore } from '@/store/modal-store';
import { usePetStore } from '@/store/pet.store';
import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import ClientDetailView from './components/ClientDetailView';
import FilterControls from './components/FilterControls';
import TabNavigation from './components/TabNavigation';
import styles from './page.module.scss';

// Dynamic imports for better performance
const ClientsTable = lazy(() => import('./components/ClientsTable'));
const PetsTable = lazy(() => import('./components/PetsTable'));
const PetsGrid = lazy(() => import('./components/PetsGrid'));

interface Client extends BaseClient {
  pets_count?: number;
  last_visit?: string;
  status?: string;
}

interface PetWithClient extends Pet {
  client: {
    first_name: string;
    middle_name: string | null;
    last_name: string;
  };
}

const ClientsAndPetsPage = () => {
  const openModal = useModalStore((state) => state.openModal);
  const closeModal = useModalStore((state) => state.closeModal);
  const [activeTab, setActiveTab] = useState<'pets' | 'clients'>('clients');
  const [showFilter, setShowFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { fetchClients, clients, isLoading: clientsLoading } = useClientStore();
  const { fetchPets, pets, isLoading: petsLoading } = usePetStore();
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [petsView, setPetsView] = useState<'list' | 'tiles'>('tiles');

  // Combined loading state
  const isLoading = clientsLoading || petsLoading;

  const ctaButton = (c: Client, type: 'view' | 'edit' | 'delete') => {
    if (type === 'view') {
      setSelectedClient(c);
      return;
    }
    if (type === 'edit') {
      // handle edit if needed
      return;
    }
    if (type === 'delete') {
      openModal(
        <BaseModal onClose={closeModal}>
          <div className={styles.deleteModal}>
            <h3>Delete Client</h3>
            <p>
              Are you sure you want to delete{' '}
              <strong>
                {c?.first_name} {c?.middle_name} {c?.last_name}
              </strong>
              ?
            </p>
            <div className={styles.buttonGroup}>
              <button className={styles.cancelButton} onClick={closeModal}>
                Cancel
              </button>
              <button
                className={styles.deleteButton}
                onClick={() => {
                  // TODO: Implement delete functionality
                  closeModal();
                }}>
                Delete
              </button>
            </div>
          </div>
        </BaseModal>
      );
    }
  };

  const transformedPets = useMemo(() => {
    return (Array.isArray(pets) ? pets : []).map((pet) => {
      const petWithClient = pet as unknown as PetWithClient;
      return {
        id: pet.id,
        name: pet.name,
        breed: pet.breed,
        age: `${pet.age} years`,
        owner: `${petWithClient?.client?.first_name} ${petWithClient?.client?.middle_name ? petWithClient?.client?.middle_name + ' ' : ''}${petWithClient?.client?.last_name}`,
        lastVisit: pet.created_at
          ? new Date(pet.created_at).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })
          : 'No visits',
        status: 'HEALTHY',
        image: null,
        actions: [
          {
            name: 'View',
            type: 'view',
            icon: '/images/actions/view.svg',
            onClick: () => {
              /* handle view pet */
            }
          },
          {
            name: 'Edit',
            type: 'edit',
            icon: '/images/actions/edit.svg',
            onClick: () => {
              /* handle edit pet */
            }
          },
          {
            name: 'Delete',
            type: 'delete',
            icon: '/images/actions/trash.svg',
            onClick: () => {
              /* handle delete pet */
            }
          }
        ]
      };
    });
  }, [pets]);

  const filteredPets = useMemo(() => {
    if (!searchQuery) return transformedPets;

    const query = searchQuery.toLowerCase();
    return transformedPets.filter(
      (pet) =>
        pet?.name?.toLowerCase().includes(query) ||
        pet?.breed?.toLowerCase().includes(query) ||
        pet?.owner?.toLowerCase().includes(query) ||
        pet?.status?.toLowerCase().includes(query)
    );
  }, [searchQuery, transformedPets]);

  const selectedClientPets = useMemo(() => {
    if (!selectedClient) return [];
    return filteredPets.filter(
      (pet) =>
        pet.owner ===
        `${selectedClient.first_name} ${selectedClient.middle_name ? selectedClient.middle_name + ' ' : ''}${selectedClient.last_name}`
    );
  }, [selectedClient, filteredPets]);

  const transformedClients = useMemo(() => {
    return (Array.isArray(clients) ? clients : []).map((client) => {
      const c = client as Client & { pets_count?: number; last_visit?: string; status?: string };
      return {
        name: `${c.first_name} ${c.middle_name ? c.middle_name + ' ' : ''}${c.last_name}`,
        contact: [
          { type: 'email', value: c.email },
          { type: 'phone', value: c.mobile_number }
        ],
        pets: `${c.pets_count || 0} Pet${c.pets_count !== 1 ? 's' : ''}`,
        lastVisit: c.last_visit || 'No visits',
        status: c.status?.toUpperCase() || 'INACTIVE',
        actions: [
          {
            name: 'View',
            type: 'view',
            icon: '/images/actions/view.svg',
            onClick: () => ctaButton(c, 'view')
          },
          {
            name: 'Edit',
            type: 'edit',
            icon: '/images/actions/edit.svg',
            onClick: () => ctaButton(c, 'edit')
          },
          {
            name: 'Delete',
            type: 'delete',
            icon: '/images/actions/trash.svg',
            onClick: () => ctaButton(c, 'delete')
          }
        ]
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clients]);

  const filteredClients = useMemo(() => {
    if (!searchQuery) return transformedClients;

    const query = searchQuery.toLowerCase();
    return transformedClients.filter(
      (client) =>
        client?.name?.toLowerCase().includes(query) ||
        client?.contact?.some((contact: { value: string }) =>
          contact?.value?.toLowerCase().includes(query)
        ) ||
        client?.status?.toLowerCase().includes(query)
    );
  }, [searchQuery, transformedClients]);

  const switchTab = (tab: 'pets' | 'clients') => {
    setActiveTab(tab);
    handleSearch('');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  useEffect(() => {
    const getAllClients = async () => {
      await fetchClients(1, 10);
    };

    const getAllPets = async () => {
      await fetchPets(1, 10);
    };

    if (activeTab === 'clients') {
      getAllClients();
    } else {
      getAllPets();
    }
  }, [fetchClients, fetchPets, activeTab, selectedClient]);

  const handleBack = () => {
    setSelectedClient(null);
  };

  return (
    <div className={styles.petsAndClient}>
      {!selectedClient && (
        <>
          <h3>Clients & Pets</h3>
          <div className={styles.topControls}>
            <div className={styles.topContainer}>
              <TabNavigation activeTab={activeTab} onTabChange={switchTab} />
              <FilterControls
                activeTab={activeTab}
                showFilter={showFilter}
                onFilterToggle={() => setShowFilter(!showFilter)}
              />
            </div>
            {activeTab === 'clients' ? (
              <div className={styles.searchContainer}>
                <SearchBar
                  onSearch={handleSearch}
                  placeholder={'Search Clients'}
                  value={searchQuery}
                />
              </div>
            ) : (
              <div className={styles.toggleGroup}>
                <button
                  className={`${styles.toggleButton} ${petsView === 'list' ? styles.active : ''}`}
                  onClick={() => setPetsView('list')}
                  aria-label="List View"
                  type="button">
                  <Icon
                    src={`/images/tabs/list-${petsView === 'list' ? 'active' : 'inactive'}.svg`}
                    width={16}
                    height={16}
                  />
                  <span className={styles.toggleLabel}>List</span>
                </button>
                <button
                  className={`${styles.toggleButton} ${petsView === 'tiles' ? styles.active : ''}`}
                  onClick={() => setPetsView('tiles')}
                  aria-label="Tiles View"
                  type="button">
                  <Icon
                    src={`/images/tabs/tile-${petsView === 'tiles' ? 'active' : 'inactive'}.svg`}
                    width={16}
                    height={16}
                  />
                  <p className={styles.toggleLabel}>Tiles</p>
                </button>
              </div>
            )}
          </div>

          <div className={styles.content}>
            {isLoading ? (
              <div className={styles.loadingWrapper}>
                <Loader />
                <p>Loading {activeTab === 'clients' ? 'clients' : 'pets'}...</p>
              </div>
            ) : (
              <Suspense
                fallback={
                  <div className={styles.loadingWrapper}>
                    <Loader />
                    <p>Loading {activeTab === 'clients' ? 'clients table' : 'pets view'}...</p>
                  </div>
                }>
                {activeTab === 'clients' ? (
                  <ClientsTable clients={filteredClients} />
                ) : petsView === 'list' ? (
                  <PetsTable pets={filteredPets} />
                ) : (
                  <PetsGrid pets={filteredPets} />
                )}
              </Suspense>
            )}
          </div>
        </>
      )}

      {selectedClient && (
        <div className={styles.content}>
          <ClientDetailView client={selectedClient} pets={selectedClientPets} onBack={handleBack} />
        </div>
      )}
    </div>
  );
};

export default ClientsAndPetsPage;
