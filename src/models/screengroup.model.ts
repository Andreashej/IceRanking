import { BigScreen } from "./bigscreen.model";
import { Competition } from "./competition.model";

export type ScreenGroup = {
  id: string;
  template: string;
  name: string;
  competitionId: string;
  showOsd: boolean;
  testId?: number;

  screens?: BigScreen[];
  competition?: Competition;
};
