import { PersonAlias } from "./personalias.model";
import { User } from "./user.model";

export type Person = {
    id?: number;
    firstname?: string;
    lastname?: string;
    fullname?: string;
    numberOfResults?: number;
    userId?: number;
    email?: string;
    ageGroup?: string;
    team?: string;

    testlist?: string[];
    user?: User;
    aliases?: PersonAlias[];
}