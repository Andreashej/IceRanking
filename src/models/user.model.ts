import { Person } from "./person.model";

export type User = {
  id: string;
  username: string;
  superUser: boolean;
  person?: Person;
};
