import { Person } from "./person.model";

export type PersonAlias = {
    id?: number;
    alias?: string;
    personId?: number;

    person?: Person;
}