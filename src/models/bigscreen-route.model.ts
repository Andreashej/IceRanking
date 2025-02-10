import { Competition } from "./competition.model";
import { ScreenGroup } from "./screengroup.model";
import { Test } from "./test.model";

export type BigScreenRoute = {
  id: string;
  priority: number;
  screenGroupId: string;
  competitionId: string;
  templates: string[];

  tests?: Test[];
  screenGroup?: ScreenGroup;
  competition?: Competition;
};
