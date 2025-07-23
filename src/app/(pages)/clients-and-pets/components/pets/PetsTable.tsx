import BaseModal from '@/components/common/base-modal';
import Table from '@/components/common/table';
import AddPet from '@/components/modals/add-pet';
import PetModal from '@/components/modals/pet-modal';
import { useAuthStore } from '@/store/auth.store';
import { useModalStore } from '@/store/modal-store';
import { useToastStore } from '@/store/toast.store';

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

interface PetsTableProps {
  pets: TransformedPet[];
  onPetUpdated?: () => void;
  onDeletePet?: (pet: TransformedPet) => void;
  totalCount?: number | null;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

const PET_HEADERS = [
  { key: 'name', label: 'PET' },
  { key: 'breed', label: 'BREED' },
  { key: 'age', label: 'AGE' },
  { key: 'owner', label: 'OWNER' },
  { key: 'lastVisit', label: 'LAST VISIT' },
  { key: 'status', label: 'STATUS' },
  { key: 'actions', label: 'ACTIONS' }
];

const PetsTable = ({
  pets,
  onDeletePet,
  totalCount,
  currentPage,
  onPageChange
}: PetsTableProps) => {
  const openModal = useModalStore((state) => state.openModal);
  const closeModal = useModalStore((state) => state.closeModal);
  const { isAuthenticated } = useAuthStore();
  const addToast = useToastStore((state) => state.addToast);

  const handleViewPet = (pet: TransformedPet) => {
    openModal(<PetModal pet={pet} onClose={closeModal} />);
  };

  const handleEditPet = (pet: TransformedPet) => {
    // Check authentication before opening modal
    if (!isAuthenticated) {
      addToast({
        scheme: 'warning',
        title: 'Authentication Required',
        message: 'Please log in to edit pets.',
        timeout: 4000
      });
      return;
    }

    openModal(
      <BaseModal onClose={closeModal}>
        <AddPet petId={pet.id} />
      </BaseModal>
    );
  };

  const handleDeletePet = (pet: TransformedPet) => {
    if (onDeletePet) {
      onDeletePet(pet);
    }
  };

  // Transform pets data to include actions in the same format as clients table
  const petsWithActions = pets.map((pet) => ({
    ...pet,
    actions: [
      {
        name: 'View',
        type: 'view',
        icon: '/images/actions/view.svg',
        onClick: () => handleViewPet(pet)
      },
      {
        name: 'Edit',
        type: 'edit',
        icon: '/images/actions/edit.svg',
        onClick: () => handleEditPet(pet)
      },
      {
        name: 'Delete',
        type: 'delete',
        icon: '/images/actions/trash.svg',
        onClick: () => handleDeletePet(pet)
      }
    ]
  }));

  return (
    <div>
      <Table
        data={petsWithActions}
        headers={PET_HEADERS}
        enableSorting={true}
        viewAll={false}
        tableOnly
        totalCount={totalCount ?? undefined}
        currentPage={currentPage}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default PetsTable;
