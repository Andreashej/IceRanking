import { BigScreen } from "./bigscreen.model";
import { Competition } from "./competition.model";

export type ScreenGroup = {
    id: number;
    template: string;
    name: string;
    competitionId: number;
    showOsd: boolean;
    testId?: number;
    
    screens?: BigScreen[];
    competition?: Competition;
}