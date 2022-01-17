import { RankingList } from "./rankinglist.model";
import { RankingResult } from "./rankingresult.model";
import { Task } from "./task.model";

export type Ranking = {
    id: number;
    testcode: string;
    rankinglistId: number;
    includedMarks: number;
    order: "desc" | "asc";
    grouping: "rider" | "horse";
    minMark: number;
    roundingPrecision: number;
    markType: "mark" | "time";

    rankinglist?: RankingList;
    results?: RankingResult[];
    tasksInProgress?: Task[];
}