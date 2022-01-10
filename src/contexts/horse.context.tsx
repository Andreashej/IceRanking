import React, { createContext, useEffect, useState, useContext } from 'react';
import { getHorse, patchHorse } from '../services/v2/horse.service';
import { ResourceContext } from '../models/resource-context.model';
import { Horse } from '../models/horse.model';

type HorseContext = ResourceContext<Horse>;

const HorseContext = createContext<HorseContext | undefined>(undefined);

type HorseProviderProps = {
    horseId: number;
}

export const HorseProvider: React.FC<HorseProviderProps> = ({horseId, children}) => {
    const [horse, setHorse] = useState<Horse>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>();
    
    const saveHorse: HorseContext['save'] = async (updatedFields) => {
        const updatedHorse = {...horse, ...updatedFields} as Horse;

        if (!updatedHorse) return;

        try {
            const savedHorse = await patchHorse(updatedHorse);
            setHorse((prevHorse) => {
                return {
                    ...prevHorse,
                    ...savedHorse
                }
            });
        } catch (error: unknown) {
            console.log(error);
        }
    }

    const updateHorse: HorseContext['update'] = (updatedFields) => {
        if (!horse) return;
        
        setHorse((prevHorse) => {
            if (!prevHorse) return;

            return {
                ...prevHorse,
                ...updatedFields
            }
        });
    }

    useEffect(() => {
        const fetchHorse = async (): Promise<void> => {
            try {

                const horse = await getHorse(horseId);
                setHorse(horse);
            } catch (error : unknown) {
                setHorse(undefined);
                setError(error as string);
            } finally {
                setLoading(false);
            }
        }

        setLoading(true);
        setError(undefined);
        fetchHorse();
    }, [horseId])
    
    return (
        <HorseContext.Provider value={{
            resource: horse,
            update: updateHorse,
            save: saveHorse,
            loading,
            error,
        }}>
            {children}
        </HorseContext.Provider>
    )
}

export const useHorseContext = (): HorseContext => {
    const context = useContext(HorseContext);

    if (context === undefined) {
        throw new Error('Missing HorseContext');
    }

    return context;
}

export const useHorse = (): [Horse?, HorseContext['update']?, HorseContext['save']?] => {
    const context = useHorseContext();

    return [context.resource, context.update, context.save];
}