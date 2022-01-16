import { Competition } from "../models/competition.model";
import React, { createContext, useEffect, useState, useContext } from 'react';
import { getCompetition, patchCompetition } from '../services/v2/competition.service';
import { ResourceContext } from "../models/resource-context.model";

type CompetitionContext = ResourceContext<Competition>;

const CompetitionContext = createContext<CompetitionContext | undefined>(undefined);

type CompetitionProviderProps = {
    competitionId: number;
}

export const CompetitionProvider: React.FC<CompetitionProviderProps> = ({competitionId, children}) => {
    const [competition, setCompetition] = useState<Competition>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>();
    const [isChanged, setIsChanged] = useState<boolean>(false);
    
    const saveCompetition: CompetitionContext['save'] = async () => {
        if (!competition) return;

        try {
            const savedCompetition = await patchCompetition(competition);
            setCompetition((prevCompetition) => {
                return {
                    ...prevCompetition,
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

    useEffect(() => {
        const fetchCompetition = async (): Promise<void> => {
            try {
                const params = new URLSearchParams();
                params.append('expand', 'tests');
    
                const competition = await getCompetition(competitionId, params);
                setCompetition(competition);
            } catch (error : unknown) {
                setCompetition(undefined);
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
        <CompetitionContext.Provider value={{
            resource: competition,
            update: updateCompetition,
            save: saveCompetition,
            loading,
            error,
            isChanged
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

export const useCompetition = (): [Competition?, CompetitionContext['update']?, CompetitionContext['save']?, CompetitionContext['isChanged']?] => {
    const context = useCompetitionContext();

    return [context.resource, context.update, context.save, context.isChanged];
}