import { useGameState } from "../../hooks/useGameState";
import { BuildingLibrary } from "./building/BuildingLibrary";
import { UnitLibrary } from "./unit/UnitLibrary";
import { constants } from "../../constants";

export function EntitiesLibrary() {
  const { gameState, uiState } = useGameState();

  return uiState.scene === "editor" && (uiState.editorMode === "buildings" || uiState.editorMode === "units") ? (
    <div
      className={`editor-library editor-library-${uiState.editorMode}`}
      style={{
        width: constants.editor.entitiesLibrary.width,
        top: gameState.debug.enabled ? 130 : undefined,
        bottom: gameState.debug.enabled ? 70 : undefined,
      }}
    >
      <BuildingLibrary />
      <UnitLibrary />
    </div>
  ) : null;
}
