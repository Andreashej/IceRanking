import { Person } from "./person.model";
import { Test } from "./test.model";
import { User } from "./user.model";

export type Competition = {
    id?: number;
    name?: string;
    firstDate?: Date;
    lastDate?: Date;
    country?: string;
    state?: string;
    extId?: string;
    contactPersonId?: number;
    isAdmin?: boolean;

    tests?: Test[];
    contactPerson?: Person;
    adminUsers?: User[];
}