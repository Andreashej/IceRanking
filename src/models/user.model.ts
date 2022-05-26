import { Person } from "./person.model";

export type User = {
    id: number;
    username: string;
    superUser: boolean;
    person?: Person;
}