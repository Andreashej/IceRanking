import { RankingList } from "./rankinglist.model";
import { RankingResult } from "./rankingresult.model";

export type Ranking = {
    id: number;
    testcode: number;
    rankinglistId: number;
    includedMarks: number;
    order: "desc" | "asc";
    grouping: "rider" | "horse";
    minMark: number;
    roundingPrecision: number;
    markType: "mark" | "time";

    rankinglist?: RankingList;
    results?: RankingResult[];
}