import React, { createContext, useEffect, useState, useContext, useCallback } from 'react';
import { getRider, patchRider } from '../services/v2/rider.service';
import { Rider } from "../models/rider.model";
import { ResourceContext } from '../models/resource-context.model';

type RiderContext = ResourceContext<Rider>;

const RiderContext = createContext<RiderContext | undefined>(undefined);

type RiderProviderProps = {
    riderId: number;
}

export const RiderProvider: React.FC<RiderProviderProps> = ({riderId, children}) => {
    const [rider, setRider] = useState<Rider>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>();
    const [isChanged, setIsChanged] = useState<boolean>(false);
    
    const saveRider: RiderContext['save'] = async () => {
        if (!rider) return;

        try {
            const savedRider = await patchRider(rider);
            setRider((prevRider) => {
                return {
                    ...prevRider,
                    ...savedRider
                }
            });
            setIsChanged(false);
        } catch (error: unknown) {
            console.log(error);
        }
    }

    const updateRider: RiderContext['update'] = (updatedFields) => {
        if (!rider) return;
        
        setRider((prevRider) => {
            if (!prevRider) return;

            return {
                ...prevRider,
                ...updatedFields
            }
        });

        setIsChanged(true);
    }

    const fetchRider = useCallback(async (): Promise<void> => {
        try {
            const rider = await getRider(riderId);
            setRider(rider);
        } catch (error : unknown) {
            setRider(undefined);
            setError(error as string);
        } finally {
            setLoading(false);
        }
    },[riderId]);

    useEffect(() => {

        setLoading(true);
        setError(undefined);
        fetchRider();
    }, [riderId, fetchRider])
    
    return (
        <RiderContext.Provider value={{
            resource: rider,
            update: updateRider,
            save: saveRider,
            fetch: fetchRider,
            loading,
            error,
            isChanged,
        }}>
            {children}
        </RiderContext.Provider>
    )
}

export const useRiderContext = (): RiderContext => {
    const context = useContext(RiderContext);

    if (context === undefined) {
        throw new Error('Missing RiderContext');
    }

    return context;
}

export const useRider = (): [Rider?, RiderContext['update']?, RiderContext['save']?, RiderContext['isChanged']?] => {
    const context = useRiderContext();

    return [context.resource, context.update, context.save, context.isChanged];
}