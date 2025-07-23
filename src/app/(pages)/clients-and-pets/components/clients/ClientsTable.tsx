import Table from '@/components/common/table';

interface Client extends Record<string, unknown> {
  name: string;
  contact: object[];
  pets: string;
  lastVisit: string;
  status: string;
  actions: object[];
}

interface ClientsTableProps {
  clients: Client[];
  totalCount?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  hidePagination?: boolean;
}

const CLIENT_HEADERS = [
  { key: 'name', label: 'NAME' },
  { key: 'contact', label: 'CONTACT / EMAIL' },
  { key: 'pets', label: 'PETS' },
  { key: 'lastVisit', label: 'LAST VISIT' },
  { key: 'status', label: 'STATUS' },
  { key: 'actions', label: 'ACTIONS' }
];

const ClientsTable = ({
  clients,
  totalCount,
  currentPage,
  onPageChange,
  hidePagination
}: ClientsTableProps) => {
  return (
    <div>
      <Table
        data={clients}
        headers={CLIENT_HEADERS}
        enableSorting={true}
        viewAll={false}
        tableOnly
        totalCount={totalCount}
        currentPage={currentPage}
        onPageChange={onPageChange}
        hidePagination={hidePagination}
      />
    </div>
  );
};

export default ClientsTable;
