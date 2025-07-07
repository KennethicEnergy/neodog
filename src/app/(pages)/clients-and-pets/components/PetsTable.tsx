import { Button } from '@/components/common/button';
import Table from '@/components/common/table';
import PetModal from '@/components/modals/pet-modal';
import { useModalStore } from '@/store/modal-store';
import { Pet } from './types';

interface PetsTableProps {
  pets: Pet[];
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

const PetsTable = ({ pets }: PetsTableProps) => {
  const openModal = useModalStore((state) => state.openModal);
  const closeModal = useModalStore((state) => state.closeModal);

  const handleViewPet = (pet: Pet) => {
    openModal(<PetModal pet={pet} onClose={closeModal} />);
  };

  // Add a custom renderer for the actions column
  const dataWithActions = pets.map((pet) => ({
    ...pet,
    actions: [
      <Button key="view" size="sm" variant="white" onClick={() => handleViewPet(pet)}>
        View
      </Button>
    ]
  }));

  return (
    <div>
      <Table
        data={dataWithActions}
        headers={PET_HEADERS}
        enableSorting={true}
        viewAll={false}
        tableOnly
      />
    </div>
  );
};

export default PetsTable;
