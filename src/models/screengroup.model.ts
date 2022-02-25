import { BigScreen } from "./bigscreen.model";
import { Competition } from "./competition.model";
import { Test } from "./test.model";

export type ScreenGroup = {
    id: number;
    template: string;
    name: string;
    competitionId: number;
    testId: number;
    
    screens?: BigScreen[];
    competition?: Competition;
    test?: Test;
}