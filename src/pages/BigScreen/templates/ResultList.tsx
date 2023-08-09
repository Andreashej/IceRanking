import React, { AnimationEventHandler, useMemo } from "react";
import { FlatListItem } from "../../../components/partials/FlatList";
import { Result } from "../../../models/result.model";
import { Test } from "../../../models/test.model";
import { markToDouble } from "../../../tools";
import { AnimatedFlatList } from "./components/AnimatedFlatList";
import { Flag } from "./components/Flag";

type Phase = "PREL" | "AFIN" | "BFIN" | "CFIN" | "FIN";

const LIGHT_BACKGROUNDS = ["white", "yellow"];

const ResultListItem: React.FC<
  FlatListItem<Result, { phase: Phase; test: Test }>
> = ({ item: result, show, onHidden, onShown, extraData }) => {
  const animationEnd: AnimationEventHandler<HTMLLIElement> = (event) => {
    if (event.animationName === "scaleOut") {
      onHidden?.();
    }

    if (event.animationName === "scaleIn") {
      onShown?.();
    }
  };

  const textColor = LIGHT_BACKGROUNDS.includes(result.color)
    ? "black"
    : "white";

  return (
    <li
      className={`flatlist-item ${show ? "show" : "hide"}`}
      style={{ gridTemplateColumns: "1fr 1rem" }}
      onAnimationEnd={animationEnd}
    >
      <div
        className="row-content"
        style={{
          gridTemplateColumns: "1fr 1fr 4ch 4ch",
        }}
      >
        <div
          className="row-marker"
          style={{
            backgroundColor:
              extraData.phase !== "PREL" && extraData.phase !== "FIN"
                ? `var(--${result.color})`
                : "var(--blue)",
            color: textColor,
          }}
        >
          {result.rank}
        </div>
        <div>{result.rider?.fullname}</div>
        <div>{result.horse?.horseName}</div>
        <div className="text-right">
          <b>
            {markToDouble(result.mark, extraData.test?.roundingPrecision ?? 2)}
          </b>
        </div>
        <Flag
          countryCode={result.rider?.team ?? ""}
          style={{
            marginLeft: "auto",
            height: "1em",
          }}
        />
      </div>
      {result.scope && (
        <div className={`row-end-marker ${result.scope.toLowerCase()}`}>
          {result.scope[0]}
        </div>
      )}
    </li>
  );
};

type ResultListProps = {
  results: Result[];
  test: Test;
  phase: Phase;
};

export const ResultList: React.FC<ResultListProps> = ({
  results,
  test,
  phase,
}) => {
  const phaseText = useMemo(() => {
    switch (phase) {
      case "PREL":
        return "Preliminary";
      case "AFIN":
        return "A-final";
      case "BFIN":
        return "B-final";
      case "CFIN":
        return "C-final";
      default:
        return "";
    }
  }, [phase]);

  return (
    <AnimatedFlatList
      header={
        <>
          {test.testName} {phaseText} - <small>Results</small>
        </>
      }
      headerImg={test.sponsorLogo ?? "assets/img/ICeCompass_Logo_Final6.png"}
      items={results}
      RenderComponent={ResultListItem}
      itemsPerPage={10}
      extraData={{ phase, test }}
      timePerPage={15000}
    />
  );
};
