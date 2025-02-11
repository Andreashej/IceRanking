import { Button } from "primereact/button";
import { Dialog, DialogProps } from "primereact/dialog";
import { ListBox } from "primereact/listbox";
import React, { useEffect, useState } from "react";
import { useCompetitionContext } from "../../contexts/competition.context";
import { useToast } from "../../contexts/toast.context";
import { Test } from "../../models/test.model";
import { getTestCatalog } from "../../services/v3/test-catalog.service";
import { createTest } from "../../services/v3/test.service";

export const TestDialog: React.FC<DialogProps> = (props) => {
  const [tests, setTests] = useState<Test[]>([]);
  const [selectedTest, setSelectedTest] = useState<string>();
  const { resource: competition, fetch: fetchCompetition } =
    useCompetitionContext();
  const [loading, setLoading] = useState(false);
  const showToast = useToast();

  useEffect(() => {
    getTestCatalog().then(([tests]) => {
      setTests(tests);
    });
  }, []);

  const testOptions = tests.map((test) => {
    return {
      label: test.catalogCode,
      value: test.catalogCode,
    };
  });

  const create = async () => {
    if (!selectedTest || !competition) return;

    setLoading(true);
    try {
      await createTest(competition, { catalogCode: selectedTest });

      fetchCompetition();
      props.onHide();
    } catch (error: unknown) {
      showToast({
        severity: "error",
        summary: "Could not create test",
        detail: error as string,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      header="Add test"
      {...props}
      style={{ minWidth: "60%" }}
      footer={
        <Button
          type="submit"
          label="Create"
          onClick={() => create()}
          className="p-button-rounded p-button-raised p-button-success"
          loading={loading}
        />
      }
    >
      <form name="newTest">
        <ListBox
          value={selectedTest}
          onChange={(e) => setSelectedTest(e.value)}
          options={testOptions}
        />
      </form>
    </Dialog>
  );
};
