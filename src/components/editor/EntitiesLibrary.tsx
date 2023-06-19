import { constants } from "../../constants";

import { useGameState } from "../../hooks/useGameState";
import { BuildingLibrary } from "./building/BuildingLibrary";
import { UnitLibrary } from "./unit/UnitLibrary";

export function EntitiesLibrary() {
  const { uiState } = useGameState();

  return uiState.scene === "editor" && (uiState.editorMode === "building" || uiState.editorMode === "unit") ? (
    <div className={"editor-library"} style={{ height: constants.miniMap.height }}>
      <div className={"editor-library-scroller"}>
        <BuildingLibrary />
        <UnitLibrary />
      </div>
    </div>
  ) : null;
}
