import { Competition } from "./competition.model";
import { Ranking } from "./ranking.model";
import { RankingList } from "./rankinglist.model";

export type Task = {
    id: string;
    name: string,
    description: string;
    competitionId: number;
    rankinglistTestId: number;
    rankinglistId: number;
    complete: boolean;
    createdAt: Date;
    startedAt: Date;
    completedAt: Date;
    error: boolean;
    state: string;
    progress: number;

    // Expandable props
    competition?: Competition | null;
    rankingListTest?: Ranking | null;
    rankinglist: RankingList | null;
}