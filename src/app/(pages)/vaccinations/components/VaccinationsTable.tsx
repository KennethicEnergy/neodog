import Table from '@/components/common/table';

interface Vaccination extends Record<string, unknown> {
  ownerAndContact: string[];
  pet: string;
  currentCount: string;
  dueSoonCount: string;
  overdueCount: string;
  missingCount: string;
  actions: object[];
}

interface VaccinationsTableProps {
  vaccinations: Vaccination[];
}

const VACCINATION_HEADERS = [
  { key: 'ownerAndContact', label: 'CLIENT NAME' },
  { key: 'pet', label: 'PET NAME' },
  { key: 'currentCount', label: 'CURRENT' },
  { key: 'dueSoonCount', label: 'DUE SOON' },
  { key: 'overdueCount', label: 'OVERDUE' },
  { key: 'missingCount', label: 'MISSING' },
  { key: 'actions', label: 'ACTIONS' }
];

const VaccinationsTable = ({ vaccinations }: VaccinationsTableProps) => {
  return (
    <div>
      <Table data={vaccinations} headers={VACCINATION_HEADERS} enableSorting={true} tableOnly />
    </div>
  );
};

export default VaccinationsTable;
