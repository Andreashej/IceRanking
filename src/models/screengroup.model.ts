import { BigScreen } from "./bigscreen.model";
import { Competition } from "./competition.model";

export type ScreenGroup = {
    id: number;
    template: string;
    competitionId: number;
    
    screens?: BigScreen[];
    competition?: Competition;
}