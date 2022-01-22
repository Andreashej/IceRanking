import React, { createContext, useEffect, useState, useContext, useCallback } from 'react';
import { getPerson, patchPerson } from '../services/v2/person.service';
import { Person } from "../models/person.model";
import { ResourceContext } from '../models/resource-context.model';

export type RiderProps = Required<Pick<Person, "id" | "firstname" | "lastname" | "fullname" | "testlist">>;

type RiderContext = ResourceContext<RiderProps>;

const RiderContext = createContext<RiderContext | undefined>(undefined);

type RiderProviderProps = {
    riderId: number;
}

export const RiderProvider: React.FC<RiderProviderProps> = ({riderId, children}) => {
    const [rider, setRider] = useState<RiderProps>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>();
    const [isChanged, setIsChanged] = useState<boolean>(false);
    
    const saveRider: RiderContext['save'] = async () => {
        if (!rider) return;

        try {
            const savedRider = await patchPerson(rider) as RiderProps
            setRider((prev) => {
                return {
                    ...prev,
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
            const params = new URLSearchParams({
                'fields': 'id,firstname,lastname,fullname,testlist'
            })
            const rider = await getPerson(riderId, params) as RiderProps;
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

export const useRider = (): [RiderProps?, RiderContext['update']?, RiderContext['save']?, RiderContext['isChanged']?] => {
    const context = useRiderContext();

    return [context.resource, context.update, context.save, context.isChanged];
}