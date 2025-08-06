import Table from '@/components/common/table';

interface VaccinationTableRow extends Record<string, unknown> {
  id?: number;
  clientName?: string[];
  petName?: string;
  vaccine?: string;
  expiryDate?: string;
  dateCreated?: string;
  status?: string;
  statusCode?: string;
  actions: object[];
}

interface VaccinationsTableProps {
  vaccinations: VaccinationTableRow[];
  totalCount?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  hidePagination?: boolean;
}

const VACCINATION_HEADERS = [
  { key: 'clientName', label: 'CLIENT NAME' },
  { key: 'petName', label: 'PET NAME' },
  { key: 'vaccine', label: 'VACCINE' },
  { key: 'expiryDate', label: 'EXPIRY DATE' },
  { key: 'dateCreated', label: 'DATE CREATED' },
  { key: 'status', label: 'STATUS' },
  { key: 'actions', label: 'ACTIONS' }
];

const VaccinationsTable = ({
  vaccinations,
  totalCount,
  currentPage,
  onPageChange,
  hidePagination
}: VaccinationsTableProps) => {
  return (
    <div>
      <Table
        data={vaccinations}
        headers={VACCINATION_HEADERS}
        enableSorting={true}
        tableOnly
        totalCount={totalCount}
        currentPage={currentPage}
        onPageChange={onPageChange}
        hidePagination={hidePagination}
      />
    </div>
  );
};

export default VaccinationsTable;
