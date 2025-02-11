import React, { FormEvent, useCallback, useEffect, useState } from "react";
import { ScreenGroup } from "../../../models/screengroup.model";
import { useCompetition } from "../../../contexts/competition.context";
import {
  createScreenGroup,
  getScreenGroups,
} from "../../../services/v3/bigscreen.service";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { PrimeIcons } from "primereact/api";
import { BigScreen } from "../../../models/bigscreen.model";
import { ScreenGroupEditor } from "./ScreenGroupEditor";
import { useHistory } from "react-router-dom";

export type ScreenGroupProps = {
  screenGroup: ScreenGroup;
};

export type ScreenProps = {
  screenId: BigScreen["id"];
  onDelete: (deletedScreenid: string) => void;
};

export const ScreenGroupSetup: React.FC = () => {
  const [competition] = useCompetition();
  const [screenGroups, setScreenGroups] = useState<ScreenGroup[]>([]);
  const [newScreenGroupName, setNewName] = useState<string>("");
  const history = useHistory();

  const getScreenGroupsForCompetitions = useCallback(async () => {
    return getScreenGroups(
      new URLSearchParams({
        "filter[]": `competitionId == ${competition?.id}`,
        expand: "screens",
      })
    );
  }, [competition]);

  useEffect(() => {
    getScreenGroupsForCompetitions().then(([sgs]) => setScreenGroups(sgs));
  }, [getScreenGroupsForCompetitions]);

  const createNew = (e: FormEvent) => {
    e.preventDefault();

    if (!competition) return;

    createScreenGroup({
      name: newScreenGroupName,
      competitionId: competition.id,
    }).then((newGroup) => {
      setScreenGroups((prev) => {
        return [...(prev as ScreenGroup[]), newGroup];
      });
      setNewName("");
    });
  };

  return (
    <>
      <div className="grid-col-2">
        <h2 className="subtitle">Setup Screens</h2>
        <div style={{ textAlign: "right" }}>
          <Button
            label="Edit routes"
            icon={PrimeIcons.DIRECTIONS}
            className="p-button-rounded p-button-raised p-button-success"
            onClick={() =>
              history.push(
                `/competition/${competition?.id}/screengroups/routes`
              )
            }
          />
        </div>
      </div>
      {screenGroups.map((screenGroup) => (
        <ScreenGroupEditor key={screenGroup.id} screenGroup={screenGroup} />
      ))}
      <form onSubmit={createNew}>
        <div className="p-float-label">
          <InputText
            id="new-group"
            value={newScreenGroupName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <label htmlFor="new-group">Screen Group name</label>
        </div>
        <Button
          label="Create"
          icon={PrimeIcons.PLUS}
          className="p-button-success p-button-rounded p-button-raised"
        />
      </form>
    </>
  );
};
