import React from "react";
import { AnimatedFlatList } from "./components/AnimatedFlatList";
import { Result, SectionMark } from "../../../models/result.model";
import { LowerThird } from "./components/LowerThird";
import { markToDouble } from "../../../tools";
import { JudgeCard } from "./components/JudgeCard";
import { FlatListItem } from "../../../components/partials/FlatList";
import { Test } from "../../../models/test.model";
import { Flag } from "./components/Flag";

type SectionMarksEntry = Result & {
  sectionMarks: SectionMark[];
};

type Section = {
  sectionName: string;
  sectionNo: number;
  test: Test;
};

type SectionMarksProps = {
  section: Section;
  group: SectionMarksEntry[];
};

const SectionMarksLowerThird: React.FC<
  FlatListItem<SectionMarksEntry, Section>
> = ({ item: result, onHidden, show, extraData: section }) => {
  const marks = result.sectionMarks?.map((sectionMark) => {
    const m = markToDouble(
      sectionMark.mark,
      section.test.roundingPrecision - 1
    );

    return (
      <div className="sign" key={`${sectionMark.judgeNo}.${result.entryId}`}>
        <div className="judge-mark">{m}</div>
        {sectionMark.redCard && <JudgeCard color="red" />}
        {sectionMark.yellowCard && <JudgeCard color="yellow" />}
        {sectionMark.blueCard && <JudgeCard color="blue" />}
      </div>
    );
  });

  const finalMark = (
    <>
      {/* <div style={{ backgroundColor: "var(--blue)" }}>
            <span className="light mr-2">Rank</span>
            <span>{result.rank}</span>
        </div> */}
      <div>
        <span className="light mr-2">Total</span>
        <span>{result.score}</span>
      </div>
    </>
  );

  return (
    <LowerThird
      header={
        <>
          {result?.entry?.participant?.equipage?.rider?.person?.firstName}{" "}
          {result?.entry?.participant?.equipage?.rider?.person?.lastName}
          <Flag
            countryCode={result?.entry?.participant?.team ?? ""}
            style={{
              height: "1em",
              marginLeft: "auto",
            }}
          />
        </>
      }
      color={result?.entry?.color}
      onHidden={onHidden}
      show={show}
      className="flatlist-item"
      gridTemplateColumns={`repeat(${result.sectionMarks?.length},20%)`}
      tag={section.sectionName}
      footer={finalMark}
    >
      {marks}
    </LowerThird>
  );
};

export const SectionMarks: React.FC<SectionMarksProps> = ({
  group,
  section,
}) => {
  console.log(group.length);
  return (
    <AnimatedFlatList
      items={group}
      RenderComponent={SectionMarksLowerThird}
      extraData={section}
      itemsPerPage={1}
      timePerPage={100000}
      repeat={false}
    />
  );
};
