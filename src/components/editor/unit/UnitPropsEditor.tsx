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

export function UnitPropsEditor() {
  const { gameState, uiState, gameDispatch } = useGameState();

  return uiState.editorMode === "units" ? (
    gameState.selectedUnit ? (
      <fieldset>
        <legend>Unit</legend>
        <div className={"editor-props-wrapper"}>
          <UnitPreview />

          <table>
            <tbody>
              <TableRow label={"ID"}>{gameState.selectedUnit?.id}</TableRow>
              <TableRow label={"Type"}>{gameState.selectedUnit?.type}</TableRow>
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

        <div className={"editor-controls"}>
          <button
            className={"ui-button ui-button-red"}
            disabled={!gameState.selectedUnit || gameState.selectedUnit.isHero}
            onClick={() => {
              gameDispatch({ type: "deleteSelectedUnit", entityId: gameState.selectedUnit?.id });
            }}
          >
            <FontAwesomeIcon icon={faTrash} />
            <label>Delete</label>
          </button>
        </div>
      </fieldset>
    ) : (
      <NothingSelectedText />
    )
  ) : null;
}
