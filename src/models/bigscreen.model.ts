import { Competition } from "./competition.model";
import { ScreenGroup } from "./screengroup.model";

export type BigScreen = {
    id: number | null;
    clientId?: string | null;
    screenGroupId?: number | null;
    competitionId?: number | null;

    screenGroup?: ScreenGroup;
    competition?: Competition;
}