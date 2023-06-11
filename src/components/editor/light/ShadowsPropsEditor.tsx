import { useGameState } from "../../../hooks/useGameState";
import { TableRow } from "../TableRow";
import React from "react";
import { InputColor } from "../_shared/InputColor";
import { InputRange } from "../_shared/InputRange";

export function ShadowsPropsEditor() {
  const { gameState, gameDispatch, uiState } = useGameState();

  return uiState.editorMode === "light" ? (
    <div className={"editor-props-wrapper"}>
      <fieldset>
        <legend>Global shadows</legend>
        <table>
          <tbody>
            <TableRow label={"Opacity"}>
              <InputRange
                min={0}
                max={100}
                initialValue={Math.trunc(100 - gameState.shadows.opacity * 100)}
                valueSuffix={"%"}
                onChange={(opacity) => {
                  gameDispatch({ type: "setShadowsOpacity", opacity: (100 - opacity) / 100 });
                }}
              />
            </TableRow>
            <TableRow label={"Color"}>
              <InputColor
                initialValue={gameState.shadows.color}
                onChange={(color) => {
                  gameDispatch({ type: "setShadowsColor", color });
                }}
              />
            </TableRow>
          </tbody>
        </table>
      </fieldset>
    </div>
  ) : null;
}
