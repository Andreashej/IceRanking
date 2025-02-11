import React, {
  createContext,
  useEffect,
  useState,
  useContext,
  useCallback,
} from "react";
import {
  getRankingList,
  patchRankingList,
} from "../services/v3/rankinglist.service";
import { ResourceContext } from "../models/resource-context.model";
import { RankingList } from "../models/rankinglist.model";

type RankingListContext = ResourceContext<RankingList>;

const RankingListContext = createContext<RankingListContext | undefined>(
  undefined
);

type RankingListProviderProps = {
  id?: string;
  slug?: string;
};

export const RankingListProvider: React.FC<RankingListProviderProps> = ({
  id,
  slug,
  children,
}) => {
  const [rankingList, setRankingList] = useState<RankingList>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>();
  const [isChanged, setIsChanged] = useState<boolean>(false);

  const saveRankingList: RankingListContext["save"] = async () => {
    if (!rankingList) return;

    try {
      const savedRankingList = await patchRankingList(rankingList);
      setRankingList((prevRankingList) => {
        return {
          ...prevRankingList,
          ...savedRankingList,
        };
      });
      setIsChanged(false);
    } catch (error: unknown) {
      console.log(error);
    }
  };

  const updateRankingList: RankingListContext["update"] = (updatedFields) => {
    if (!rankingList) return;

    setRankingList((prevRankingList) => {
      if (!prevRankingList) return;

      return {
        ...prevRankingList,
        ...updatedFields,
      };
    });
    setIsChanged(true);
  };

  const fetchRankingList = useCallback(async (): Promise<void> => {
    try {
      if (!id && !slug) {
        throw new Error("No id or slug provided");
      }

      const rankingList = await getRankingList(id ?? slug ?? "");
      setRankingList(rankingList);
    } catch (error: unknown) {
      setRankingList(undefined);
      setError(error as string);
    } finally {
      setLoading(false);
    }
  }, [id, slug]);

  useEffect(() => {
    setLoading(true);
    setError(undefined);
    fetchRankingList();
  }, [id, slug, fetchRankingList]);

  return (
    <RankingListContext.Provider
      value={{
        resource: rankingList,
        update: updateRankingList,
        save: saveRankingList,
        fetch: fetchRankingList,
        loading,
        error,
        isChanged,
      }}
    >
      {children}
    </RankingListContext.Provider>
  );
};

export const useRankingListContext = (): RankingListContext => {
  const context = useContext(RankingListContext);

  if (context === undefined) {
    throw new Error("Missing RankingListContext");
  }

  return context;
};

export const useRankingList = (): [
  RankingList?,
  RankingListContext["update"]?,
  RankingListContext["save"]?,
  RankingListContext["isChanged"]?
] => {
  const context = useRankingListContext();

  return [context.resource, context.update, context.save, context.isChanged];
};
