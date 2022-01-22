import { Horse } from "./horse.model";
import { Ranking } from "./ranking.model";
import { Person } from "./person.model";

export type RankingResult = {
    id: number;
    rank: number;
    mark: number;
    testId: number;
    riderId: number | null;
    horseId: number | null;

    // Expandable attributes
    test?: Ranking;
    rider?: Person| null;
    horse?: Horse | null;
}