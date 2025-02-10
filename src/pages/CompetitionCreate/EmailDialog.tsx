import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import React, { FormEvent, useEffect, useState } from "react";
import { useToast } from "../../contexts/toast.context";
import { Person } from "../../models/person.model";
import { patchPerson } from "../../clients/v3/person.service";

type EmailDialogProps = {
  show: boolean;
  onHide: () => void;
  initialPerson: Person;
};

export const EmailDialog: React.FC<EmailDialogProps> = ({
  show,
  onHide,
  initialPerson,
}) => {
  const [person, setPerson] = useState<Person>(initialPerson);
  const showToast = useToast();

  useEffect(() => {
    setPerson(initialPerson);
  }, [initialPerson]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const updated = await patchPerson(person);
      if (updated.email) onHide();
    } catch (error) {
      showToast({
        severity: "error",
        summary: "Could not save email",
        detail: error as string,
      });
    }
  };

  return (
    <Dialog
      header="Contact person does not have an email"
      visible={show}
      onHide={onHide}
    >
      <p className="mb-4">
        A contact person must have en email address. Please assign one now, or
        choose another person.
      </p>
      <form onSubmit={submit}>
        <span className="p-float-label">
          <InputText
            id="email"
            value={person?.email}
            onChange={(e) =>
              setPerson((prev) => {
                return {
                  ...person,
                  email: e.target.value,
                };
              })
            }
          />
          <label htmlFor="email">Email address</label>
        </span>
        <Button
          label="Save"
          className="p-button-rounded p-button-raised p-button-success"
          icon={PrimeIcons.SAVE}
          type="submit"
        />
      </form>
    </Dialog>
  );
};
