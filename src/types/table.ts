// Generic table header interface
export interface TableHeader {
  key: string;
  label: string;
}

// Dog check-in data type
export type TTableRow = {
  pet: string;
  client: string;
  lodging: string;
  locker: string;
  checkIn: string;
  checkOut: string;
  services: string;
  belongings: string;
  details: string;
  task?: string;
  assignedTo?: string;
  status?: string;
};

// Order data type (completely different structure)
export type OrderRow = {
  orderId: string;
  customerName: string;
  customerEmail: string;
  orderDate: string;
  totalAmount: number;
  status: 'pending' | 'completed' | 'cancelled';
  items: string[];
  shippingAddress: string;
  paymentMethod: string;
  isRush: boolean;
};

// Employee data type
export type EmployeeRow = {
  employeeId: string;
  firstName: string;
  lastName: string;
  department: string;
  position: string;
  salary: number;
  hireDate: string;
  isActive: boolean;
  skills: string[];
};

// Product inventory data type
export type ProductRow = {
  sku: string;
  productName: string;
  category: string;
  price: number;
  stockQuantity: number;
  supplier: string;
  lastRestocked: string;
  isActive: boolean;
};

// Headers for different table types
export const DOG_CHECKIN_HEADERS: TableHeader[] = [
  { key: 'pet', label: 'Pet' },
  { key: 'client', label: 'Client' },
  { key: 'lodging', label: 'Lodging' },
  { key: 'locker', label: 'Locker' },
  { key: 'checkIn', label: 'Check In' },
  { key: 'checkOut', label: 'Check Out' },
  { key: 'services', label: 'Services' },
  { key: 'belongings', label: 'Belongings' },
  { key: 'details', label: 'Details' }
];

export const ORDER_HEADERS: TableHeader[] = [
  { key: 'orderId', label: 'Order ID' },
  { key: 'customerName', label: 'Customer' },
  { key: 'customerEmail', label: 'Email' },
  { key: 'orderDate', label: 'Order Date' },
  { key: 'totalAmount', label: 'Total Amount' },
  { key: 'status', label: 'Status' },
  { key: 'items', label: 'Items' },
  { key: 'paymentMethod', label: 'Payment' },
  { key: 'isRush', label: 'Rush Order' }
];

export const EMPLOYEE_HEADERS: TableHeader[] = [
  { key: 'employeeId', label: 'Employee ID' },
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'department', label: 'Department' },
  { key: 'position', label: 'Position' },
  { key: 'salary', label: 'Salary' },
  { key: 'hireDate', label: 'Hire Date' },
  { key: 'isActive', label: 'Active' },
  { key: 'skills', label: 'Skills' }
];

export const PRODUCT_HEADERS: TableHeader[] = [
  { key: 'sku', label: 'SKU' },
  { key: 'productName', label: 'Product Name' },
  { key: 'category', label: 'Category' },
  { key: 'price', label: 'Price' },
  { key: 'stockQuantity', label: 'Stock' },
  { key: 'supplier', label: 'Supplier' },
  { key: 'lastRestocked', label: 'Last Restocked' },
  { key: 'isActive', label: 'Active' }
];

// Sample data for different types
export const SAMPLE_DOG_DATA: TTableRow[] = Array.from({ length: 15 }, (_, index) => ({
  pet: ['Bella', 'Max', 'Luna', 'Chuckie', 'Daisy'][index % 5],
  client: ['Sarah Johnson', 'Mike Davis', 'Emily Chen', 'Robert Wilson', 'Lisa Anderson'][
    index % 5
  ],
  lodging: ['Kennel A3', 'Kennel B5', 'Kennel C7', 'Kennel D9', 'Kennel E11'][index % 5],
  locker: ['Locker 1', 'Locker 2', 'Locker 3', 'Locker 4', 'Locker 5'][index % 5],
  checkIn: ['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM'][index % 5],
  checkOut: ['3:00 PM', '4:00 PM', '5:00 PM', '8:00 PM', '9:00 PM'][index % 5],
  services: ['Grooming', 'Vaccination', 'Training', 'Wellness Checkup', 'Dental Cleaning'][
    index % 5
  ],
  belongings: ['Collar', 'Leash', 'Leash', 'Leash', 'Leash'][index % 5],
  details: ['Details', 'Details', 'Details', 'Details', 'Details'][index % 5]
}));

export const SAMPLE_ORDER_DATA: OrderRow[] = Array.from({ length: 10 }, (_, index) => ({
  orderId: `ORD-${1000 + index}`,
  customerName: ['John Smith', 'Jane Doe', 'Bob Johnson', 'Alice Brown', 'Chuckie Wilson'][
    index % 5
  ],
  customerEmail: [
    'john@email.com',
    'jane@email.com',
    'bob@email.com',
    'alice@email.com',
    'Chuckie@email.com'
  ][index % 5],
  orderDate: ['2024-01-15', '2024-01-16', '2024-01-17', '2024-01-18', '2024-01-19'][index % 5],
  totalAmount: [299.99, 149.5, 899.0, 45.99, 199.99][index % 5],
  status: (['pending', 'completed', 'cancelled'] as const)[index % 3],
  items: [
    ['Laptop', 'Mouse'],
    ['Headphones'],
    ['Keyboard', 'Monitor', 'Cable'],
    ['Phone Case'],
    ['Tablet', 'Stylus']
  ][index % 5],
  shippingAddress: ['123 Main St', '456 Oak Ave', '789 Pine Rd', '321 Elm St', '654 Maple Dr'][
    index % 5
  ],
  paymentMethod: ['Credit Card', 'PayPal', 'Bank Transfer', 'Apple Pay', 'Google Pay'][index % 5],
  isRush: index % 3 === 0
}));

export const SAMPLE_EMPLOYEE_DATA: EmployeeRow[] = Array.from({ length: 8 }, (_, index) => ({
  employeeId: `EMP-${100 + index}`,
  firstName: ['John', 'Jane', 'Bob', 'Alice', 'Chuckie', 'Diana', 'Eve', 'Frank'][index],
  lastName: ['Smith', 'Doe', 'Johnson', 'Brown', 'Wilson', 'Davis', 'Miller', 'Garcia'][index],
  department: ['Engineering', 'Marketing', 'Sales', 'HR', 'Operations'][index % 5],
  position: [
    'Senior Developer',
    'Marketing Manager',
    'Sales Rep',
    'HR Specialist',
    'Operations Lead'
  ][index % 5],
  salary: [75000, 85000, 65000, 70000, 80000, 90000, 95000, 100000][index],
  hireDate: ['2020-01-15', '2021-03-20', '2019-08-10', '2022-05-12', '2023-02-28'][index % 5],
  isActive: index % 7 !== 0, // Most are active
  skills: [
    ['React', 'TypeScript', 'Node.js'],
    ['SEO', 'Content Marketing'],
    ['CRM', 'Lead Generation'],
    ['Recruiting', 'Training'],
    ['Project Management', 'Process Improvement']
  ][index % 5]
}));

export const SAMPLE_PRODUCT_DATA: ProductRow[] = Array.from({ length: 12 }, (_, index) => ({
  sku: `SKU-${1000 + index}`,
  productName: [
    'Wireless Headphones',
    'Bluetooth Speaker',
    'Phone Case',
    'Laptop Charger',
    'USB Cable',
    'Mouse Pad',
    'Keyboard',
    'Monitor Stand',
    'Webcam',
    'Microphone',
    'Tablet Stand',
    'Power Bank'
  ][index],
  category: ['Electronics', 'Accessories', 'Computers', 'Audio'][index % 4],
  price: [29.99, 79.99, 14.99, 49.99, 19.99, 12.99, 89.99, 34.99, 59.99, 39.99, 24.99, 44.99][
    index
  ],
  stockQuantity: [50, 25, 100, 75, 200, 150, 30, 80, 45, 60, 90, 40][index],
  supplier: ['TechCorp', 'GadgetPro', 'ElectroMax', 'AudioPlus'][index % 4],
  lastRestocked: ['2024-01-10', '2024-01-15', '2024-01-20', '2024-01-25'][index % 4],
  isActive: index % 8 !== 0 // Most are active
}));
