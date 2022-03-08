import { Person } from "./person.model";
import { Test } from "./test.model";

export type Competition = {
    id?: number;
    name?: string;
    firstDate?: Date;
    lastDate?: Date;
    country?: string;
    state?: string;
    extId?: string;
    contactPersonId?: number;

    tests?: Test[];
    contactPerson?: Person;
}