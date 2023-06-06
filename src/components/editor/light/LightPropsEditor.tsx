import { useGameState } from "../../../hooks/useGameState";
import { TableRow } from "../TableRow";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import React from "react";
import { NothingSelectedText } from "../NothingSelectedText";
import { LightRadiusEditor } from "./LightRadiusEditor";

export function LightPropsEditor() {
  const { gameState, gameDispatch, uiState } = useGameState();

  return uiState.editorMode === "light" ? (
    gameState.selectedLight ? (
      <>
        <div className={"editor-props-wrapper"}>
          <table>
            <tbody>
              <TableRow label={"ID"}>{gameState.selectedLight?.id}</TableRow>
              <TableRow label={"Radius"}>
                <LightRadiusEditor
                  entity={gameState.selectedLight}
                  onChange={(radius) => {
                    gameDispatch({ type: "setLightRadius", entityId: gameState.selectedLight.id, radius });
                  }}
                />
              </TableRow>
            </tbody>
          </table>
        </div>

        <div className={"editor-controls"}>
          <button
            className={"ui-button ui-button-red"}
            disabled={!gameState.selectedLight}
            onClick={() => {
              gameDispatch({ type: "deleteSelectedLight", entityId: gameState.selectedLight?.id });
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
