import { useGameState } from "../../../hooks/useGameState";
import { TableRow } from "../TableRow";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import React from "react";
import { NothingSelectedText } from "../NothingSelectedText";
import { InputColor } from "../_shared/InputColor";
import { InputRange } from "../_shared/InputRange";

export function LightPropsEditor() {
  const { gameState, gameDispatch, uiState } = useGameState();

  return uiState.editorMode === "light" ? (
    gameState.selectedLight ? (
      <fieldset>
        <legend>
          <div>Light</div>
        </legend>
        <div className={"editor-props-wrapper"}>
          <table>
            <tbody>
              <TableRow label={"ID"}>{gameState.selectedLight?.id}</TableRow>
              <TableRow label={"Radius"}>
                <InputRange
                  initialValue={gameState.selectedLight.radius}
                  valueSuffix={""}
                  min={0}
                  max={Math.max(gameState.mapSize.width, gameState.mapSize.height)}
                  onChange={(radius) => {
                    gameDispatch({ type: "setLightRadius", entityId: gameState.selectedLight.id, radius });
                  }}
                />
              </TableRow>
              <TableRow label={"Color"}>
                <InputColor
                  initialValue={gameState.selectedLight.getColor()}
                  onChange={(color) => {
                    gameDispatch({ type: "setLightColor", entityId: gameState.selectedLight.id, color });
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
      </fieldset>
    ) : (
      <NothingSelectedText />
    )
  ) : null;
}
