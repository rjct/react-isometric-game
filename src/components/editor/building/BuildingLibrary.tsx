import buildingTypes from "../../../dict/buildings.json";
import { BuildingLibraryItem } from "./BuildingLibraryItem";
import { DictBuildings } from "../../../engine/BuildingFactory";
import { useGameState } from "../../../hooks/useGameState";

export function BuildingLibrary() {
  const { uiState } = useGameState();

  return uiState.editorMode === "buildings" ? (
    <>
      {Object.values(buildingTypes as DictBuildings).map((building) => (
        <BuildingLibraryItem key={building.type} item={building} />
      ))}
    </>
  ) : null;
}
