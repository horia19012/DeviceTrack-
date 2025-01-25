import {Role} from './Role';

export interface User {
  id: number;
  userName: string;
  role: Role;
  email: string;
  password: string;
}
