import { Competition } from "../models/competition.model";
import React, { createContext, useEffect, useState, useContext, useCallback } from 'react';
import { getCompetition, patchCompetition } from '../services/v2/competition.service';
import { ResourceContext } from "../models/resource-context.model";
import { Test } from "../models/test.model";

export type CompetitionProps = Required<Competition>

type CompetitionContext = ResourceContext<CompetitionProps>;

const CompetitionContext = createContext<CompetitionContext | undefined>(undefined);

type CompetitionProviderProps = {
    competitionId: number;
}

export const CompetitionProvider: React.FC<CompetitionProviderProps> = ({competitionId, children}) => {
    const [competition, setCompetition] = useState<CompetitionProps>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>();
    const [isChanged, setIsChanged] = useState<boolean>(false);
    
    const saveCompetition: CompetitionContext['save'] = async () => {
        if (!competition) return;

        try {
            const savedCompetition = await patchCompetition(competition) as CompetitionProps;
            setCompetition((prev) => {
                return {
                    ...prev,
                    ...savedCompetition
                }
            });
            setIsChanged(false);
        } catch (error: unknown) {
            console.log(error);
        }
    }

    const updateCompetition: CompetitionContext['update'] = (updatedFields) => {
        if (!competition) return;
        
        setCompetition((c) => {
            if (!c) return;

            return {
                ...c,
                ...updatedFields
            }
        });
        setIsChanged(true);
    }

    const fetchCompetition = useCallback(async (): Promise<void> => {
        try {
            const params = new URLSearchParams();
            params.append('expand', 'tests,contactPerson');

            const competition = await getCompetition(competitionId, params) as CompetitionProps;
            setCompetition(competition);
        } catch (error : unknown) {
            setCompetition(undefined);
            setError(error as string);
        } finally {
            setLoading(false);
        }
    }, [competitionId]);

    useEffect(() => {

        setLoading(true);
        setError(undefined);
        fetchCompetition();
    }, [competitionId, fetchCompetition])
    
    return (
        <CompetitionContext.Provider value={{
            resource: competition,
            update: updateCompetition,
            save: saveCompetition,
            fetch: fetchCompetition,
            loading,
            error,
            isChanged,
        }}>
            {children}
        </CompetitionContext.Provider>
    )
}

export const useCompetitionContext = (): CompetitionContext => {
    const context = useContext(CompetitionContext);

    if (context === undefined) {
        throw new Error('Missing CompetitionContext');
    }

    return context;
}

export const useCompetition = (): [CompetitionContext['resource']?, CompetitionContext['update']?, CompetitionContext['save']?, CompetitionContext['isChanged']?] => {
    const context = useCompetitionContext();

    return [context.resource, context.update, context.save, context.isChanged];
}

export const useTest = (testcode: string): Test | undefined => {
    const context = useCompetitionContext();

    const test = context.resource?.tests?.find((test) => test.testcode === testcode);

    return test;
}