import { Person } from "./person.model";
import { Test } from "./test.model";
import { User } from "./user.model";

export type Competition = {
  id?: string;
  name?: string;
  startDate?: Date;
  endDate?: Date;
  country?: string;
  status?: string;
  contactPersonId?: number;
  isAdmin?: boolean;

  tests?: Test[];
  contactPerson?: Person;
  adminUsers?: User[];
};
