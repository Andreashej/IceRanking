import { Competition } from "./competition.model";
import { ScreenGroup } from "./screengroup.model";

export type BigScreen = {
  id: string;
  role: string;
  clientId?: string;
  screenGroupId?: string | null;
  competitionId?: string;
  rootFontSize: string | null;

  screenGroup?: ScreenGroup;
  competition?: Competition;
};
