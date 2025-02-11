import { Ranking } from "./ranking.model";

export type RankingList = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;

  rankings?: Ranking[];
};
