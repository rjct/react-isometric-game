import { useGameState } from "../../hooks/useGameState";
import { BuildingLibrary } from "./building/BuildingLibrary";
import { UnitLibrary } from "./unit/UnitLibrary";

export function EntitiesLibrary() {
  const { uiState } = useGameState();

  return uiState.scene === "editor" && (uiState.editorMode === "buildings" || uiState.editorMode === "units") ? (
    <div className={`editor-library editor-library-${uiState.editorMode}`}>
      <div className={"editor-library-scroller"}>
        <BuildingLibrary />
        <UnitLibrary />
      </div>
    </div>
  ) : null;
}
