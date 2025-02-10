import { Horse } from "./horse.model";
import { Ranking } from "./ranking.model";
import { Person } from "./person.model";

export type RankingResult = {
  id: string;
  rank: number;
  mark: number;
  testid: string;
  riderId: string | null;
  horseid: string | null;

  // Expandable attributes
  test?: Ranking;
  rider?: Person | null;
  horse?: Horse | null;
};
