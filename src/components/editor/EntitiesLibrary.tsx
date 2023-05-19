import { constants } from "../../constants";

import { useGameState } from "../../hooks/useGameState";
import { BuildingLibrary } from "./building/BuildingLibrary";

export function EntitiesLibrary() {
  const { uiState } = useGameState();

  return uiState.scene === "editor" && uiState.editorMode === "building" ? (
    <div className={"editor-library"} style={{ height: constants.miniMap.height }}>
      <div className={"editor-library-scroller"}>
        <BuildingLibrary />
      </div>
    </div>
  ) : null;
}
