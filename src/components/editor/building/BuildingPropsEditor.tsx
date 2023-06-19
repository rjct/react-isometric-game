import { useGameState } from "../../../hooks/useGameState";
import React from "react";
import { BuildingDirectionSelector } from "./BuildingDirectionSelector";
import { TableRow } from "../_shared/TableRow";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NothingSelectedText } from "../_shared/NothingSelectedText";
import { BuildingPositionEditor } from "./BuildingPositionEditor";
import { InputRange } from "../_shared/InputRange";

export function BuildingPropsEditor() {
  const { gameState, uiState, gameDispatch } = useGameState();

  return uiState.editorMode === "building" ? (
    gameState.selectedBuilding ? (
      <fieldset>
        <legend>Building</legend>
        <div className={"editor-props-wrapper"}>
          <table>
            <tbody>
              <TableRow label={"ID"}>{gameState.selectedBuilding?.id}</TableRow>
              <TableRow label={"Class"}>{gameState.selectedBuilding?.class}</TableRow>
              <TableRow label={"Type"}>{gameState.selectedBuilding?.type}</TableRow>
              <TableRow label={"Position"}>
                <BuildingPositionEditor />
              </TableRow>
              <TableRow label={"Direction"}>
                <BuildingDirectionSelector />
              </TableRow>

              <TableRow label={"Variant"}>
                <InputRange
                  initialValue={gameState.selectedBuilding.variant}
                  valueSuffix={""}
                  min={0}
                  max={[...Array(gameState.selectedBuilding.variants).keys()].length - 1}
                  onChange={(variant: number) => {
                    gameDispatch({ type: "setBuildingVariant", entityId: gameState.selectedBuilding.id, variant });
                  }}
                />
              </TableRow>
            </tbody>
          </table>
        </div>

        <div className={"editor-controls"}>
          <button
            className={"ui-button ui-button-red"}
            disabled={!gameState.selectedBuilding}
            onClick={() => {
              gameDispatch({ type: "deleteSelectedBuilding", entityId: gameState.selectedBuilding?.id });
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
