import { Competition } from "./competition.model";
import { RankingList } from "./rankinglist.model";
import { Result } from "./result.model";

export type Test = {
    id: number;
    testcode: string;
    testName: string;
    competitionId: number;
    roundingPrecision: number;
    order: "asc" | "desc";
    markType: "mark" | "time";
    sponsorLogo?: string;

    competition?: Competition;
    results?: Result[];
    includeInRanking?: RankingList[];
}