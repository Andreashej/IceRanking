import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React, { FormEvent, useEffect, useState } from "react";
import { Form } from "../../components/Form/Form";
import { useRider } from "../../contexts/rider.context";
import { useToast } from "../../contexts/toast.context";
import { useProfile } from "../../contexts/user.context";
import { PersonAlias } from "../../models/personalias.model";
import { createAlias, getAliases } from "../../services/v3/person.service";

export const RiderEdit: React.FC = () => {
  const [rider, update, save] = useRider();
  const [aliases, setAliases] = useState<PersonAlias[]>([]);
  const [newAlias, setNewAlias] = useState("");
  const [mergePersonId, setMergePersonId] = useState<string>("");
  const showToast = useToast();
  const [user] = useProfile();

  useEffect(() => {
    if (!rider) return;

    getAliases(rider).then(([a]) => {
      setAliases(a);
    });
  }, [rider]);

  const aliasList = aliases.map((alias) => {
    return (
      <li className="list-group-item" key={alias.id}>
        {alias.alias}
      </li>
    );
  });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    save?.();
  };

  const addAlias = async () => {
    if (!rider) return;

    try {
      const createdAlias = await createAlias(rider, { alias: newAlias });
      setAliases((prevAliases) => [...prevAliases, createdAlias]);
      setNewAlias("");
    } catch (error) {
      showToast({
        severity: "error",
        summary: "Could not create alias",
        detail: error as string,
      });
    }
  };

  const mergeRiders = async () => {
    if (!rider) return;

    try {
      const createdAlias = await createAlias(rider, {
        personId: mergePersonId,
      });
      setAliases((prevAliases) => [...prevAliases, createdAlias]);
      setMergePersonId("");
    } catch (error) {
      showToast({
        severity: "error",
        summary: "Could not create alias",
        detail: error as string,
      });
    }
  };

  return (
    <>
      <h2 className="subtitle">Edit rider</h2>
      <Form
        id="editRider"
        onSubmit={submit}
        formElements={[
          {
            label: "First Name",
            input: (
              <InputText
                id="firstName"
                value={rider?.firstName}
                onChange={(e) => update?.({ firstName: e.target.value })}
              />
            ),
          },
          {
            label: "Last Name",
            input: (
              <InputText
                id="lastName"
                value={rider?.lastName}
                onChange={(e) => update?.({ lastName: e.target.value })}
              />
            ),
          },
          {
            label: "Email",
            input: (
              <InputText
                id="email"
                value={rider?.email}
                onChange={(e) => update?.({ email: e.target.value })}
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
      {user?.superUser && (
        <>
          <h2 className="subtitle mt-4">Aliases</h2>
          <ul className="list-group">
            {aliasList}
            <li className="list-group-item">
              <div className="row">
                <div className="col">
                  <InputText
                    id="alias"
                    placeholder="New alias"
                    value={newAlias}
                    onChange={(e) => setNewAlias(e.target.value)}
                  />
                  <Button
                    type="button"
                    label="Add alias"
                    icon="pi pi-plus"
                    className="p-button-info"
                    onClick={addAlias}
                  />
                </div>
                <div className="col">
                  <InputText
                    id="mergeRider"
                    placeholder="Rider ID to merge"
                    value={mergePersonId}
                    onChange={(e) => setMergePersonId(e.target.value)}
                  />
                  <Button
                    type="button"
                    label="Merge riders"
                    icon="pi pi-plus"
                    className="p-button-info"
                    onClick={mergeRiders}
                  />
                </div>
              </div>
            </li>
          </ul>
        </>
      )}
    </>
  );
};
