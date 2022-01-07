import { Competition } from "../models/competition.model";
import React, { createContext, useEffect, useState, useContext } from 'react';
import { getCompetition, patchCompetition } from '../services/v2/competition.service';

interface CompetitionContext {
    competition?: Competition;
    updateCompetition: (competition: Partial<Competition>) => Promise<void>;
    loading: boolean;
    error?: string;
}

const competitionContext = createContext<CompetitionContext | undefined>(undefined);

type CompetitionProviderProps = {
    competitionId: number;
}

export const CompetitionProvider: React.FC<CompetitionProviderProps> = ({competitionId, children}) => {
    const [competition, setCompetition] = useState<Competition>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>();
    
    const updateCompetition: CompetitionContext['updateCompetition'] = async (competition) => {
        try {
            const updatedCompetition = await patchCompetition(competition);
            setCompetition(updatedCompetition);
        } catch (error: unknown) {
            console.log(error);
        }
    }

    useEffect(() => {
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

        setLoading(true);
        setError(undefined);
        fetchCompetition();
    }, [competitionId])
    
    return (
        <competitionContext.Provider value={{
            competition,
            updateCompetition,
            loading,
            error,
        }}>
            {children}
        </competitionContext.Provider>
    )
}

export const useCompetitionContext = (): CompetitionContext => {
    const context = useContext(competitionContext);

    if (context === undefined) {
        throw new Error('Missing CompetitionContext');
    }

    return context;
}

export const useCompetition = (): [Competition?, CompetitionContext['updateCompetition']?] => {
    const context = useCompetitionContext();

    return [context.competition, context.updateCompetition];
}