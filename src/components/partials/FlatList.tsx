import { ProgressSpinner } from "primereact/progressspinner";
import React, {
  AnimationEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";
import { Ad } from "./Ad";
import { v4 as uuidv4 } from "uuid";

export type FlatListItem<T, P> = {
  item: T;
  index: number;
  extraData: P;
  columns?: string;
  onHidden?: () => void;
  show?: boolean;
  onShown?: () => void;
};

export type FlatListProps<T = any, P = any> = {
  items: T[];
  extraData?: P;
  RenderComponent: React.FC<FlatListItem<T, P>>;
  onBottomReached?: () => void;
  hasMoreItems?: boolean;
  onHidden?: () => void;
  showItems?: boolean;
  onShown?: () => void;
  enableAds?: boolean;
  adPosition?: number;
};

const PlaceholderListItem: React.FC<FlatListItem<null, null>> = ({
  show,
  onShown,
  onHidden,
}) => {
  const animationEnd: AnimationEventHandler<HTMLLIElement> = (event) => {
    if (event.animationName === "scaleOut") {
      onHidden?.();
    }

    if (event.animationName === "scaleIn") {
      onShown?.();
    }
  };

  return (
    <li
      className={`flatlist-item  ${show ? "show" : "hide"}`}
      onAnimationEnd={animationEnd}
      style={{ visibility: "hidden" }}
    >
      <div className="row-content">placeholder</div>
    </li>
  );
};

export const FlatList: React.FC<FlatListProps> = ({
  items,
  RenderComponent,
  onBottomReached,
  hasMoreItems,
  extraData,
  onHidden,
  showItems = true,
  onShown,
  enableAds = true,
  adPosition = 3,
}) => {
  const listBottomRef = useRef<HTMLDivElement>(null);
  const bottomReached = useIntersectionObserver(listBottomRef, {
    threshold: 0,
    rootMargin: "50px",
  });
  const [hiddenItems, setHiddenItems] = useState<number>(0);
  const [shownItems, setShownItems] = useState<number>(0);

  useEffect(() => {
    if (hiddenItems === items.length) {
      onHidden?.();
      setHiddenItems(0);
    }
  }, [hiddenItems, items.length, onHidden]);

  const onItemHidden = () => {
    setHiddenItems((prevCount) => prevCount + 1);
  };

  useEffect(() => {
    if (shownItems === items.length) {
      onShown?.();
      setShownItems(0);
    }
  }, [shownItems, items.length, onShown]);

  const onItemShown = () => {
    setShownItems((prevCount) => prevCount + 1);
  };

  const listElements = items.map((item, index) => {
    if (item === null) {
      return (
        <PlaceholderListItem
          key={uuidv4()}
          item={null}
          index={index}
          onHidden={onItemHidden}
          show={showItems}
          onShown={onItemShown}
          extraData={null}
        />
      );
    }
    return (
      <RenderComponent
        item={item}
        index={index}
        key={item.id}
        extraData={extraData}
        onHidden={onItemHidden}
        show={showItems}
        onShown={onItemShown}
      />
    );
  });

  if (enableAds) {
    const element = (
      <li className="flatlist-item p-0">
        <Ad />
      </li>
    );
    listElements.splice(adPosition, 0, element);
  }

  useEffect(() => {
    if (bottomReached && hasMoreItems) onBottomReached?.();
  }, [bottomReached, hasMoreItems, onBottomReached]);

  return (
    <>
      <ol className="flatlist">{listElements}</ol>
      {hasMoreItems && (
        <div ref={listBottomRef} style={{ display: "flex" }}>
          <ProgressSpinner style={{ outerWidth: 20 }} />
        </div>
      )}
    </>
  );
};
