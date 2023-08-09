import React, { AnimationEventHandler, useMemo } from "react";
import { FlatListItem } from "../../../components/partials/FlatList";
import { StartListEntry } from "../../../models/startlist.model";
import { Test } from "../../../models/test.model";
import { AnimatedFlatList } from "./components/AnimatedFlatList";
import { Flag } from "./components/Flag";

type Phase = "PREL" | "AFIN" | "BFIN" | "CFIN" | "FIN";

const LIGHT_BACKGROUNDS = ["white", "yellow"];

const StartListItem: React.FC<FlatListItem<StartListEntry, Phase>> = ({
  item,
  show,
  onHidden,
  onShown,
  extraData: phase,
}) => {
  const animationEnd: AnimationEventHandler<HTMLLIElement> = (event) => {
    if (event.animationName === "scaleOut") {
      onHidden?.();
    }

    if (event.animationName === "scaleIn") {
      onShown?.();
    }
  };

  const textColor = LIGHT_BACKGROUNDS.includes(item.color) ? "black" : "white";

  return (
    <li
      className={`flatlist-item ${show ? "show" : "hide"}`}
      style={{ gridTemplateColumns: "1fr 1rem" }}
      onAnimationEnd={animationEnd}
    >
      <div className="row-content">
        <div
          className="row-marker"
          style={{
            backgroundColor:
              phase !== "PREL" ? `var(--${item.color})` : "var(--blue)",
            color: textColor,
          }}
        >
          {item.startGroup}
        </div>
        <div>{item.rider?.fullname}</div>
        <div>{item.horse?.horseName}</div>
        <div className="text-right">
          {item.rider?.ageGroup?.split(" ").map((word) => word[0])}
          <Flag
            countryCode={item.rider?.team ?? ""}
            style={{
              marginLeft: ".5em",
              height: "1em",
            }}
          />
        </div>
      </div>
    </li>
  );
};

type StartListProps = {
  startList: StartListEntry[];
  test: Test;
  phase: Phase;
};

export const StartList: React.FC<StartListProps> = ({
  startList,
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
          <span>
            {test.testName} {phaseText}
          </span>
          -<small>Start List</small>
        </>
      }
      headerImg={test.sponsorLogo ?? "assets/img/ICeCompass_Logo_Final6.png"}
      items={startList}
      RenderComponent={StartListItem}
      itemsPerPage={10}
      extraData={phase}
      timePerPage={15000}
    />
  );
};
