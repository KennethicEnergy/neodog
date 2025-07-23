'use client';
import BaseModal from '@/components/common/base-modal';
import Icon from '@/components/common/icon';
import Loader from '@/components/common/loader';
import { SearchInput } from '@/components/common/search-input';
import AddClient from '@/components/modals/add-client';
import { Client as BaseClient } from '@/services/client.api';
import { Pet } from '@/services/pet.api';
import { useClientStore } from '@/store/client.store';
import { useModalStore } from '@/store/modal-store';
import { usePetStore } from '@/store/pet.store';
import { useToastStore } from '@/store/toast.store';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, lazy, useCallback, useEffect, useMemo, useState } from 'react';
import ClientDetailView from './components/clients/ClientDetailView';
import FilterControls from './components/clients/FilterControls';
import TabNavigation from './components/clients/TabNavigation';
import type { Client as ClientType } from './components/clients/types';
import styles from './page.module.scss';

// Dynamic imports for better performance
const ClientsTable = lazy(() => import('./components/clients/ClientsTable'));
const PetsTable = lazy(() => import('./components/pets/PetsTable'));
const PetsGrid = lazy(() => import('./components/pets/PetsGrid'));

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
  pet_breed?: {
    id: number;
    code: string;
    name: string;
    description: string;
    created_at: string | null;
    updated_at: string | null;
  };
  pet_breed_id?: number;
}

interface TransformedPet {
  id: number;
  name: string;
  breed: string;
  age: string;
  owner: string;
  lastVisit: string;
  status: string;
  image: string | null;
}

interface ClientsAndPetsSharedProps {
  defaultTab?: 'pets' | 'clients';
}

const ClientsAndPetsShared: React.FC<ClientsAndPetsSharedProps> = ({ defaultTab = 'clients' }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const openModal = useModalStore((state) => state.openModal);
  const closeModal = useModalStore((state) => state.closeModal);
  const [activeTab, setActiveTab] = useState<'pets' | 'clients'>(defaultTab);
  const [showFilter, setShowFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const {
    fetchClients,
    fetchAllClients,
    clients,
    allClients,
    clientsTotal,
    isLoading: clientsLoading,
    deleteClient
  } = useClientStore();
  const {
    fetchPets,
    fetchAllPets,
    pets,
    allPets,
    petsTotal,
    isLoading: petsLoading,
    deletePet
  } = usePetStore();
  const addToast = useToastStore((state) => state.addToast);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [petsView, setPetsView] = useState<'list' | 'tiles'>('list');
  const pathname = usePathname();
  const [currentPage, setCurrentPage] = useState(1);

  // Combined loading state
  const isLoading = clientsLoading || petsLoading;

  // Check for client ID in URL on component mount
  useEffect(() => {
    const clientId = searchParams.get('c');
    if (clientId && clients.length > 0) {
      const client = clients.find((c) => c.id === parseInt(clientId));
      if (client) {
        setSelectedClient(client);
      }
    }
  }, [searchParams, clients]);

  const updateUrl = useCallback(
    (clientId?: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (clientId) {
        params.set('c', clientId);
      } else {
        params.delete('c');
      }
      const basePath = activeTab === 'pets' ? '/pets' : '/clients';
      router.replace(`${basePath}?${params.toString()}`);
    },
    [router, searchParams, activeTab]
  );

  const ctaButton = (c: Client, type: 'view' | 'edit' | 'delete') => {
    if (type === 'view') {
      setSelectedClient(c);
      updateUrl(c.id.toString());
      return;
    }
    if (type === 'edit') {
      openModal(
        <BaseModal onClose={closeModal}>
          <AddClient client={c} />
        </BaseModal>
      );
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
              <button className={styles.deleteButton} onClick={() => handleDeleteClient(c)}>
                Delete
              </button>
            </div>
          </div>
        </BaseModal>
      );
    }
  };

  const handleDeleteClient = async (c: Client) => {
    try {
      const result = await deleteClient(c.id);
      if (result.success) {
        closeModal();
        addToast({
          scheme: 'success',
          title: 'Client Deleted',
          message: `${c.first_name} ${c.middle_name ? c.middle_name + ' ' : ''}${c.last_name} was deleted successfully.`,
          timeout: 2000
        });
      } else {
        addToast({
          scheme: 'danger',
          title: 'Delete Failed',
          message: result.message || 'Failed to delete client.',
          timeout: 4000
        });
      }
    } catch (error) {
      addToast({
        scheme: 'danger',
        title: 'Delete Error',
        message: error instanceof Error ? error.message : 'Error deleting client.',
        timeout: 4000
      });
    }
  };

  const handleDeletePet = async (pet: TransformedPet) => {
    try {
      const result = await deletePet(pet.id);
      if (result.success) {
        closeModal();
        addToast({
          scheme: 'success',
          title: 'Pet Deleted',
          message: `${pet.name} was deleted successfully.`,
          timeout: 2000
        });
        fetchPets(1, 10);
      } else {
        addToast({
          scheme: 'danger',
          title: 'Delete Failed',
          message: result.message || 'Failed to delete pet.',
          timeout: 4000
        });
      }
    } catch (error) {
      addToast({
        scheme: 'danger',
        title: 'Delete Error',
        message: error instanceof Error ? error.message : 'Error deleting pet.',
        timeout: 4000
      });
    }
  };

  const petActionButton = (pet: TransformedPet, type: 'view' | 'edit' | 'delete') => {
    if (type === 'view') {
      // Handle view pet - this will be handled in PetsTable component
      return;
    }
    if (type === 'edit') {
      // Handle edit pet - this will be handled in PetsTable component
      return;
    }
    if (type === 'delete') {
      openModal(
        <BaseModal onClose={closeModal}>
          <div className={styles.deleteModal}>
            <h3>Delete Pet</h3>
            <p>
              Are you sure you want to delete <strong>{pet.name}</strong>?
            </p>
            <div className={styles.buttonGroup}>
              <button className={styles.cancelButton} onClick={closeModal}>
                Cancel
              </button>
              <button className={styles.deleteButton} onClick={() => handleDeletePet(pet)}>
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

      const ageValue = pet.age || '';
      const formattedAge = ageValue.includes('years') ? ageValue : `${ageValue} years`;

      // Get breed name from pet_breed object or fallback to breed field
      const getBreedName = () => {
        const petWithBreed = pet as PetWithClient;

        // Check if pet has pet_breed object (from API response)
        if (petWithBreed.pet_breed?.name) {
          return petWithBreed.pet_breed.name;
        }
        // Check if pet has pet_breed_id and we can look it up from references
        if (petWithBreed.pet_breed_id) {
          try {
            const breedCache = localStorage.getItem('petBreedReferences');
            if (breedCache) {
              const breedReferences = JSON.parse(breedCache) as Array<{
                value: string;
                label: string;
              }>;
              const breedRef = breedReferences.find(
                (ref) => ref.value === String(petWithBreed.pet_breed_id)
              );
              if (breedRef) {
                return breedRef.label;
              }
            }
          } catch (error) {
            console.error('Error parsing breed references:', error);
          }
        }
        // Fallback to breed field or unknown
        return pet.breed || 'Unknown Breed';
      };

      return {
        id: pet.id,
        name: pet.name,
        breed: getBreedName(),
        age: formattedAge,
        owner: `${petWithClient?.client?.first_name} ${petWithClient?.client?.middle_name ? petWithClient?.client?.middle_name + ' ' : ''}${petWithClient?.client?.last_name}`,
        lastVisit: pet.created_at
          ? new Date(pet.created_at).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })
          : 'No visits',
        status: 'HEALTHY',
        image: null
      };
    });
  }, [pets]);

  // Use allPets for search, pets for paginated
  const filteredPets = useMemo(() => {
    const source = searchQuery ? allPets : pets;
    if (!searchQuery) return transformedPets;
    const query = searchQuery.toLowerCase();
    return (Array.isArray(source) ? source : [])
      .map((pet) => {
        const petWithClient = pet as PetWithClient;
        const ageValue = pet.age || '';
        const formattedAge = ageValue.includes('years') ? ageValue : `${ageValue} years`;
        const getBreedName = () => {
          const petWithBreed = pet as PetWithClient;
          if (petWithBreed.pet_breed?.name) {
            return petWithBreed.pet_breed.name;
          }
          if (petWithBreed.pet_breed_id) {
            try {
              const breedCache = localStorage.getItem('petBreedReferences');
              if (breedCache) {
                const breedReferences = JSON.parse(breedCache) as Array<{
                  value: string;
                  label: string;
                }>;
                const breedRef = breedReferences.find(
                  (ref) => ref.value === String(petWithBreed.pet_breed_id)
                );
                if (breedRef) {
                  return breedRef.label;
                }
              }
            } catch (error) {
              console.error('Error parsing breed references:', error);
            }
          }
          return pet.breed || 'Unknown Breed';
        };
        return {
          id: pet.id,
          name: pet.name,
          breed: getBreedName(),
          age: formattedAge,
          owner: `${petWithClient?.client?.first_name} ${petWithClient?.client?.middle_name ? petWithClient?.client?.middle_name + ' ' : ''}${petWithClient?.client?.last_name}`,
          lastVisit: pet.created_at
            ? new Date(pet.created_at).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })
            : 'No visits',
          status: 'HEALTHY',
          image: null
        };
      })
      .filter(
        (pet) =>
          pet?.name?.toLowerCase().includes(query) ||
          pet?.breed?.toLowerCase().includes(query) ||
          pet?.owner?.toLowerCase().includes(query) ||
          pet?.status?.toLowerCase().includes(query)
      );
  }, [searchQuery, allPets, pets, transformedPets]);

  // Paginate filteredPets for display
  const petsPageSize = 10;
  const paginatedPets = useMemo(() => {
    if (!searchQuery) return filteredPets;
    const start = (currentPage - 1) * petsPageSize;
    return filteredPets.slice(start, start + petsPageSize);
  }, [filteredPets, currentPage, searchQuery]);

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
  }, [clients]);

  // Use allClients for search, clients for paginated
  const filteredClients = useMemo(() => {
    const source = searchQuery ? (allClients as ClientType[]) : (clients as ClientType[]);
    if (!searchQuery) return transformedClients;
    const query = searchQuery.toLowerCase();
    return (Array.isArray(source) ? source : [])
      .map((c: ClientType) => ({
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
      }))
      .filter(
        (client) =>
          client?.name?.toLowerCase().includes(query) ||
          client?.contact?.some((contact: { value: string }) =>
            contact?.value?.toLowerCase().includes(query)
          ) ||
          client?.status?.toLowerCase().includes(query)
      );
  }, [searchQuery, allClients, clients, transformedClients]);

  // Paginate filteredClients for display
  const pageSize = 10;
  const paginatedClients = useMemo(() => {
    if (!searchQuery) return filteredClients;
    const start = (currentPage - 1) * pageSize;
    return filteredClients.slice(start, start + pageSize);
  }, [filteredClients, currentPage, searchQuery]);

  const switchTab = (tab: 'pets' | 'clients') => {
    setActiveTab(tab);
    handleSearch('');
    // Update the URL when switching tabs
    if (tab === 'pets') {
      router.push('/pets');
    } else {
      router.push('/clients');
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Fetch all clients for search, paginated for normal
  useEffect(() => {
    if (searchQuery) {
      fetchAllClients();
    } else {
      fetchClients(currentPage, 10);
    }
  }, [searchQuery, currentPage, fetchClients, fetchAllClients]);

  // Fetch all pets for search, paginated for normal
  useEffect(() => {
    if (searchQuery) {
      fetchAllPets();
    } else {
      fetchPets(currentPage, 10);
    }
  }, [searchQuery, currentPage, fetchPets, fetchAllPets]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Fetch pets when a client is selected to ensure pets data is available
  useEffect(() => {
    if (selectedClient) {
      fetchPets(1, 10);
    }
  }, [selectedClient, fetchPets]);

  useEffect(() => {
    if (pathname === '/pets' && activeTab !== 'pets') {
      setActiveTab('pets');
    } else if (pathname === '/clients' && activeTab !== 'clients') {
      setActiveTab('clients');
    }
  }, [pathname]);

  const handleBack = useCallback(() => {
    setSelectedClient(null);
    updateUrl();
  }, [updateUrl]);

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
                <SearchInput
                  onSearch={handleSearch}
                  onValueChange={setSearchQuery}
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
                  <ClientsTable
                    clients={paginatedClients}
                    totalCount={clientsTotal}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                    hidePagination={!!searchQuery}
                  />
                ) : petsView === 'list' ? (
                  <PetsTable
                    pets={paginatedPets}
                    onDeletePet={(pet) => petActionButton(pet, 'delete')}
                    totalCount={petsTotal}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                  />
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

export default ClientsAndPetsShared;
