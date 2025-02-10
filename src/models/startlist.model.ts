import { Horse } from "./horse.model";
import { Person } from "./person.model";
import { Test } from "./test.model";

export type StartListEntry = {
  id: string;
  state: string;
  riderId: string;
  horseid: string;
  testid: string;
  sta: number;
  startGroup: number;
  color: string;

  test?: Test;
  horse?: Horse;
  rider?: Person;
};
