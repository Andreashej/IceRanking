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
    scope?: "A" | "B" | null;

    test?: Test;
    horse?: Horse;
    rider?: Person;
    marks?: Array<JudgeMark>;
}

type BaseMark = {
    id: number | string;
    markType: "mark" | "flag" | "time";
    type: "judge" | "section";
    judgeNo: number;
    judgeId: string;

    sectionMarkId: number | null;
    
    mark: number;
    flagOk: boolean;
    
    redCard: boolean;
    yellowCard: boolean;
    blueCard: boolean
}

export type JudgeMark = BaseMark & {
    resultId: number | null;
    
    result?: Result;
    sectionMarks?: SectionMark[]
}

export type SectionMark = BaseMark & {
    sectionNo: number;
    judgeMarkId: number;
}