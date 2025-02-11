import React, {
  createContext,
  useEffect,
  useState,
  useContext,
  useCallback,
} from "react";
import { getPerson, patchPerson } from "../services/v3/person.service";
import { Person } from "../models/person.model";
import { ResourceContext } from "../models/resource-context.model";
import { useToast } from "./toast.context";

export type RiderProps = Required<
  Pick<Person, "id" | "firstName" | "lastName" | "testlist" | "email">
>;

type RiderContext = ResourceContext<RiderProps>;

const RiderContext = createContext<RiderContext | undefined>(undefined);

type RiderProviderProps = {
  riderId: string;
};

export const RiderProvider: React.FC<RiderProviderProps> = ({
  riderId,
  children,
}) => {
  const [rider, setRider] = useState<RiderProps>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>();
  const [isChanged, setIsChanged] = useState<boolean>(false);
  const showToast = useToast();

  const saveRider: RiderContext["save"] = async () => {
    if (!rider) return;

    try {
      const savedRider = (await patchPerson(rider)) as RiderProps;
      setRider((prev) => {
        return {
          ...prev,
          ...savedRider,
        };
      });
      setIsChanged(false);
    } catch (error: unknown) {
      showToast({
        severity: "error",
        summary: "Could not save person",
        detail: error as string,
      });
    }
  };

  const updateRider: RiderContext["update"] = (updatedFields) => {
    if (!rider) return;

    setRider((prevRider) => {
      if (!prevRider) return;

      return {
        ...prevRider,
        ...updatedFields,
      };
    });

    setIsChanged(true);
  };

  const fetchRider = useCallback(async (): Promise<void> => {
    try {
      const rider = (await getPerson(riderId)) as RiderProps;
      setRider(rider);
    } catch (error: unknown) {
      setRider(undefined);
      setError(error as string);
    } finally {
      setLoading(false);
    }
  }, [riderId]);

  useEffect(() => {
    setLoading(true);
    setError(undefined);
    fetchRider();
  }, [riderId, fetchRider]);

  return (
    <RiderContext.Provider
      value={{
        resource: rider,
        update: updateRider,
        save: saveRider,
        fetch: fetchRider,
        loading,
        error,
        isChanged,
      }}
    >
      {children}
    </RiderContext.Provider>
  );
};

export const useRiderContext = (): RiderContext => {
  const context = useContext(RiderContext);

  if (context === undefined) {
    throw new Error("Missing RiderContext");
  }

  return context;
};

export const useRider = (): [
  RiderProps?,
  RiderContext["update"]?,
  RiderContext["save"]?,
  RiderContext["isChanged"]?
] => {
  const context = useRiderContext();

  return [context.resource, context.update, context.save, context.isChanged];
};
