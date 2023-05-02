import { useGameState } from "../../hooks/useGameState";
import React from "react";
import { EntityDirection } from "./EntityDirection";
import { TableRow } from "./TableRow";
import { EntityVariant } from "./EntityVariant";
import { constants } from "../../constants";

export function Editor() {
  const { gameState, uiState } = useGameState();

  return uiState.scene === "editor" ? (
    <div className={"editor"} style={{ width: constants.editor.width, marginLeft: -constants.editor.width }}>
      <table>
        <tbody>
          <TableRow label={"Type"}>{gameState.selectedEntity?.type}</TableRow>
          <TableRow label={"ID"}>{gameState.selectedEntity?.id}</TableRow>
          <TableRow label={"Position"}>
            <>{JSON.stringify(gameState.selectedEntity?.position)}</>
          </TableRow>
          <TableRow label={"Direction"}>
            <EntityDirection />
          </TableRow>

          <TableRow label={"Variant"}>
            <EntityVariant />
          </TableRow>
        </tbody>
      </table>
    </div>
  ) : null;
}
