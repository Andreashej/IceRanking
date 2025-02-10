import { Competition } from "./competition.model";
import { Ranking } from "./ranking.model";
import { RankingList } from "./rankinglist.model";

export type Task = {
  id: string;
  name: string;
  description: string;
  competitionid: string;
  rankinglistTestid: string;
  rankinglistId: string;
  complete: boolean;
  createdAt: Date;
  startedAt: Date;
  completedAt: Date;
  error: boolean;
  state: string;
  progress: number;

  // Expandable props
  competition?: Competition | null;
  rankingListTest?: Ranking | null;
  rankinglist: RankingList | null;
};
