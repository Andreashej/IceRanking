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
    sta: number;
    riderClass: string;
    color: string;

    test?: Test;
    horse?: Horse;
    rider?: Person;
    marks?: Array<Mark & Flag & Time>;
}

type BaseMark = {
    markType: "mark" | "flag" | "time";
    judgeNo: number;
    judgeId: string;

    resultId: number | null;
    sectionMarkId: number | null;

    result?: Result;
    sectionMarks?: BaseMark[]

    redCard: boolean;
    yellowCard: boolean;
    blueCard: boolean
}

export type Mark = BaseMark & {
    mark: number
}

export type Flag = BaseMark & {
    isOk: boolean;
}

export type Time = BaseMark & {
    time: number;
}