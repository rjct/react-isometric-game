import { constants } from "../../constants";

import buildingTypes from "../../dict/buildings.json";
import { EditorLibraryItem } from "./EditorLibraryItem";
import { DictBuildings } from "../../engine/BuildingFactory";
import { useGameState } from "../../hooks/useGameState";

export function EditorLibrary() {
  const { uiState } = useGameState();

  return uiState.scene === "editor" ? (
    <div className={"editor-library"} style={{ height: constants.miniMap.height }}>
      <div className={"editor-library-scroller"}>
        {Object.values(buildingTypes as DictBuildings).map((building) => (
          <EditorLibraryItem key={building.type} item={building} />
        ))}
      </div>
    </div>
  ) : null;
}
