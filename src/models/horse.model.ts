export type Horse = {
    id: number;
    feifId: string;
    horseName: string;
    lastLookup: Date;
    lookupError: boolean | null
    numberOfResults: number;
    testlist: string[];
}