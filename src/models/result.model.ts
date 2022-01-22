import { Horse } from "./horse.model";
import { Person } from "./person.model";
import { Test } from "./test.model";

export type Result = {
    id: number;
    mark: number;
    state: string;
    riderId: number;
    horseId: number;
    testId: number;
    rank: number;

    test?: Test;
    horse?: Horse;
    rider?: Person;
}