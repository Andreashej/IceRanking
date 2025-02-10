import { Ranking } from "./ranking.model";

export type RankingList = {
  id: string;
  listname: string;
  shortname: string;
  resultsValidDays: number;
  logoUrl: string;

  tests?: Ranking[];
};
