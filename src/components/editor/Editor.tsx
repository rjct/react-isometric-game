import { useGameState } from "../../hooks/useGameState";
import React from "react";
import { EntityDirectionSelector } from "./EntityDirectionSelector";
import { TableRow } from "./TableRow";
import { EntityVariantSlider } from "./EntityVariantSlider";
import { constants } from "../../constants";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ExportButton } from "./ExportButton";

export function Editor() {
  const { gameState, uiState, gameDispatch } = useGameState();

  return uiState.scene === "editor" ? (
    <>
      <div
        className={"editor"}
        style={{
          width: constants.editor.width,
          marginLeft: -constants.editor.width,
          top: uiState.rect.top,
          bottom: constants.editor.height,
        }}
      >
        <div className={"entity-props-editor"}>
          <table>
            <tbody>
              <TableRow label={"Type"}>{gameState.selectedEntity?.type}</TableRow>
              <TableRow label={"ID"}>{gameState.selectedEntity?.id}</TableRow>
              <TableRow label={"Position"}>
                <>{JSON.stringify(gameState.selectedEntity?.position)}</>
              </TableRow>
              <TableRow label={"Direction"}>
                <EntityDirectionSelector />
              </TableRow>

              <TableRow label={"Variant"}>
                <EntityVariantSlider
                  entity={gameState.selectedEntity}
                  onChange={(variant: number) => {
                    gameDispatch({ type: "setEntityVariant", entityId: gameState.selectedEntity.id, variant });
                  }}
                />
              </TableRow>
            </tbody>
          </table>

          <button
            className={"ui-button"}
            disabled={!gameState.selectedEntity}
            onClick={() => {
              gameDispatch({ type: "deleteSelectedEntity", entityId: gameState.selectedEntity?.id });
            }}
          >
            <FontAwesomeIcon icon={faTrash} />
            <label>Delete</label>
          </button>
        </div>

        <div className={"editor-controls"}>
          <ExportButton />
        </div>
      </div>
    </>
  ) : null;
}
