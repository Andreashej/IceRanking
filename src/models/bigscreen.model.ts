import { Competition } from "./competition.model";
import { ScreenGroup } from "./screengroup.model";

export type BigScreen = {
    id: number;
    role: string;
    clientId?: string;
    screenGroupId?: number | null;
    competitionId?: number;
    rootFontSize: string | null;

    screenGroup?: ScreenGroup;
    competition?: Competition;
}