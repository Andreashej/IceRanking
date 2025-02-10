import { Button } from "primereact/button";
import React, { FormEvent, useEffect, useMemo, useState } from "react";
import { PrimeIcons } from "primereact/api";
import { useParams, useHistory } from "react-router-dom";
import { Ranking } from "../../../models/ranking.model";
import { useRankingListContext } from "../../../contexts/rankinglist.context";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { SelectButton } from "primereact/selectbutton";
import { InputNumber } from "primereact/inputnumber";
import {
  createRanking,
  patchRanking,
} from "../../../clients/v3/ranking.service";
import { useToast } from "../../../contexts/toast.context";
import { Form } from "../../../components/Form/Form";

export const RankingEdit: React.FC = () => {
  const { testcode, shortname } = useParams<{
    testcode: string;
    shortname: string;
  }>();
  const history = useHistory();
  const { resource: rankingList, fetch: fetchRankingList } =
    useRankingListContext();

  const showToast = useToast();

  const initialRanking = useMemo<
    Ranking | Omit<Ranking, "id" | "rankinglistId">
  >(() => {
    return (
      rankingList?.tests?.find((ranking) => ranking.testcode === testcode) ?? {
        testcode: "",
        grouping: "rider",
        order: "desc",
        minMark: 5.5,
        markType: "mark",
        includedMarks: 2,
        roundingPrecision: 2,
      }
    );
  }, [testcode, rankingList]);

  const [ranking, setRanking] = useState<
    Ranking | Omit<Ranking, "id" | "rankinglistId">
  >(initialRanking);

  useEffect(() => {
    setRanking(initialRanking);
  }, [initialRanking]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (!Object.keys(ranking).includes("id") && rankingList) {
        const created = await createRanking(rankingList, ranking);
        await fetchRankingList();
        setRanking(created);
      } else {
        const updated = await patchRanking(ranking as Ranking);
        await fetchRankingList();
        setRanking(updated);
      }

      showToast({
        severity: "success",
        summary: "Ranking saved",
      });

      if (ranking.testcode !== testcode)
        history.push(
          `/rankinglist/${rankingList?.shortname}/ranking/${ranking.testcode}/edit`
        );
    } catch (error: unknown) {
      if (typeof error === "string") {
        showToast({
          severity: "error",
          summary: "Error",
          detail: error,
        });
      }
    }
  };

  return (
    <>
      <h2 className="subheader">Edit ranking</h2>
      <div>
        <Button
          label="Back to ranking"
          icon={PrimeIcons.ARROW_LEFT}
          className="p-button-secondary p-button-text"
          onClick={() => {
            history.push(`/rankinglist/${shortname}/ranking/${testcode}`);
          }}
        />
      </div>
      <Form
        id="rankingEdit"
        onSubmit={submit}
        formElements={[
          {
            label: "Testcode",
            input: (
              <InputText
                id="testcode"
                value={ranking?.testcode}
                onChange={(e) =>
                  setRanking((prevRanking) => {
                    return {
                      ...(prevRanking as Ranking),
                      testcode: e.target.value,
                    };
                  })
                }
              />
            ),
          },
          {
            label: "Grouping",
            input: (
              <Dropdown
                id="shortname"
                value={ranking?.grouping}
                options={[
                  {
                    label: "Rider",
                    value: "rider",
                  },
                  {
                    label: "Horse",
                    value: "horse",
                  },
                ]}
                onChange={(e) =>
                  setRanking((prevRanking) => {
                    return {
                      ...(prevRanking as Ranking),
                      grouping: e.value,
                    };
                  })
                }
              />
            ),
          },
          {
            label: "Ordering",
            input: (
              <SelectButton
                id="order"
                value={ranking?.order}
                options={[
                  {
                    label: "Descending",
                    value: "desc",
                  },
                  {
                    label: "Ascending",
                    value: "asc",
                  },
                ]}
                onChange={(e) =>
                  setRanking((prevRanking) => {
                    return {
                      ...(prevRanking as Ranking),
                      order: e.value,
                    };
                  })
                }
              />
            ),
          },
          {
            label: "Minimum mark",
            input: (
              <InputNumber
                value={ranking?.minMark}
                mode="decimal"
                step={0.05}
                minFractionDigits={2}
                maxFractionDigits={2}
                min={0}
                max={10}
                onChange={(e) =>
                  setRanking((prevRanking) => {
                    return {
                      ...(prevRanking as Ranking),
                      minMark: e.value,
                    };
                  })
                }
              />
            ),
          },
          {
            label: "Mark type",
            input: (
              <SelectButton
                id="marktype"
                value={ranking?.markType}
                options={[
                  {
                    label: "Mark",
                    value: "mark",
                  },
                  {
                    label: "Time",
                    value: "time",
                  },
                ]}
                onChange={(e) =>
                  setRanking((prevRanking) => {
                    return {
                      ...(prevRanking as Ranking),
                      markType: e.value,
                    };
                  })
                }
              />
            ),
          },
          {
            label: "Required marks",
            input: (
              <InputNumber
                value={ranking?.includedMarks}
                onChange={(e) =>
                  setRanking((prevRanking) => {
                    return {
                      ...(prevRanking as Ranking),
                      includedMarks: e.value,
                    };
                  })
                }
              />
            ),
          },
          {
            label: "Rouding precision",
            input: (
              <InputNumber
                value={ranking?.roundingPrecision}
                onChange={(e) =>
                  setRanking((prevRanking) => {
                    return {
                      ...(prevRanking as Ranking),
                      roundingPrecision: e.value,
                    };
                  })
                }
              />
            ),
          },
        ]}
        submitButton={
          <Button
            type="submit"
            label="Save"
            className="p-button-success p-button-raised p-button-rounded"
            icon="pi pi-save"
          />
        }
      />
    </>
  );
};
