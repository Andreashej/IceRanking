import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useState } from "react";
import { useCompetition } from "../../contexts/competition.context";
import { useToast } from "../../contexts/toast.context";
import { User } from "../../models/user.model";
import {
  deleteCompetitionUser,
  getCompetition,
  postCompetitionUsers,
} from "../../services/v3/competition.service";

export const CompetitionAdmins: React.FC = () => {
  const [competition] = useCompetition();
  const [users, setUsers] = useState<User[]>([]);
  const [username, setUsername] = useState<string>("");

  const showToast = useToast();

  useEffect(() => {
    if (!competition) return;

    getCompetition(
      competition?.id,
      new URLSearchParams({ expand: "adminUsers" })
    ).then((competition) => {
      if (competition.adminUsers == null) return;

      setUsers(competition.adminUsers);
    });
  }, [competition]);

  const addUser = async () => {
    if (!competition) return;

    try {
      const newUser = await postCompetitionUsers(competition, username);

      setUsers((currentValue) => [...currentValue, newUser]);
      setUsername("");
    } catch (err) {
      showToast({
        severity: "error",
        summary: "Could not add user",
        detail: err as string,
      });
    }
  };

  const deleteUser = async (user: User) => {
    if (!competition) return;

    try {
      await deleteCompetitionUser(competition, user);

      setUsers((currentValue) => {
        return currentValue.filter((usr) => usr.id !== user.id);
      });
      setUsername("");
    } catch (err) {
      showToast({
        severity: "error",
        summary: "Could not add user",
        detail: err as string,
      });
    }
  };

  return (
    <>
      <h2 className="subtitle">Competition Admins</h2>
      <ul className="list-group container">
        {users.map((user) => {
          return (
            <li
              key={user.id}
              className="list-group-item"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>{user.username}</div>
              <div>
                <Button
                  className="p-button-text p-button-danger"
                  icon={PrimeIcons.TRASH}
                  onClick={() => deleteUser(user)}
                />
              </div>
            </li>
          );
        })}
        <li className="list-group-item">
          <div className="p-inputgroup">
            <InputText
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Button
              className="p-button-success"
              icon={PrimeIcons.PLUS}
              onClick={addUser}
            />
          </div>
        </li>
      </ul>
    </>
  );
};
