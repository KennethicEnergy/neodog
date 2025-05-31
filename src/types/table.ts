export type TTableRow = {
  date: string;
  client: string;
  pet: string;
  task: string;
  assignedTo: string;
  status: string;
};

export type TTableData = {
  title?: string;
  icon?: string;
  data: TTableRow[];
};