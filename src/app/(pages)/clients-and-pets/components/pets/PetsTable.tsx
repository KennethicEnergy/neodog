import Table from '@/components/common/table';
import PetModal from '@/components/modals/pet-modal';
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

const PetsTable = ({ pets, onDeletePet }: PetsTableProps) => {
  const openModal = useModalStore((state) => state.openModal);
  const closeModal = useModalStore((state) => state.closeModal);
  const addToast = useToastStore((state) => state.addToast);

  const handleViewPet = (pet: TransformedPet) => {
    openModal(<PetModal pet={pet} onClose={closeModal} />);
  };

  const handleEditPet = () => {
    // For now, we'll reuse the add pet modal with pre-filled data
    // TODO: Create a dedicated edit pet modal
    addToast({
      scheme: 'primary',
      title: 'Edit Pet',
      message: 'Edit functionality will be implemented soon',
      timeout: 3000
    });
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
        onClick: () => handleEditPet()
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
      />
    </div>
  );
};

export default PetsTable;
