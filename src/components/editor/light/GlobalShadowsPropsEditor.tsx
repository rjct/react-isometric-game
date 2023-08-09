import { useGameState } from "../../../hooks/useGameState";
import { TableRow } from "../_shared/TableRow";
import React from "react";
import { InputColor } from "../_shared/InputColor";
import { InputRange } from "../_shared/InputRange";

export function GlobalShadowsPropsEditor() {
  const { gameState, gameDispatch, uiState } = useGameState();

  return uiState.editorMode === "lights" ? (
    <div className={"editor-props-wrapper"}>
      <fieldset>
        <legend>Global shadows</legend>
        <table>
          <tbody>
            <TableRow label={"Opacity"}>
              <InputRange
                min={0}
                max={100}
                initialValue={Math.trunc(100 - gameState.globalShadows.opacity * 100)}
                valueSuffix={"%"}
                onChange={(opacity) => {
                  gameDispatch({ type: "setGlobalShadowsOpacity", opacity: (100 - opacity) / 100 });
                }}
              />
            </TableRow>
            <TableRow label={"Color"}>
              <InputColor
                initialValue={gameState.globalShadows.color}
                onChange={(color) => {
                  gameDispatch({ type: "setGlobalShadowsColor", color });
                }}
              />
            </TableRow>
          </tbody>
        </table>
      </fieldset>
    </div>
  ) : null;
}
