import React, {
  createContext,
  useEffect,
  useState,
  useContext,
  useCallback,
} from "react";
import { getHorse, patchHorse } from "../services/v3/horse.service";
import { ResourceContext } from "../models/resource-context.model";
import { Horse } from "../models/horse.model";

type HorseContext = ResourceContext<Horse>;

const HorseContext = createContext<HorseContext | undefined>(undefined);

type HorseProviderProps = {
  horseId: string;
};

export const HorseProvider: React.FC<HorseProviderProps> = ({
  horseId,
  children,
}) => {
  const [horse, setHorse] = useState<Horse>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>();
  const [isChanged, setIsChanged] = useState<boolean>(false);

  const saveHorse: HorseContext["save"] = async () => {
    if (!horse) return;

    try {
      const savedHorse = await patchHorse(horse);
      setHorse((prevHorse) => {
        return {
          ...prevHorse,
          ...savedHorse,
        };
      });
      setIsChanged(false);
    } catch (error: unknown) {
      console.log(error);
    }
  };

  const updateHorse: HorseContext["update"] = (updatedFields) => {
    if (!horse) return;

    setHorse((prevHorse) => {
      if (!prevHorse) return;

      return {
        ...prevHorse,
        ...updatedFields,
      };
    });
    setIsChanged(true);
  };

  const fetchHorse = useCallback(async (): Promise<void> => {
    try {
      const horse = await getHorse(horseId);
      setHorse(horse);
    } catch (error: unknown) {
      setHorse(undefined);
      setError(error as string);
    } finally {
      setLoading(false);
    }
  }, [horseId]);

  useEffect(() => {
    setLoading(true);
    setError(undefined);
    fetchHorse();
  }, [horseId, fetchHorse]);

  return (
    <HorseContext.Provider
      value={{
        resource: horse,
        update: updateHorse,
        save: saveHorse,
        fetch: fetchHorse,
        loading,
        error,
        isChanged,
      }}
    >
      {children}
    </HorseContext.Provider>
  );
};

export const useHorseContext = (): HorseContext => {
  const context = useContext(HorseContext);

  if (context === undefined) {
    throw new Error("Missing HorseContext");
  }

  return context;
};

export const useHorse = (): [
  Horse?,
  HorseContext["update"]?,
  HorseContext["save"]?,
  HorseContext["isChanged"]?
] => {
  const context = useHorseContext();

  return [context.resource, context.update, context.save, context.isChanged];
};
