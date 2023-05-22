import { useGameState } from "../../../hooks/useGameState";
import React from "react";
import { BuildingDirectionSelector } from "./BuildingDirectionSelector";
import { TableRow } from "../TableRow";
import { BuildingVariantSlider } from "./BuildingVariantSlider";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NothingSelectedText } from "../NothingSelectedText";
import { BuildingPositionEditor } from "./BuildingPositionEditor";

export function BuildingPropsEditor() {
  const { gameState, uiState, gameDispatch } = useGameState();

  return uiState.editorMode === "building" ? (
    gameState.selectedBuilding ? (
      <>
        <div className={"editor-props-wrapper"}>
          <table>
            <tbody>
              <TableRow label={"ID"}>{gameState.selectedBuilding?.id}</TableRow>
              <TableRow label={"Type"}>{gameState.selectedBuilding?.type}</TableRow>
              <TableRow label={"Position"}>
                <BuildingPositionEditor />
              </TableRow>
              <TableRow label={"Direction"}>
                <BuildingDirectionSelector />
              </TableRow>

              <TableRow label={"Variant"}>
                <BuildingVariantSlider
                  entity={gameState.selectedBuilding}
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
      </>
    ) : (
      <NothingSelectedText />
    )
  ) : null;
}
