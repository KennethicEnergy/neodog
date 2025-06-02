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
};

export type TTableData = {
  title?: string;
  icon?: string;
  viewAll?: boolean;
  data: TTableRow[];
};