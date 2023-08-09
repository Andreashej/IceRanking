import React, { AnimationEventHandler } from "react";
import { FlatListItem } from "../../../components/partials/FlatList";
import { StartListEntry } from "../../../models/startlist.model";
import { Test } from "../../../models/test.model";
import { AnimatedFlatList } from "./components/AnimatedFlatList";
import { Flag } from "./components/Flag";

const GroupInfo: React.FC<FlatListItem<StartListEntry, Test>> = ({
  item,
  onHidden,
  show,
}) => {
  const hide: AnimationEventHandler<HTMLDivElement> = (event) => {
    if (event.animationName === "scaleOut") {
      onHidden?.();
    }
  };

  return (
    <div
      className={`flatlist-item ${show ? "show" : "hide"}`}
      onAnimationEnd={hide}
    >
      <div
        className="row-content"
        style={{ gridTemplateColumns: "1fr min-content" }}
      >
        <div
          className="row-marker"
          style={{ backgroundColor: `var(--${item.color})` }}
        ></div>
        <div>{item.rider?.fullname}</div>
        <Flag countryCode={item.rider?.team ?? ""} style={{ height: "1em" }} />
      </div>
    </div>
  );
};

type CurrentGroupProps = {
  currentGroup: StartListEntry[];
};

export const CurrentGroup: React.FC<CurrentGroupProps> = ({ currentGroup }) => {
  return (
    <>
      <AnimatedFlatList
        items={currentGroup}
        RenderComponent={GroupInfo}
        itemsPerPage={6}
        usePlaceholder={false}
      />
    </>
  );
};
