import Table from '@/components/common/table';

const mockAppointments = [
  {
    client: 'Sarah Johnson',
    pets: 'Bella, Luna, Molly',
    service: 'Wellness Checkup',
    date: 'April 18, 2025 9:00 AM',
    status: 'CONFIRMED',
    actions: [
      { icon: '/images/actions/view.svg', onClick: () => {} },
      { icon: '/images/actions/edit.svg', onClick: () => {} },
      { icon: '/images/actions/trash.svg', onClick: () => {} }
    ]
  },
  {
    client: 'Emily Davis',
    pets: 'Daisy',
    service: 'Follow-up Visit',
    date: 'April 19, 2025 10:30 AM',
    status: 'CONFIRMED',
    actions: [
      { icon: '/images/actions/view.svg', onClick: () => {} },
      { icon: '/images/actions/edit.svg', onClick: () => {} },
      { icon: '/images/actions/trash.svg', onClick: () => {} }
    ]
  },
  {
    client: 'James Smith',
    pets: 'Max',
    service: 'Dental Cleaning',
    date: 'April 19, 2025 1:00 PM',
    status: 'CONFIRMED',
    actions: [
      { icon: '/images/actions/view.svg', onClick: () => {} },
      { icon: '/images/actions/edit.svg', onClick: () => {} },
      { icon: '/images/actions/trash.svg', onClick: () => {} }
    ]
  },
  {
    client: 'Ashley Martinez',
    pets: 'Lola',
    service: 'Grooming',
    date: 'April 20, 2025 3:00 PM',
    status: 'PENDING',
    actions: [
      { icon: '/images/actions/view.svg', onClick: () => {} },
      { icon: '/images/actions/edit.svg', onClick: () => {} },
      { icon: '/images/actions/trash.svg', onClick: () => {} }
    ]
  },
  {
    client: 'Michael Brown',
    pets: 'Rocky',
    service: 'Vaccination',
    date: 'April 21, 2025 9:00 AM',
    status: 'CANCELLED',
    actions: [
      { icon: '/images/actions/view.svg', onClick: () => {} },
      { icon: '/images/actions/edit.svg', onClick: () => {} },
      { icon: '/images/actions/trash.svg', onClick: () => {} }
    ]
  }
];

const headers = [
  { key: 'client', label: 'CLIENT' },
  { key: 'pets', label: 'PET(S)' },
  { key: 'service', label: 'SERVICE' },
  { key: 'date', label: 'DATE' },
  { key: 'status', label: 'STATUS' },
  { key: 'actions', label: 'ACTIONS' }
];

const AppointmentTable = () => {
  return (
    <div>
      <Table
        data={mockAppointments}
        headers={headers}
        enableSorting={true}
        tableOnly={true}
        maxHeight="60vh"
      />
    </div>
  );
};

export default AppointmentTable;
