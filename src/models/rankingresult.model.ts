import { Horse } from "./horse.model";
import { Ranking } from "./ranking.model";
import { Person } from "./person.model";

export type RankingResult = {
  id: string;
  rank: string;
  score: string;
  testid: string;
  riderId: string | null;
  horseid: string | null;
  rankingId: string;

  // Expandable attributes
  test?: Ranking;
  rider?: Person | null;
  horse?: Horse | null;
};
