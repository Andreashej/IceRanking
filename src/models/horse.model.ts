export type Horse = {
  id: string;
  feifId: string;
  horseName: string;
  lastLookup: Date;
  lookupError: boolean | null;
  numberOfResults: number;
  testlist: string[];
};
