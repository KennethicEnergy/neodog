import Table from '@/components/common/table';

interface Pet extends Record<string, unknown> {
  name: string;
  breed: string;
  age: string;
  owner: string;
  lastVisit: string;
  status: string;
  actions?: object[];
}

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
  return (
    <div>
      <Table data={pets} headers={PET_HEADERS} enableSorting={true} viewAll={false} tableOnly />
    </div>
  );
};

export default PetsTable;
