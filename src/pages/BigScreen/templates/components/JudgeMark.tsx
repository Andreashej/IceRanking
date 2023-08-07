import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { PropsWithChildren, useMemo } from "react";
import { JudgeMark, Result } from "../../../../models/result.model";
import { Test } from "../../../../models/test.model";
import { markToDouble } from "../../../../tools";
import { JudgeCard, judgeNoToLetter } from "./JudgeCard";

type MarkProps = {
  mark: JudgeMark;
  test: Test;
  result: Result;
};

const Badge: React.FC<PropsWithChildren<{ cards?: JSX.Element }>> = ({
  children,
  cards,
}) => {
  return (
    <div className="sign">
      <div className="judge-mark">{children}</div>
      {cards}
    </div>
  );
};

export const Mark: React.FC<MarkProps> = ({ mark, test, result }) => {
  const m = markToDouble(mark.mark, test.roundingPrecision - 1);

  if (mark.markType === "time") {
    const roundingPrecision = test.testcode === "PP1" ? 1 : 2;
    return (
      <Badge>
        <FontAwesomeIcon
          icon="stopwatch"
          style={{ marginRight: ".125rem", fontSize: ".8em" }}
        />
        {markToDouble(mark.mark, roundingPrecision)}"
      </Badge>
    );
  }

  if (mark.markType === "flag") {
    return (
      <span
        className="sign"
        style={{
          backgroundColor: `var(--${mark.flagOk ? "green" : "red"})`,
        }}
      >
        {mark.flagOk ? "OK" : "XX"}
      </span>
    );
  }

  return (
    <Badge
      cards={
        <>
          {mark.redCard && <JudgeCard color="red" />}
          {mark.yellowCard && <JudgeCard color="yellow" />}
          {mark.blueCard && <JudgeCard color="blue" />}
        </>
      }
    >
      <div className="judge-mark">{m}</div>
    </Badge>
  );
};
