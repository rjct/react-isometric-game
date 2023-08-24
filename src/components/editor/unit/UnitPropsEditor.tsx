import { useGameState } from "../../../hooks/useGameState";
import React from "react";
import { TableRow } from "../_shared/TableRow";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NothingSelectedText } from "../_shared/NothingSelectedText";
import { UnitPositionEditor } from "./UnitPositionEditor";
import { UnitPreview } from "./UnitPreview";
import { UnitDeadSwitch } from "./UnitDeadSwitch";
import { UnitDirectionSelector } from "./UnitDirectionSelector";
import { UnitInventoryEditor } from "./inventory/UnitInventoryEditor";
import { Unit } from "../../../engine/UnitFactory";
import { Button } from "../../ui/Button";

export const UnitPropsEditor = (props: { unit: Unit }) => {
  const { uiState, gameDispatch } = useGameState();

  return uiState.editorMode === "units" ? (
    props.unit ? (
      <fieldset>
        <legend>Unit</legend>
        <div className={"editor-props-wrapper"}>
          <UnitPreview />

          <table>
            <tbody>
              <TableRow label={"ID"}>{props.unit.id}</TableRow>
              <TableRow label={"Type"}>{props.unit.type}</TableRow>
              <TableRow label={"Dead"}>
                <UnitDeadSwitch />
              </TableRow>
              <TableRow label={"Direction"}>
                <UnitDirectionSelector />
              </TableRow>
              <TableRow label={"Position"}>
                <UnitPositionEditor />
              </TableRow>
            </tbody>
          </table>
        </div>

        <UnitInventoryEditor unit={props.unit} />

        <div className={"editor-controls"}>
          <Button
            className={["ui-button-red"]}
            disabled={props.unit.isHero}
            onClick={() => {
              gameDispatch({ type: "deleteSelectedUnit", entityId: props.unit.id });
            }}
          >
            <FontAwesomeIcon icon={faTrash} />
            <label>Delete</label>
          </Button>
        </div>
      </fieldset>
    ) : (
      <NothingSelectedText />
    )
  ) : null;
};
