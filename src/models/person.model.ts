import { PersonAlias } from "./personalias.model";
import { User } from "./user.model";

export type Person = {
  id?: string;
  firstName?: string;
  lastName?: string;
  numberOfResults?: number;
  userId?: number;
  email?: string;
  ageGroup?: string;
  team?: string;

  testlist?: string[];
  user?: User;
  aliases?: PersonAlias[];
};
