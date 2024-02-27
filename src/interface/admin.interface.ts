import { timeStamp } from './shared/timestamp.interface';

export interface Admin extends timeStamp {
  _id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isActive: boolean;
  isValidPassword: Function;
}
