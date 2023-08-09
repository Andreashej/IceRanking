import React from "react";
import { FlatListItem } from "../../../components/partials/FlatList";
import { Result } from "../../../models/result.model";
import { StartListEntry } from "../../../models/startlist.model";
import { Test } from "../../../models/test.model";
import { markToDouble } from "../../../tools";
import { AnimatedFlatList } from "./components/AnimatedFlatList";
import { Mark } from "./components/JudgeMark";
import { LowerThird } from "./components/LowerThird";
import { Flag } from "./components/Flag";

const EquipageResult: React.FC<FlatListItem<Result, Test>> = ({
  item: result,
  onHidden,
  show,
  extraData: test,
}) => {
  const marks = result.marks?.map((mark) => (
    <Mark key={mark.id} mark={mark} test={test} result={result} />
  ));

  const finalMark = (
    <>
      <div style={{ backgroundColor: "var(--blue)" }}>
        <span className="light mr-2">Rank</span>
        <span>{result.rank}</span>
      </div>
      <div>
        <span className="light mr-2">Total</span>
        <span>{markToDouble(result.mark, test.roundingPrecision)}</span>
      </div>
    </>
  );

  return (
    <LowerThird
      header={
        <>
          {result.rider?.fullname}
          <Flag
            countryCode={result.rider?.team ?? ""}
            style={{
              height: "1em",
              marginLeft: "auto",
            }}
          />
        </>
      }
      color={result.color}
      onHidden={onHidden}
      show={show}
      className="flatlist-item"
      // gridTemplateColumns={`repeat(${result.marks?.length},1fr)`}
      footer={finalMark}
    >
      {marks}
    </LowerThird>
  );
};

const EquipageInfo: React.FC<FlatListItem<StartListEntry, Test>> = ({
  item,
  onHidden,
  show,
}) => {
  return (
    <LowerThird
      header={
        <>
          {item.rider?.fullname}
          <Flag
            countryCode={item.rider?.team ?? ""}
            style={{
              height: "1em",
              marginLeft: "auto",
            }}
          />
        </>
      }
      color={item.color}
      onHidden={onHidden}
      show={show}
      className="flatlist-item"
      gridTemplateColumns="2fr min-content"
    >
      <div>
        <span className="mr-4">{item.horse?.horseName}</span>
        <span className="light">{item.horse?.feifId}</span>
      </div>
      <div>
        <span>{item.rider?.ageGroup}</span>
      </div>
    </LowerThird>
  );
};

type CurrentEquipageProps = {
  type: "info" | "result";
  currentGroup: StartListEntry[] | Result[];
  test: Test;
};

export const CurrentEquipage: React.FC<CurrentEquipageProps> = ({
  type,
  currentGroup,
  test,
}) => {
  const renderTemplate = type === "info" ? EquipageInfo : EquipageResult;

  return (
    <>
      <AnimatedFlatList
        extraData={test}
        items={currentGroup}
        RenderComponent={renderTemplate}
        itemsPerPage={1}
        timePerPage={10000}
        usePlaceholder={false}
      />
    </>
  );
};
