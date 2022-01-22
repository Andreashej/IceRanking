import { Competition } from "./competition.model";
import { RankingList } from "./rankinglist.model";
import { Result } from "./result.model";

export type Test = {
    id: number;
    testcode: string;
    competitionId: number;
    roundingPrecision: number;
    order: "asc" | "desc";
    markType: "mark" | "time";

    competition?: Competition;
    results?: Result[];
    includeInRanking?: RankingList[];
}