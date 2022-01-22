import { User } from "./user.model";

export type Person = {
    id?: number,
    firstname?: string;
    lastname?: string;
    fullname?: string;
    numberOfResults?: number;
    userId?: number;

    testlist?: string[];
    user?: User;
}