import { Horse } from "./horse.model";
import { Person } from "./person.model";
import { Test } from "./test.model";

export type Result = {
  score: string;
  state: string;
  rank: string;

  createdAt: Date;
  updatedAt: Date;
  entryId: string;
  entry?: Entry;
  // riderId: string;
  // horseid: string;
  scope?: "A" | "B" | null;

  // horse?: Horse;
  // rider?: Person;
  marks?: Array<JudgeMark>;
};

export type Entry = {
  id: string;
  testId: string;
  test?: Test;
  color?: string;
  phase: string;

  participantId: string;
  participant?: Participant;
};

export type Participant = {
  sta: number;
  class: string | null;
  team?: string;

  equipageId: string;
  equipage?: Equipage;
};

export type Equipage = {
  id: string;
  horseId: string;
  riderId: string;
  horse?: Horse;
  rider?: Rider;
};

export type Rider = {
  id: string;
  personId: string;
  person?: Person;
};

type BaseMark = {
  id: string | string;
  markType: "mark" | "flag" | "time";
  type: "judge" | "section";
  judgeNo: number;
  judgeId: string;

  sectionMarkid: string | null;

  mark: number;
  flagOk: boolean;

  redCard: boolean;
  yellowCard: boolean;
  blueCard: boolean;
};

export type JudgeMark = BaseMark & {
  resultid: string | null;

  result?: Result;
  sectionMarks?: SectionMark[];
};

export type SectionMark = BaseMark & {
  sectionNo: number;
  judgeMarkid: string;
};
