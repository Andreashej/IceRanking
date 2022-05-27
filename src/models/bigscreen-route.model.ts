import { Competition } from "./competition.model";
import { ScreenGroup } from "./screengroup.model";
import { Test } from "./test.model";

export type BigScreenRoute = {
    id: number;
    priority: number;
    screenGroupId: number;
    competitionId: number;
    templates: string[];

    tests?: Test[];
    screenGroup?: ScreenGroup;
    competition?: Competition;
}