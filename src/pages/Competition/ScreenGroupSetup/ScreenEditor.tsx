import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import TooltipOptions from "primereact/tooltip/tooltipoptions";
import React, { FormEvent, useEffect, useState } from "react";
import { Form } from "../../../components/Form/Form";
import { useToast } from "../../../contexts/toast.context";
import { BigScreen } from "../../../models/bigscreen.model";
import {
  deleteScreen,
  getScreen,
  patchScreen,
} from "../../../clients/v3/bigscreen.service";
import { ScreenProps } from "./ScreenGroupSetup";

export const ScreenEditor: React.FC<ScreenProps> = ({ screenId, onDelete }) => {
  const [screen, setScreen] = useState<BigScreen>();
  const [screenEditDialogShown, setScreenEditDialogShown] =
    useState<boolean>(false);
  const elementId = `screen-${screenId}`;
  const showToast = useToast();

  useEffect(() => {
    getScreen(screenId).then((screen) => setScreen(screen));
  }, [screenId]);

  const dragStart: React.DragEventHandler<HTMLDivElement> = (event) => {
    event.dataTransfer.setData("text", elementId);
  };

  const dragEnd: React.DragEventHandler<HTMLDivElement> = (event) => {
    // event.preventDefault();
    // const element = event.target as HTMLDivElement;
    // element.style.visibility = 'visible';
  };

  const updateScreen = async (e: FormEvent) => {
    e.preventDefault();

    if (!screen) return;

    try {
      const patchedScreen = await patchScreen(screen);

      setScreen(patchedScreen);

      setScreenEditDialogShown(false);

      showToast({
        summary: "Screen updated",
        severity: "success",
      });
    } catch (error) {
      showToast({
        summary: "Could update screen",
        detail: error as string,
        severity: "error",
      });
    }
  };

  const unClaim = async () => {
    if (!screen) return;

    await deleteScreen(screen);

    onDelete(screenId);
  };

  const copyText = async () => {
    if (!screen) return;

    await navigator.clipboard.writeText(
      `${window.location.protocol}//${window.location.host}/#/bigscreen?id=${screen.id}`
    );
    showToast({
      severity: "success",
      summary: "Direct screen URL copied!",
    });
  };

  const tooltipOptions: TooltipOptions = {
    position: "top",
  };

  if (!screen) return null;

  return (
    <>
      <div
        id={elementId}
        className={`screen-editor ${screen.role}`}
        draggable
        onDragStart={dragStart}
        onDragEnd={dragEnd}
        data-screen-id={screen.id}
        data-screen-source-group={screen.screenGroupId}
      >
        <div className="actions">
          <Button tooltip="Copy direct link" tooltipOptions={tooltipOptions}>
            <FontAwesomeIcon icon="link" onClick={copyText} />
          </Button>
          <Button tooltip="Edit screen" tooltipOptions={tooltipOptions}>
            <FontAwesomeIcon
              icon="cog"
              onClick={() => setScreenEditDialogShown(true)}
            />
          </Button>
          <Button tooltip="Unclaim screen" tooltipOptions={tooltipOptions}>
            <FontAwesomeIcon icon="times" onClick={unClaim} />
          </Button>
        </div>
        <div className="content">ID: {screen.id}</div>
      </div>
      <Dialog
        header={`Edit screen: ${screen.id}`}
        visible={screenEditDialogShown}
        onHide={() => setScreenEditDialogShown(false)}
        style={{ width: "50%" }}
      >
        <Form
          id={`editScreen${screenId}`}
          onSubmit={updateScreen}
          formElements={[
            {
              label: "Background Mode",
              input: (
                <Dropdown
                  value={screen.role}
                  onChange={(e) =>
                    setScreen((prev) => {
                      return {
                        ...(prev as BigScreen),
                        role: e.target.value,
                      };
                    })
                  }
                  options={[
                    {
                      label: "Standalone",
                      value: "standalone",
                    },
                    {
                      label: "Key Color",
                      value: "key",
                    },
                    {
                      label: "vMix",
                      value: "vmix",
                    },
                  ]}
                />
              ),
            },
            {
              label: "Root Font Size",
              input: (
                <InputText
                  value={screen.rootFontSize ?? ""}
                  placeholder="5vmin"
                  onChange={(e) =>
                    setScreen((prev) => {
                      return {
                        ...(prev as BigScreen),
                        rootFontSize: e.target.value,
                      };
                    })
                  }
                />
              ),
            },
          ]}
          submitButton={
            <Button
              label="Save"
              type="submit"
              className="p-button-success p-button-rounded p-button-raised"
            />
          }
        />
      </Dialog>
    </>
  );
};
