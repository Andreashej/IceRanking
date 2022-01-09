import { Horse } from "./horse.model";
import { Ranking } from "./ranking.model";
import { Rider } from "./rider.model";

export type RankingResult = {
    id: number;
    rank: number;
    mark: number;
    testId: number;
    riderId: number | null;
    horseId: number | null;

    // Expandable attributes
    test?: Ranking;
    rider?: Rider | null;
    horse?: Horse | null;
}