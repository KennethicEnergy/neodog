import Table from '@/components/common/table';

interface Appointment extends Record<string, unknown> {
  client: string;
  pets: string;
  service: string;
  date: string;
  status: string;
  actions: { icon: string; onClick: () => void }[];
}

interface AppointmentTableProps {
  appointments: Appointment[];
}

const headers = [
  { key: 'client', label: 'CLIENT' },
  { key: 'pets', label: 'PET(S)' },
  { key: 'service', label: 'SERVICE' },
  { key: 'date', label: 'DATE' },
  { key: 'status', label: 'STATUS' },
  { key: 'actions', label: 'ACTIONS' }
];

const AppointmentTable = ({ appointments }: AppointmentTableProps) => {
  return (
    <div>
      <Table
        data={appointments}
        headers={headers}
        enableSorting={true}
        tableOnly={true}
        maxHeight="60vh"
      />
    </div>
  );
};

export default AppointmentTable;
