import React, { createContext, useEffect, useState, useContext } from 'react';
import { getRankingList, getRankingLists, patchRankingList } from '../services/v2/rankinglist.service';
import { ResourceContext } from '../models/resource-context.model';
import { RankingList } from '../models/rankinglist.model';

type RankingListContext = ResourceContext<RankingList>;

const RankingListContext = createContext<RankingListContext | undefined>(undefined);

type RankingListProviderProps = {
    rankingListId?: number;
    rankingListShortname?: string;
}

export const RankingListProvider: React.FC<RankingListProviderProps> = ({rankingListId, rankingListShortname, children}) => {
    const [rankingList, setRankingList] = useState<RankingList>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>();
    const [isChanged, setIsChanged] = useState<boolean>(false);
    
    const saveRankingList: RankingListContext['save'] = async () => {
        if (!rankingList) return;

        try {
            const savedRankingList = await patchRankingList(rankingList);
            setRankingList((prevRankingList) => {
                return {
                    ...prevRankingList,
                    ...savedRankingList
                }
            });
            setIsChanged(false);
        } catch (error: unknown) {
            console.log(error);
        }
    }

    const updateRankingList: RankingListContext['update'] = (updatedFields) => {
        if (!rankingList) return;
        
        setRankingList((prevRankingList) => {
            if (!prevRankingList) return;

            return {
                ...prevRankingList,
                ...updatedFields
            }
        });
        setIsChanged(true);
    }

    useEffect(() => {
        if (rankingListId) {
            const fetchRankingList = async (): Promise<void> => {
                try {
    
                    const rankingList = await getRankingList(rankingListId);
                    setRankingList(rankingList);
                } catch (error : unknown) {
                    setRankingList(undefined);
                    setError(error as string);
                } finally {
                    setLoading(false);
                }
            }
    
            setLoading(true);
            setError(undefined);
            fetchRankingList();
        }
    }, [rankingListId])

    useEffect(() => {
        if (rankingListShortname) {
            const fetchRankingList = async (): Promise<void> => {
                try {
                    const params = new URLSearchParams({
                        'filter[]': `shortname == ${rankingListShortname}`,
                        'expand': 'tests'
                    });

                    const [rankingLists] = await getRankingLists(params);
                    if (rankingLists.length > 0) {
                        setRankingList(rankingLists[0]);
                    }
                } catch (error : unknown) {
                    setRankingList(undefined);
                    setError(error as string);
                } finally {
                    setLoading(false);
                }
            }
    
            setLoading(true);
            setError(undefined);
            fetchRankingList();
        }
    }, [rankingListShortname])
    
    return (
        <RankingListContext.Provider value={{
            resource: rankingList,
            update: updateRankingList,
            save: saveRankingList,
            loading,
            error,
            isChanged,
        }}>
            {children}
        </RankingListContext.Provider>
    )
}

export const useRankingListContext = (): RankingListContext => {
    const context = useContext(RankingListContext);

    if (context === undefined) {
        throw new Error('Missing RankingListContext');
    }

    return context;
}

export const useRankingList = (): [RankingList?, RankingListContext['update']?, RankingListContext['save']?, RankingListContext['isChanged']?] => {
    const context = useRankingListContext();

    return [context.resource, context.update, context.save, context.isChanged];
}