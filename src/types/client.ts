import { TPet } from './pet';

export type TClient = {
  name: string;
  address: string;
  phone: string;
  email: string;
  pets: TPet[];
};
