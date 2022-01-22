import { Competition } from "./competition.model";
import { Horse } from "./horse.model";
import { Person } from "./person.model";
import { RankingList } from "./rankinglist.model";

export type SearchResult = {
    searchString: string;
    type: "Competition" | "Person" | "Horse" | "RankingList";
    id: number;

    competition?: Competition;
    person?: Person;
    horse?: Horse;
    rankingList?: RankingList;

    link?: string;
}