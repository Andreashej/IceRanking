import React, { createContext, useEffect, useState, useContext } from 'react';
import { getRankingList, patchRankingList } from '../services/v2/rankinglist.service';
import { ResourceContext } from '../models/resource-context.model';
import { RankingList } from '../models/rankinglist.model';

type RankingListContext = ResourceContext<RankingList>;

const RankingListContext = createContext<RankingListContext | undefined>(undefined);

type RankingListProviderProps = {
    rankingListId: number;
}

export const RankingListProvider: React.FC<RankingListProviderProps> = ({rankingListId, children}) => {
    const [rankingList, setRankingList] = useState<RankingList>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>();
    
    const saveRankingList: RankingListContext['save'] = async (updatedFields) => {
        const updatedRankingList = {...rankingList, ...updatedFields} as RankingList;

        if (!updatedRankingList) return;

        try {
            const savedRankingList = await patchRankingList(updatedRankingList);
            setRankingList((prevRankingList) => {
                return {
                    ...prevRankingList,
                    ...savedRankingList
                }
            });
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
    }

    useEffect(() => {
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
    }, [rankingListId])
    
    return (
        <RankingListContext.Provider value={{
            resource: rankingList,
            update: updateRankingList,
            save: saveRankingList,
            loading,
            error,
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

export const useRankingList = (): [RankingList?, RankingListContext['update']?, RankingListContext['save']?] => {
    const context = useRankingListContext();

    return [context.resource, context.update, context.save];
}