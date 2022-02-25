import { Horse } from "./horse.model";
import { Person } from "./person.model";
import { Test } from "./test.model";

export type StartListEntry = {
    id: number;
    state: string;
    riderId: number;
    horseId: number;
    testId: number;
    sta: number;
    startGroup: number;
    color: string;

    test?: Test;
    horse?: Horse;
    rider?: Person;
}