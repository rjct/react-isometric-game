import { useGameState } from "../../../hooks/useGameState";
import { TerrainAreaTypeSelector } from "./TerrainAreaTypeSelector";
import { TableRow } from "../_shared/TableRow";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import React from "react";
import { TerrainAreaSourcePositionEditor } from "./TerrainAreaSourcePositionEditor";
import { TerrainAreaPositionEditor } from "./TerrainAreaPositionEditor";
import { TerrainAreaExitUrlEditor } from "./TerrainAreaExitUrlEditor";
import { NothingSelectedText } from "../_shared/NothingSelectedText";
import { Button } from "../../ui/Button";

export function TerrainAreaPropsEditor() {
  const { gameState, gameDispatch, uiState } = useGameState();

  return uiState.editorMode === "terrain" ? (
    gameState.selectedTerrainArea ? (
      <fieldset>
        <legend>Terrain area</legend>
        <div className={"editor-props-wrapper"}>
          <table>
            <tbody>
              <TableRow label={"ID"}>{gameState.selectedTerrainArea?.id}</TableRow>
              <TableRow label={"Type"}>
                <TerrainAreaTypeSelector />
              </TableRow>
              <TableRow label={"Position"}>
                <TerrainAreaPositionEditor />
              </TableRow>
              <TableRow label={"Source"}>
                <TerrainAreaSourcePositionEditor />
              </TableRow>
              <TableRow label={"Exit to map"}>
                <TerrainAreaExitUrlEditor />
              </TableRow>
            </tbody>
          </table>
        </div>

        <div className={"editor-controls"}>
          <Button
            className={["ui-button-red"]}
            disabled={!gameState.selectedTerrainArea}
            onClick={() => {
              gameDispatch({ type: "deleteSelectedTerrainArea", entityId: gameState.selectedTerrainArea?.id });
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
}
