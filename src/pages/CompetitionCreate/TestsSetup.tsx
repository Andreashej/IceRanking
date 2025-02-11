import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useToast } from "../../contexts/toast.context";
import { Competition } from "../../models/competition.model";
import { Test } from "../../models/test.model";
import { getTestCatalog } from "../../services/v3/test-catalog.service";
import { MultiSelect } from "primereact/multiselect";
import {
  createTest,
  deleteTest,
  getTests,
  patchTest,
} from "../../services/v3/test.service";
import { RankingList } from "../../models/rankinglist.model";
import { getRankingLists } from "../../services/v3/rankinglist.service";
import { patchCompetition } from "../../services/v3/competition.service";

type TestsSetupProps = {
  competition?: Competition;
  setCompetition: (competition: Competition) => void;
};

export const TestsSetup: React.FC<TestsSetupProps> = () => {
  const { id } = useParams<{ id: string }>();
  const [testCatalog, setTestCatalog] = useState<
    { label: string; value: string }[]
  >([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [newTestcode, setNewTestcode] = useState<string>("");
  const [rankingLists, setRankingLists] = useState<RankingList[]>([]);
  const showToast = useToast();
  const history = useHistory();

  useEffect(() => {
    getTestCatalog().then(([tests]) => {
      setTestCatalog(
        tests.map((test) => {
          return {
            label: test.catalogCode,
            value: test.catalogCode,
          };
        })
      );
    });

    getTests(
      new URLSearchParams({
        "filter[]": `competitionId == ${id}`,
        expand: "includeInRanking",
      })
    ).then(([tests]) => {
      setTests(tests);
    });

    getRankingLists(
      new URLSearchParams({
        expand: "includedInRanking",
      })
    ).then(([rankingLists]) => {
      setRankingLists(rankingLists);
    });
  }, [id]);

  const testsRender = tests.map((test) => {
    return (
      <li className="list-group-item grid-col-2">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <div className="pr-4" style={{ minWidth: "5ch" }}>
            {test.catalogCode}
          </div>
          <MultiSelect
            placeholder="Rankinglists"
            value={test.includeInRanking?.map(
              (rankinglist) => rankinglist.slug
            )}
            onChange={(e) => {
              test.includeInRanking = e.value.map((shortname: string) => {
                return { shortname };
              }) as RankingList[];
              setTests((prev) =>
                prev.map((t) => {
                  if (t.id === e.value.id) {
                    return e.value;
                  }
                  return t;
                })
              );
            }}
            options={rankingLists.map((rankingList) => {
              return {
                label: rankingList.slug,
                value: rankingList.slug,
              };
            })}
          />
        </div>
        <div style={{ textAlign: "right" }}>
          <Button
            className="p-button-danger p-button-text"
            icon={PrimeIcons.TRASH}
            onClick={() => remove(test)}
          />
        </div>
      </li>
    );
  });

  const addTest = async () => {
    const test = await createTest({ id: id }, { catalogCode: newTestcode });
    setTests((tests) => {
      return [...tests, test];
    });
  };

  const remove = async (testToDelete: Test) => {
    try {
      await deleteTest(testToDelete);
      setTests((tests) => {
        return tests.filter((test) => test.id !== testToDelete.id);
      });
    } catch (e) {
      showToast({
        severity: "error",
        summary: "Could not delete test",
        detail: e as string,
      });
    }
  };

  const saveAll = async () => {
    try {
      const promises = tests.map((test) => {
        return patchTest(test);
      });

      await Promise.all(promises);

      await patchCompetition({ id: id, status: "NORMAL" });

      history.push(`/competition/${id}`);
    } catch (err) {
      showToast({
        severity: "error",
        summary: "Could not complete competition",
        detail: err as string,
      });
    }
  };

  return (
    <>
      <h2 className="subtitle">Setup tests</h2>
      <ul className="list-group">{testsRender}</ul>
      <div className="grid-col-2">
        <div className="p-input-group">
          <Dropdown
            value={newTestcode}
            onChange={(e) => setNewTestcode(e.value)}
            options={testCatalog}
          />
          <Button
            label="Add test"
            icon={PrimeIcons.PLUS}
            className="p-button-success"
            onClick={addTest}
          />
        </div>
        <div style={{ textAlign: "right" }}>
          <Button
            className="p-button-rounded p-button-success"
            icon={PrimeIcons.ARROW_RIGHT}
            iconPos="right"
            label="Finish"
            onClick={saveAll}
          />
        </div>
      </div>
    </>
  );
};
