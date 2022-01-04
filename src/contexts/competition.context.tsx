import { Competition } from "../models/competition.model";
import React, { createContext, useEffect, useState, useContext, useMemo } from 'react';
import { getCompetition, patchCompetition } from '../services/v2/competition.service';
import { ProgressSpinner } from "primereact/progressspinner";
import Page from "../components/partials/Page";
import { dateToString } from "../tools";

interface CompetitionContext {
    competition?: Competition;
    setCompetition: (competition: Competition) => Promise<void>;
    loading: boolean;
    error?: string;
}

const CompetitionContext = createContext<CompetitionContext | undefined>(undefined);

type CompetitionProviderProps = {
    competitionId: number;
}

export const CompetitionProvider: React.FC<CompetitionProviderProps> = ({competitionId, children}) => {
    const [competition, setCompetition] = useState<Competition>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>();

    const fetchCompetition = async (): Promise<void> => {
        try {
            const params = new URLSearchParams();
            params.append('expand', 'tests');

            const competition = await getCompetition(competitionId, params);
            setCompetition(competition);
        } catch (error : unknown) {
            setError(error as string);
        } finally {
            setLoading(false);
        }
    }

    const updateCompetition: CompetitionContext['setCompetition'] = async (competition) => {
        try {
            setCompetition(competition);
            await patchCompetition(competition);
        } catch (error: unknown) {
            console.log(error);
        }
    }

    useEffect(() => {
        setLoading(true);
        setError(undefined);
        fetchCompetition();
    }, [competitionId])


    
    return (
        <CompetitionContext.Provider value={{
            competition,
            setCompetition: updateCompetition,
            loading,
            error,
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

export const useCompetition = (): [Competition, CompetitionContext['setCompetition']] => {
    const context = useContext(CompetitionContext);

    if (context === undefined || !context.competition) {
        throw new Error('Missing CompetitionContext');
    }

    return [context.competition, context.setCompetition];
}