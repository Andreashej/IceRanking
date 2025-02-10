import { Test } from "../models/test.model";
import React, {
  createContext,
  useEffect,
  useState,
  useContext,
  useCallback,
} from "react";
import { getTest, patchTest } from "../clients/v3/test.service";
import { ResourceContext } from "../models/resource-context.model";

export type TestProps = Required<Test>;

type TestContext = ResourceContext<TestProps>;

const TestContext = createContext<TestContext | undefined>(undefined);

type TestProviderProps = {
  testId: string;
};

export const TestProvider: React.FC<TestProviderProps> = ({
  testId,
  children,
}) => {
  const [test, setTest] = useState<TestProps>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>();
  const [isChanged, setIsChanged] = useState<boolean>(false);

  const saveTest: TestContext["save"] = async () => {
    if (!test) return;

    try {
      const savedTest = (await patchTest(test)) as TestProps;
      setTest((prev) => {
        return {
          ...prev,
          ...savedTest,
        };
      });
      setIsChanged(false);
    } catch (error: unknown) {
      console.log(error);
    }
  };

  const updateTest: TestContext["update"] = (updatedFields) => {
    if (!test) return;

    setTest((c) => {
      if (!c) return;

      return {
        ...c,
        ...updatedFields,
      };
    });
    setIsChanged(true);
  };

  const fetchTest = useCallback(async (): Promise<void> => {
    try {
      const params = new URLSearchParams();

      const test = (await getTest(testId, params)) as TestProps;
      setTest(test);
    } catch (error: unknown) {
      setTest(undefined);
      setError(error as string);
    } finally {
      setLoading(false);
    }
  }, [testId]);

  useEffect(() => {
    setLoading(true);
    setError(undefined);
    fetchTest();
  }, [testId, fetchTest]);

  return (
    <TestContext.Provider
      value={{
        resource: test,
        update: updateTest,
        save: saveTest,
        fetch: fetchTest,
        loading,
        error,
        isChanged,
      }}
    >
      {children}
    </TestContext.Provider>
  );
};

export const useTestContext = (): TestContext => {
  const context = useContext(TestContext);

  if (context === undefined) {
    throw new Error("Missing TestContext");
  }

  return context;
};

export const useTest = (): [
  TestContext["resource"]?,
  TestContext["update"]?,
  TestContext["save"]?,
  TestContext["isChanged"]?
] => {
  const context = useTestContext();

  return [context.resource, context.update, context.save, context.isChanged];
};
